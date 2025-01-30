clientId = -1
isServer = false

function netplay_init() {
    socket = io();
	socket.on('set client id', function(_clientId) {
        console.log(_clientId)
		clientId = _clientId
    });
	socket.on('make controller', function(_clientId) {
		Bones.World.controllers.push(new Bones.World.Controller(_clientId))
    });
	socket.on('make player', function(_clientId) {
		Bones.World.players.push(new Bones.World.Player(_clientId))
    });
	socket.on('server player state', function(data) {
		for (let i = 0; i < Bones.World.players.length; i++){
			if (Bones.World.players[i].id == data[0]) {
				Bones.World.players[i].deserialize(data[1])
			}
		}
    });
	socket.on('server bullet state', function(data) {
		let state = JSON.parse(data[1]);
		for (let i = 0; i < Bones.World.bullets.length; i++){
			if (Bones.World.bullets[i].id == data[0]) {
				Bones.World.bullets[i].deserialize(data[1])
				console.log('deserialized server bullet state ' + data[0])
			}
		}
		if(state[8] != clientId) {
			let bullet_in_world = false
			for (let i = 0; i < Bones.World.bullets.length; i++){
				if (Bones.World.bullets[i].id == data[0]) {
					bullet_in_world = true
				}
			}
			if (!bullet_in_world) {
					let new_bullet = new Bones.World.Bullet(-1000, -1000, 0, 0, 1000, 0, 0, -1, data[0])
					new_bullet.deserialize(data[1])
					Bones.World.bullets.push(new_bullet)
					console.log('new bullet')
			}
		}
    });
	socket.on('server world state', function(data) {
		Bones.World.deserialize(data)
		Bones.World.load_map()
    });
	
	function networkloop() {
		for (let i = 0; i < Bones.World.controllers.length; i++) {
			if (clientId == Bones.World.controllers[i].id) {
				socket.emit('client controller state', Bones.World.controllers[i].serialize())
			}
		}
	}
	setInterval(networkloop, 20)
}