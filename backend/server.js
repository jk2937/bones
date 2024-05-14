const path = require('path');
const express = require('express');
const app = express()
const http = require('http')
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const PORT = 3000;
const HOST = '0.0.0.0';

app.use(express.static(path.join(__dirname, '/../frontend'), { dotfiles: 'allow' }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/../frontend/pages/index.html'));
});

const clients = {};

io.on('connection', (socket) => {
    clients[socket.id] = socket
    socket.emit('welcome message', 'Welcome user_' + socket.id + '!')
    console.log('a user connected');
    console.log('there are ' + Object.keys(clients).length + ' users online')
    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete clients[socket.id]
    });
    socket.on('control state message', (msg) => {
        console.log('recieved control state message: ' + msg);
        io.emit('control state message', msg)
    });
});

server.listen(PORT, HOST, () => {
    console.log('listening on ' + HOST + ':' + PORT);
});
