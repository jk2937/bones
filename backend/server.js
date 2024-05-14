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
let host_client = ''

io.on('connection', (socket) => {
    clients[socket.id] = socket
    socket.emit('welcome message', socket.id)
    //if (host_client == '') {
        host_client = socket.id
        socket.emit('user is host', 'true')
    //}
    io.emit('users online', Object.keys(clients))
    console.log('a user connected');
    console.log('there are ' + Object.keys(clients).length + ' users online')
    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete clients[socket.id]
        io.emit('user left', socket.id)
        io.emit('users online', Object.keys(clients))
    });
    socket.on('control state message', (msg) => {
        console.log('recieved control state message: ' + msg);
        out_msg = msg
        out_msg.id = socket.id
        io.emit('control state message', out_msg)
    });

    socket.on('player positions', function(msg) {
        io.emit('player positions', msg)
    });


});

server.listen(PORT, HOST, () => {
    console.log('listening on ' + HOST + ':' + PORT);
});
