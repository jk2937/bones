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

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('controller message', (msg) => {
        console.log('message: ' + msg);
    });
});

server.listen(PORT, HOST, () => {
    console.log('listening on ' + HOST + ':' + PORT);
});
