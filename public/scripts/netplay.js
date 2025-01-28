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
	
	function networkloop() {
		for (let i = 0; i < Bones.World.controllers.length; i++) {
			if (clientId == Bones.World.controllers[i].id) {
				socket.emit('client controller state', Bones.World.controllers[i].serialize())
			}
		}
	}
	setInterval(networkloop, 20)
}