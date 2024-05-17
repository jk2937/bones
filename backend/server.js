const path = require('path');
const express = require('express');
const app = express()
const http = require('http')
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const PORT = 30;
const HOST = '0.0.0.0';

app.use(express.static(path.join(__dirname, '/../frontend'), { dotfiles: 'allow' }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/../frontend/pages/index.html'));
});

const clients = {};
let host_client = ''

io.on('connection', (socket) => {
    socket.on('client welcome message', function(msg) {
        clients[socket.id] = socket
        socket.emit('welcome message', socket.id)
        if (host_client == '') {
            host_client = socket.id
            socket.emit('user is host', 'true')
        }
        io.emit('users online', Object.keys(clients))
        console.log('a user connected');
        console.log('there are ' + Object.keys(clients).length + ' users online')
        socket.on('disconnect', () => {
            console.log('user disconnected');
            delete clients[socket.id]
            io.emit('user left', socket.id)
            io.emit('users online', Object.keys(clients))
            if (host_client == socket.id) {
                host_client = ''
                console.log('host disconnected')
                if (Object.keys(clients).length > 0) {
                    let key = Object.keys(clients)[0]    
                    host_client = key
                    console.log('new host ' + host_client)
                    console.log('WARNING do not use this feature during production')
                    clients[key].emit('user is host', 'true')
                }
            }
        });
        socket.on('request ping call from host', function(msg) {
            console.log('got \'request ping call from host\' message')
            //send 'ping call request' to host_client           
            clients[host_client].emit('ping call request', { 'requester client id': socket.id })
        });
        socket.on('request ping response from client', function(msg) {
            console.log('got \'request ping response from client\' message')
            //send 'ping response request' to client
            clients[msg['requester client id']].ping_timestamp = msg.timestamp
            clients[msg['requester client id']].emit('ping response request', '')
        });
        socket.on('send ping response to host', function(msg) {
            console.log('got \'send ping response to host\' message')
            //send 'ping response' to host_client
            clients[host_client].emit('ping response', { 'requester client id': socket.id, 'timestamp': clients[socket.id].ping_timestamp })
        });

        socket.on('player ping', function(msg) {
            io.emit('player ping', msg)
        });

        socket.on('control state message', (msg) => {
            console.log('recieved control state message: ' + msg);
            out_msg = msg
            out_msg.id = socket.id
            io.emit('control state message', out_msg)
        });

        socket.on('player positions', function(msg) {
            if (socket.id == host_client) {
                io.emit('player positions', msg)
            }
            else {
                //todo: test this
                console.log('non host user attempted host command')
            }
        });

        socket.on('prop positions', function(msg) {
            if (socket.id == host_client) {
                io.emit('prop positions', msg)
            }
            else {
                //todo: test this
                console.log('non host user attempted host command')
            }
        });
    });

});

server.listen(PORT, HOST, () => {
    console.log('listening on ' + HOST + ':' + PORT);
});
