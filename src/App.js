import React, { Component } from 'react';

import MessageBox from './components/MessageBox';
import MessageForm from './components/MessageForm';
import OnlineUsers from './components/OnlineUsers';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connectionReady: false,
            userName: null,
            users: [],
            messages: []
        };

        this.messageHandler = this.messageHandler.bind(this);
        this.nameSubmit = this.nameSubmit.bind(this);
        this.messageSubmit = this.messageSubmit.bind(this);

        const url = 'ws://10.17.9.63:7475';
        this.socket = new WebSocket(url);

        this.socket.onmessage = this.messageHandler;
    }

    componentWillMount() {
        const userName = localStorage.getItem('userName');

        const trySubmitName = () => {
            if(this.socket.readyState === 1){
                if(userName !== null) {
                    this.nameSubmit(userName);
                }
                this.setState({connectionReady: true});
            } else {
                setTimeout(trySubmitName, 100);
            }
        };

        trySubmitName();
    }

    sendMessage(action) {
        this.socket.send(JSON.stringify(action));
    }

    messageHandler(message) {
        const response = JSON.parse(message.data);

        switch(response.action) {
            case 'INIT':
                console.log('INIT');
                this.setState({messages: response.payload.messages, users: response.payload.users});
                break;
            case 'UPDATE_USERS':
                console.log('UPDATE_USERS');
                this.setState({users: response.payload});
                break;
            case 'NEW_MESSAGE':
                console.log('NEW_MESSAGE');
                this.setState({messages: this.state.messages.concat({...response.payload})});
                break;
            default:
                console.log('no action for ' + response.action);
        }
    }

    nameSubmit(name) {
        this.sendMessage({
            action: 'NEW_USER',
            payload: name
        });

        this.setState({userName: name});
        localStorage.setItem('userName', name);
    }

    messageSubmit(message) {
        this.sendMessage({
            action: 'NEW_MESSAGE',
            payload: message
        })
    }

    render() {
        const { userName, users, messages, connectionReady } = this.state;

        return <div>
            <div className='wrapper'>
                <div className='row'>
                    <div className='col-xs-9'>
                        <MessageBox
                            messages={messages}
                            currentUser={userName}
                        />
                        <div className='col-xs-10 col-xs-offset-1'>
                            {connectionReady &&
                                <MessageForm
                                    type={userName ? 'message' : 'name'}
                                    nameSubmit={this.nameSubmit}
                                    messageSubmit={this.messageSubmit}
                                />
                            }
                        </div>
                    </div>
                    <div className='col-xs-3'>
                        <OnlineUsers
                            users={users}
                        />
                    </div>
                </div>
            </div>
        </div>
    }
}

export default App;