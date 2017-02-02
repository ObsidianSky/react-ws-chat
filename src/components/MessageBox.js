import React, { Component } from 'react';

class MessageBox extends Component {
    render() {
        const messages = this.props.messages.map((message, index) => {
            return <div key={index}><b>{message.user}</b> {message.text}</div>
        });

        return <div className='panel panel-default'>
            <div className='panel-heading'>Chat room</div>
            <div className='panel-body'>{messages}</div>
        </div>
    }
}

export default MessageBox;