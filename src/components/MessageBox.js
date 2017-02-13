import React, { Component } from 'react';

class MessageBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messagesAmount: this.props.messages
        };
    }
    componentDidMount() {
        const scrollTop = this.messageBox.scrollHeight - this.messageBox.clientHeight;

        if(scrollTop > 0) {
            this.messageBox.scrollTop = scrollTop;
        }
    }
    componentWillUnmount() {

    }
    componentDidUpdate(prevProps, prevState) {

    }
    render() {
        const { currentUser } = this.props;
        const messages = this.props.messages.map((message, index) => {
            if(currentUser === message.user) {
                return <div key={index}><b>You ({message.user}):</b> {message.text}</div>
            }

            return <div key={index}><b>{message.user}:</b> {message.text}</div>
        });

        return <div className='panel panel-default'>
            <div className='panel-heading'>Chat room</div>
            <div className='panel-body' ref={(container) => { this.messageBox = container; }}>
                {messages}
            </div>
        </div>
    }
}

export default MessageBox;