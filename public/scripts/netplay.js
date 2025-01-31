clientId = -1
isServer = false
ping_start = Date.now()
ping_end = Date.now()
ping = 0
most_recent_timestamp = -1

/*ping2_start = Date.now()
ping2_end = Date.now()
ping2 = 0*/


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
		if(data[2] > most_recent_timestamp) {
			most_recent_timestamp = data[2]
			ping_end = Date.now()
			ping_start = most_recent_timestamp
			ping = ping_end - ping_start
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
		//if(state[8] != clientId) {
			let bullet_in_world = false
			for (let i = 0; i < Bones.World.bullets.length; i++){
				if (Bones.World.bullets[i].id == data[0]) {
					bullet_in_world = true
				}
			}
			if (!bullet_in_world) {
					let new_bullet = new Bones.World.Bullet(data[1][0], data[1][1], 0, 0, 1000, 0, 0, -1, data[0])
					new_bullet.deserialize(data[1])
					Bones.World.bullets.push(new_bullet)
					console.log('new bullet')
			}
		//}
    });
	socket.on('server bullet deactivate', function(data) {
		for(i = 0; i < Bones.World.bullets.length; i++) {
			if(Bones.World.bullets[i].id == data) {
				Bones.World.bullets[i].deactivate()
				console.log('deactivated bulled')
			}
		}
    });
	socket.on('server world state', function(data) {
		Bones.World.deserialize(data)
		Bones.World.load_map()
    });
	socket.on('server ping response', function(data) {
		ping2_end = Date.now()
		pint2_start = data[0]
		ping2 = ping2_end - data[0]
    });
	
	function networkloop() {
		for (let i = 0; i < Bones.World.controllers.length; i++) {
			if (clientId == Bones.World.controllers[i].id) {
				ping_start = Date.now()
				socket.emit('client controller state', [Bones.World.controllers[i].serialize(), ping_start])
			}
		}
	}
	/*function pingloop() {
		ping2_start = Date.now()
		socket.emit('client ping request', [ping2_start])
	}*/
	setInterval(networkloop, 200)
	//setInterval(pingloop, 200)
}