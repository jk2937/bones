const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');

app.use(express.static('public'));

isServer = true

function _import(file) {
	// Read the contents of myScript.js
	const scriptContent = fs.readFileSync(file, 'utf8');

	// Evaluate the script content
	eval(scriptContent);
}

_import('./public/scripts/box.js')
_import('./public/scripts/skin.js')
_import('./public/scripts/bones_animation.js')
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
	
	socket.on('client controller state', (data) => {
		for (let i = 0; i < Bones.World.controllers.length; i++) {
			if (Bones.World.controllers[i].id == clientId) {
				Bones.World.controllers[i].deserialize(data)
			}
		}
	});
	
	function sendloop() {
		for (i = 0; i < Bones.World.players.length; i++) {
			socket.emit('server player state', [Bones.World.players[i].id, Bones.World.players[i].serialize()])
			socket.broadcast.emit('server player state', [Bones.World.players[i].id, Bones.World.players[i].serialize()])
		}
	}
	
	setInterval(sendloop, 0);

	socket.on('disconnect', () => {
		for (let i = 0; i < Bones.World.players.length; i++) {
			if (Bones.World.players[i].id == clientId) {
				Bones.World.players[i].deactivate()
			}
		}
	});
});

http.listen(3000, () => {
	console.log('Server running on port 3000');
});