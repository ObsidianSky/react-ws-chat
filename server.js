'use strict';

const http = require('http');
const WebSocketServer = require('ws').Server;
const nstatic = require('node-static');
const httpPort = 7474;
const wsPort = 7475;
const file = new nstatic.Server('./build');

const httpServer = http.createServer((req, res) => {
    req.addListener('end', function () {
        file.serve(req, res);
    }).resume();
});

httpServer.listen(httpPort);

const wss = new WebSocketServer({
    port: wsPort
});

const users = [];
const messageHistory = [];

wss.on('connection', (ws) => {
    let userName;

    //send message history to the new user
    ws.send(JSON.stringify({
        action: 'INIT',
        payload: {
            messages: messageHistory,
            users
        }
    }));

    ws.on('message', (msg) => {
        const message = JSON.parse(msg);

        switch (message.action) {
            case 'NEW_USER':
                //set new user name
                userName = message.payload ? message.payload.replace(/\W/g, '_') : `User${users.length}`;
                users.push(userName);

                //notify about changes in users list
                sendUsersList();
                break;

            case 'NEW_MESSAGE':
                const userMessage = {
                    action: 'NEW_MESSAGE',
                    payload: {
                        text: message.payload.trim(),
                        user: userName
                    }
                };

                if(userMessage.payload.text.length === 0) return;
                //add message to history
                messageHistory.push(userMessage.payload);
                //send new message to all users
                sendToAll(userMessage);
                break;

            default:
                console.log('No action for such case' + message.action);
        }
    });

    ws.on('close', (msg) => {
        // remove user from users list
        const userIndex = users.indexOf(userName);
        users.splice(userIndex, 1);

        //notify about changes in users list
        sendUsersList();
    });
});

function sendToAll(message) {
    wss.clients.forEach((client) => {
        client.send(JSON.stringify(message));
    });
}

function sendUsersList() {
    const message = {
        action: 'UPDATE_USERS',
        payload: users
    };
    sendToAll(message);
}