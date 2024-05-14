let netplay_controller = false
let netplay_welcome_message = ''
let netplay_users_online = []
var socket = io()

netplay_world_loaded = false

function netplay_init() {
    function activate_netplay_controller () {
        netplay_controller = true

        console.log('neplay controller activated')
    }

    socket.on('welcome message', function(msg) {
        console.log('recieved control state message')
        console.log(msg)
        netplay_welcome_message = msg
    });

    socket.on('control state message', function(msg) {
        if (msg.id in Bones.World.players) {
            console.log('recieved control state message')
            console.log(msg.move_jump)
            Bones.World.players[msg.id].move_left = msg.move_left;
            Bones.World.players[msg.id].move_right = msg.move_right;
            Bones.World.players[msg.id].move_jump = msg.move_jump;
        }
        else {

        }
    });

    socket.on('users online', function(msg) {
        console.log('users online: ' + msg)
        netplay_users_online = msg
        if (netplay_world_loaded == false) {
            netplay_world_loaded = true
            Bones.World.init()
            Bones.start()
        }
        else {
            Bones.World.init_new_players()
        }
    });

    socket.on('user left', function(msg) {
        Matter.Composite.remove(Bones.World.Physics.matterjs_world, Bones.World.players[msg].physics_prop.body)
        delete Bones.World.players[msg]
        delete Bones.World.controllers[msg]
    });

    socket.on('player positions', function(msg) {
        console.log('player positions')
        console.log(msg)
    });

    activate_netplay_controller()

    socket.on('user is host', function(msg) {
        console.log('user is host')
        function send_player_positions() {
            console.log('sending player positions')
            for (let i = 0; i < Object.keys(Bones.World.players).length; i++) {
                let key = Object.keys(Bones.World.players)[i]
                socket.emit('player positions', 
                    {
                        'id': key,
                        'x': Bones.World.players[key].x,
                        'y': Bones.World.players[key].y,
                    }
                )
            }
        }
        setInterval(send_player_positions, 1000);
    });
}
