let netplay_controller = false
let netplay_welcome_message = ''
let netplay_users_online = []
var socket = io()

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
        if (msg.id) {
            console.log('recieved control state message')
            console.log(msg.move_jump)
            Bones.World.players[msg.id].move_left = msg.move_left;
            Bones.World.players[msg.id].move_right = msg.move_right;
            Bones.World.players[msg.id].move_jump = msg.move_jump;
        }
    });

    socket.on('users online', function(msg) {
        console.log('users online: ' + msg)
        netplay_users_online = msg
        Bones.World.init()
        Bones.start()
    });

    activate_netplay_controller()
}
