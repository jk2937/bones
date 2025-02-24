const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');

app.use(express.static('public'));

isServer = true

server_network_queue = []

function _import(file) {
	// Read the contents of myScript.js
	const scriptContent = fs.readFileSync(file, 'utf8');

	// Evaluate the script content
	eval(scriptContent);
}

_import('./public/scripts/box.js')
_import('./public/scripts/skin.js')
_import('./public/scripts/bones_animation.js')
_import('./public/scripts/test_animation.js')
_import('./public/scripts/menu_item.js')
_import('./public/scripts/bones_object.js')
_import('./public/scripts/renderer.js')
_import('./public/scripts/debug_display.js')
_import('./public/scripts/timer.js')
_import('./public/scripts/bones_functions.js')
_import('./public/scripts/world.js')
_import('./public/scripts/main.js')

id = 0
function getId(){
	ret_id = id;
	id = id + 1;
	return ret_id;
}

io.on('connection', (socket) => {
	console.log('A user connected');
	const clientId = getId();
	let most_recent_timestamp = -1;
	socket.emit('set client id', clientId);
	socket.emit('make controller', clientId);
	Bones.World.controllers.push(new Bones.World.Controller(clientId))

	socket.emit('make player', clientId);
	socket.broadcast.emit('make player', clientId);
	Bones.World.players.push(new Bones.World.Player(clientId))
	
	for (let i = 0; i < Bones.World.players.length; i++) {
		if (Bones.World.players[i].id != clientId) {
			socket.emit('make player', Bones.World.players[i].id);
			//socket.broadcast.emit('make player', Bones.World.players[i].id);
		}
	}
	for (i = 0; i < Bones.World.players.length; i++) {
		socket.emit('server player state', [Bones.World.players[i].id, Bones.World.players[i].serialize()])
		socket.broadcast.emit('server player state', [Bones.World.players[i].id, Bones.World.players[i].serialize()])
	}
	
	socket.on('client controller state', (data) => {
		if(data[1] > most_recent_timestamp) {
			most_recent_timestamp = data[1]
			for (let i = 0; i < Bones.World.controllers.length; i++) {
				if (Bones.World.controllers[i].id == clientId) {
					Bones.World.controllers[i].deserialize(data[0])
				}
			}
		}
	});
	socket.on('client ping request', function(data) {
		socket.emit('server ping response', data)
    });
	
	function sendloop() {
		for (let i = 0; i < server_network_queue.length; i++) {
			socket.emit(server_network_queue[i][0], server_network_queue[i][1])
			socket.broadcast.emit(server_network_queue[i][0], server_network_queue[i][1])
		}
		server_network_queue = []
		for (i = 0; i < Bones.World.players.length; i++) {
			socket.emit('server player state', [Bones.World.players[i].id, Bones.World.players[i].serialize(), most_recent_timestamp])
			socket.broadcast.emit('server player state', [Bones.World.players[i].id, Bones.World.players[i].serialize(), most_recent_timestamp])
			if(Bones.World.players[i].afk_timer > 60 * 30 && Bones.World.players[i].id == clientId){
				console.log('player afk')
				socket.disconnect()
			}
		}
		for (i = 0; i < Bones.World.bullets.length; i++) {
			socket.emit('server bullet state', [Bones.World.bullets[i].id, Bones.World.bullets[i].serialize()])
			socket.broadcast.emit('server bullet state', [Bones.World.bullets[i].id, Bones.World.bullets[i].serialize()])
		}
		socket.emit('server world state', Bones.World.serialize())
		socket.broadcast.emit('server world state', Bones.World.serialize())
		if(Bones.World.players.length == 0) {
			id = 0
		}
	}
	
	setInterval(sendloop, 20);

	socket.on('disconnect', () => {
		for (let i = 0; i < Bones.World.players.length; i++) {
			if (Bones.World.players[i].id == clientId) {
				Bones.World.players[i].deactivate()
				socket.broadcast.emit('server player state', [Bones.World.players[i].id, Bones.World.players[i].serialize()])
			}
		}
	});
});

http.listen(3047, () => {
	console.log('Server running on port 3047');
});
