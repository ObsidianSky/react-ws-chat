import React, { Component } from 'react';

class MessageForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: ''
        };

        this.submitHandler = this.submitHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }

    changeHandler(e) {
        this.setState({
            message: e.target.value
        });
    }

    submitHandler(e) {
        e.preventDefault();

        const { type, nameSubmit, messageSubmit } = this.props;
        const handler = type === 'name' ? nameSubmit : messageSubmit;



        handler(this.state.message);
        this.setState({
            message: ''
        });
    }

    render() {
        const { type } = this.props;

        return <form name='messageForm' onSubmit={this.submitHandler}>
            <div className='form-group'>
                <label htmlFor='messageText'>{type === 'name' ? 'Enter your name:' : 'Enter message:'}</label>
                <input type='text' className='form-control' id='messageText' onChange={this.changeHandler} value={this.state.message} autoComplete='off' />
            </div>
            <button type='submit' className='btn btn-block btn-primary btn-default' disabled={this.state.message.length === 0}>Submit</button>
        </form>
    }
}

export default MessageForm;