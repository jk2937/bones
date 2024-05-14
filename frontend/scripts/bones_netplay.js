let netplay_controller = false
var socket = io()
function activate_netplay_controller () {
    netplay_controller = true

    console.log('neplay controller activated')


    }

socket.on('control state message', function(msg) {
    console.log('recieved control state message')
        console.log(msg.move_jump)
        Bones.World.player1.move_left = msg.move_left;
        Bones.World.player1.move_right = msg.move_right;
        Bones.World.player1.move_jump = msg.move_jump;
    });

activate_netplay_controller()
