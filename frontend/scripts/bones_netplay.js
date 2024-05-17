function request_ping() {
    socket.emit('request ping call from host')
}

function send_player_positions() {
    //console.log('sending player positions')
    for (let i = 0; i < Object.keys(Bones.World.players).length; i++) {
        let key = Object.keys(Bones.World.players)[i]
        socket.emit('player positions', 
            {
                'id': key,
                'position': Bones.World.players[key].physics_prop.body.position,
                'velocity': Bones.World.players[key].physics_prop.body.velocity,
                'angle': Bones.World.players[key].physics_prop.body.angle,
                'angular_velocity': Bones.World.players[key].physics_prop.body.angularVelocity


            }
        )
    }
}
function send_prop_positions() {
    //console.log('sending prop positions')
    for (let i = 0; i < Bones.World.npcs.length; i++) {
        socket.emit('prop positions', 
            {
                'id': i,
                'position': Bones.World.npcs[i].physics_prop.body.position,
                'velocity': Bones.World.npcs[i].physics_prop.body.velocity,
                'angle': Bones.World.npcs[i].physics_prop.body.angle,
                'angular_velocity': Bones.World.npcs[i].physics_prop.body.angularVelocity
            }
        )
    }
}



let netplay_controller = false
let netplay_welcome_message = ''
let netplay_ping = 50
let netplay_user_is_host = false
let netplay_users_online = []
var socket = io()

netplay_world_loaded = false

function netplay_init() {
    function activate_netplay_controller () {
        netplay_controller = true
        setInterval(request_ping, 5000)
        //console.log('neplay controller activated')
    }

    socket.on('welcome message', function(msg) {
        //console.log('recieved control state message')
        //console.log(msg)
        netplay_welcome_message = msg
    });

    socket.on('ping call request', function(msg) {
        console.log('got \'ping call request\' message')
        //send 'request ping response from client' to server
        msg.timestamp = Date.now()
        socket.emit('request ping response from client', msg)
    });
    socket.on('ping response request', function(msg) {
        console.log('got \'ping response request\' message')
        //send 'send ping response to host' to server
        socket.emit('send ping response to host', '')
    });
    socket.on('ping response', function(msg) {
        console.log('got \'ping response\' message')
        let timestamp = Date.now()
        let ping = timestamp - msg.timestamp
        //calculate ping and emit to all clients and server with requesting client socket id
        socket.emit('player ping', { 'id': msg['requester client id'], 'ping': ping }) 
    });

    socket.on('player ping', function(msg) {
        if(msg.id == netplay_welcome_message) {
            netplay_ping = msg.ping
            console.log('player ping')
            console.log(netplay_ping)
        }
    });

    socket.on('control state message', function(msg) {
        if (msg.id in Bones.World.players) {
            //console.log('recieved control state message')
            //console.log(msg.move_jump)
            Bones.World.players[msg.id].move_left = msg.move_left;
            Bones.World.players[msg.id].move_right = msg.move_right;
            Bones.World.players[msg.id].move_jump = msg.move_jump;
        }
        else {

        }
    });

    socket.on('users online', function(msg) {
        //console.log('users online: ' + msg)
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
        //console.log('player positions')
        //console.log(msg)
        //Bones.World.players[msg.id].x = msg.x
        //Bones.World.players[msg.id].y = msg.y
        Matter.Body.set(Bones.World.players[msg.id].physics_prop.body, 'position', msg.position, null);
        Matter.Body.set(Bones.World.players[msg.id].physics_prop.body, 'velocity', msg.velocity, null);
        Matter.Body.set(Bones.World.players[msg.id].physics_prop.body, 'angle', msg.angle, null);
        Matter.Body.set(Bones.World.players[msg.id].physics_prop.body, 'angularVelocity', msg.angularVelocity, null);
    });

    socket.on('prop positions', function(msg) {
        //console.log('prop positions')
        //console.log(msg)
        
        Matter.Body.set(Bones.World.npcs[msg.id].physics_prop.body, 'position', msg.position, null);
        Matter.Body.set(Bones.World.npcs[msg.id].physics_prop.body, 'velocity', msg.velocity, null);
        Matter.Body.set(Bones.World.npcs[msg.id].physics_prop.body, 'angle', msg.angle, null);
        Matter.Body.set(Bones.World.npcs[msg.id].physics_prop.body, 'angularVelocity', msg.angular_velocity, null);
    });

    socket.on('user is host', function(msg) {
        //console.log('user is host')
        netplay_user_is_host = true
        function send_player_positions() {
            //console.log('sending player positions')
            for (let i = 0; i < Object.keys(Bones.World.players).length; i++) {
                let key = Object.keys(Bones.World.players)[i]
                socket.emit('player positions', 
                    {
                        'id': key,
                        'position': Bones.World.players[key].physics_prop.body.position,
                        'velocity': Bones.World.players[key].physics_prop.body.velocity,
                        'angle': Bones.World.players[key].physics_prop.body.angle,
                        'angular_velocity': Bones.World.players[key].physics_prop.body.angularVelocity
 

                    }
                )
            }
        }
        function send_prop_positions() {
            //console.log('sending prop positions')
            for (let i = 0; i < Bones.World.npcs.length; i++) {
                socket.emit('prop positions', 
                    {
                        'id': i,
                        'position': Bones.World.npcs[i].physics_prop.body.position,
                        'velocity': Bones.World.npcs[i].physics_prop.body.velocity,
                        'angle': Bones.World.npcs[i].physics_prop.body.angle,
                        'angular_velocity': Bones.World.npcs[i].physics_prop.body.angularVelocity
                    }
                )
            }
        }
        setInterval(send_player_positions, 1000);
        setInterval(send_prop_positions, 250);
    });

    activate_netplay_controller()

    socket.emit('client welcome message', 'true')
}
