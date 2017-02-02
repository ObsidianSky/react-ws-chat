import React, { Component } from 'react';

class OnlineUsers extends Component {
    render() {
        const users = this.props.users.map((user, index) => {
            return <div key={index}>{user}</div>
        });

        return <div className='panel panel-default'>
            <div className='panel-heading'>Users online</div>
            <div className='panel-body'>{users}</div>
        </div>
    }
}

export default OnlineUsers;