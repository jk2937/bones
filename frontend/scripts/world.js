function bounding_box(x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(
        ((y1 + h1) < (y2)) ||
        (y1 > (y2 + h2)) ||
        ((x1 + w1) < x2) ||
        (x1 > (x2 + w2))
    );
}

Bones.World = {
    init() {
        this.width = 1920
        this.height = 1080

        this.Physics = new Object()
        this.Physics.matterjs_engine = Matter.Engine.create();
        this.Physics.matterjs_world = this.Physics.matterjs_engine.world;

        this.controllers = {}
        this.players = {}

        this.box_props = []
        //console.log('netplay users length ' + netplay_users_online.length)
        for (let i = 0; i < netplay_users_online.length; i++) {
            this.controllers[netplay_users_online[i]] = new this.Controller()
            this.players[netplay_users_online[i]] = new this.PhysicsPlayer(100, 0)
        }

        this.menu_items = []
        this.create_menu_item(Bones.Renderer.width - 280, 50, 250, 300, "Menu", function() {})
        this.create_menu_item(Bones.Renderer.width - 280 + 5, 50 + 45, 250 - 10, 30, "Reset", function() { Bones.World.init() })
        this.create_menu_item(Bones.Renderer.width - 280 + 5, 50 + 40 * 2, 250 - 10, 30, "Add Physics Object", function() { Bones.World.npcs.push(new Bones.World.NPC()) })

        // this.create_menu_item(Bones.Renderer.width - 280 + 5, 50 + 40 * 3, 250 - 10, 30, "Camera Mode", function() { Bones.DebugDisplay.test_camera = true }, function() { Bones.DebugDisplay.test_camera = false }, "toggle")

        //this.create_box_prop(400, 200, 80, 80)
        //this.create_box_prop(450, 50, 80, 20)


        this.walls = []
        this.walls.push(new this.MapTile(1920 / 2, -500, 1920 + 1000, 1000, anchored=true))
        this.walls.push(new this.MapTile(1920 / 2, 1080 + 500, 1920 + 1000, 1000, anchored=true))
        this.walls.push(new this.MapTile(-500, 1080 / 2, 1000, 1080 + 1000, anchored=true))
        this.walls.push(new this.MapTile(1920 + 500, 1080 / 2, 1000, 1080 + 1000, anchored=true))

        this.walls.push(new this.MapTile(1920 / 2, 1080 - 200, 500, 10, anchored=true))
        //npc init

        this.npcs = []
        for (i = 0; i < 7; i++){
            this.npcs.push(new this.NPC())
        }


    }, // END FUNCTION init
    init_new_players() {
        for (let i = 0; i < netplay_users_online.length; i++) {
            if(netplay_users_online[i] in this.controllers == false) {
                this.controllers[netplay_users_online[i]] = new this.Controller()
            }
            if(netplay_users_online[i] in this.players == false) {
                this.players[netplay_users_online[i]] = new this.PhysicsPlayer(0, 0)
            }
        }
    },
    tick() {
        let client_player = this.players[netplay_welcome_message] 
        Bones.Renderer.camera_x = (client_player.physics_prop.body.position.x + client_player.width / 2 - Bones.Renderer.width / 2 + Bones.Renderer.camera_x * 19) / 20
        Bones.Renderer.camera_y = (client_player.physics_prop.body.position.y + client_player.height / 2 - Bones.Renderer.height / 2 + Bones.Renderer.camera_y * 19) / 20
        if (Bones.Renderer.camera_x > this.width - Bones.Renderer.width) {
            Bones.Renderer.camera_x = this.width - Bones.Renderer.width
        }
        if (Bones.Renderer.camera_x < 0) {
            Bones.Renderer.camera_x = 0
        }
        if (Bones.Renderer.camera_y > this.height - Bones.Renderer.height) {
            Bones.Renderer.camera_y = this.height - Bones.Renderer.height
        }
        if (Bones.Renderer.camera_y < 0) {
            Bones.Renderer.camera_y = 0
        }

        Bones.Renderer.context.drawImage(Bones.Assets.gfx_ice_background, -Bones.Renderer.camera_x, -Bones.Renderer.camera_y, 1920, 1080)

        Bones.Renderer.context.font = "18px Monospace";
        Bones.Renderer.context.fillStyle = "Black";
        Bones.Renderer.context.textAlign = "center";
        Bones.Renderer.context.fillText("Bones \"Alpha\" v0.0.9 - user id: " + netplay_welcome_message + ' - user is host: ' + netplay_user_is_host + ' - ping: ' + netplay_ping, Bones.Renderer.canvas.width / 2, 20)

        Bones.Input.process_buffers()

        // Todo: Combine player code into Bones.Input.keys_read_controls, read all keystates with || keystate_this_frame

        if (Bones.DebugDisplay.test_camera == true) {
            if (Bones.Input.Keyboard.ControlStates["right"].pressed || Bones.Input.Keyboard.ControlStates["right"].pressed_this_frame) {
                Bones.Renderer.camera_x += 5 * Bones.Timer.delta_time * Bones.Timer.timescale
            }
            if (Bones.Input.Keyboard.ControlStates["left"].pressed || Bones.Input.Keyboard.ControlStates["left"].pressed_this_frame) {
                Bones.Renderer.camera_x -= 5 * Bones.Timer.delta_time * Bones.Timer.timescale
            } 
            if (Bones.Input.Keyboard.ControlStates["up"].pressed || Bones.Input.Keyboard.ControlStates["up"].pressed_this_frame) {
                Bones.Renderer.camera_y -= 5 * Bones.Timer.delta_time * Bones.Timer.timescale
            }
            if (Bones.Input.Keyboard.ControlStates["down"].pressed || Bones.Input.Keyboard.ControlStates["down"].pressed_this_frame) {
                Bones.Renderer.camera_y += 5 * Bones.Timer.delta_time * Bones.Timer.timescale
            } 
            this.player1.tick()
        }

        if (Bones.DebugDisplay.debug_simple_player_movement == true) {
            if (move_right) {
                this.player1.x += 5 * Bones.Timer.delta_time * Bones.Timer.timescale
            }
            if (move_left) {
                this.player1.x -= 5 * Bones.Timer.delta_time * Bones.Timer.timescale
            }
        }
        if (Bones.DebugDisplay.test_simple_player_movement != true && Bones.DebugDisplay.test_camera != true) {
            for (let i = 0; i < Object.keys(this.controllers).length; i++){
                let key = Object.keys(this.controllers)[i]
                // console.log('key ' + key)
                // console.log('netplay_users_online ' + netplay_users_online)
                if (key in this.players) {
                    this.controllers[key].read_keyboard_controls()
                    //if(netplay_controller == false) {
                        //this.players[key].read_keyboard_controls()
                    //} else {
                    //}
                    this.players[key].tick()
                }
            }
        }

        //if(Bones.Input.Keyboard.ControlStates["savestate"].pressed_this_frame) {
            //console.log('savestate')
            client_player.save_rewind_buffer()
        //}

        if(Bones.Input.Keyboard.ControlStates["loadstate"].pressed_this_frame) {
            console.log('loadstate')
            client_player.load_rewind_buffer()
        }

        if (netplay_controller == true && this.controllers[netplay_welcome_message].control_state_changed) {
            //console.log('debug: sending control state message')
            socket.emit('control state message', 
                { 
                  'move_left': this.controllers[netplay_welcome_message].move_left,
                  'move_right': this.controllers[netplay_welcome_message].move_right,
                  'move_jump': this.controllers[netplay_welcome_message].move_jump });
        }

for (let i = 0; i < this.npcs.length; i++) {
        this.npcs[i].tick()
    }

    Matter.Engine.update(this.Physics.matterjs_engine, Bones.Timer.delta_time)

    for (let i = 0; i < this.box_props.length; i++) {
        this.box_props[i].render()
    }


    // Todo: move this

    if (Bones.DebugDisplay.physics_wireframe == true) {
        var bodies = Matter.Composite.allBodies(this.Physics.matterjs_engine.world)

        Bones.Renderer.context.save()

        Bones.Renderer.context.beginPath();

        for (var i = 0; i < bodies.length; i++) {
            var vertices = bodies[i].vertices;

            Bones.Renderer.context.moveTo(vertices[0].x - Bones.Renderer.camera_x, vertices[0].y - Bones.Renderer.camera_y);

            for (var j = 1; j < vertices.length; j += 1) {
                Bones.Renderer.context.lineTo(vertices[j].x - Bones.Renderer.camera_x, vertices[j].y - Bones.Renderer.camera_y);
            }

            Bones.Renderer.context.lineTo(vertices[0].x - Bones.Renderer.camera_x, vertices[0].y - Bones.Renderer.camera_y);
        }

        Bones.Renderer.context.lineWidth = 1;
        Bones.Renderer.context.strokeStyle = '#999';
        Bones.Renderer.context.stroke();

        Bones.Renderer.context.restore()
    }

 for (let i = 0; i < this.menu_items.length; i++) {
            this.menu_items[i].read_input()
            this.menu_items[i].render()
         }

Bones.Renderer.context.font = "18px Monospace";
    Bones.Renderer.context.fillStyle = "Gray";
    Bones.Renderer.context.textAlign = "center";

    Bones.Renderer.context.fillText("Controls:", Bones.Renderer.width - 280 + 125 + 5, 50 + 200)
    Bones.Renderer.context.fillText("A, D ............ Move", Bones.Renderer.width - 280 + 125 + 5, 50 + 200 + 30)
    Bones.Renderer.context.fillText("SPACE ........... Jump", Bones.Renderer.width - 280 + 125 + 5, 50 + 200 + 60)

    for (let i = 0; i < this.npcs.length; i++) {
        this.npcs[i].render()
    }

    Bones.DebugDisplay.render()
        for (let i = 0; i < Object.keys(this.controllers).length; i++){
            let key = Object.keys(this.controllers)[i]
            this.players[key].render()
        }
        if (Bones.DebugDisplay.stress_test == true) {
            rand = 1
            if (Bones.DebugDisplay.stress_random) {
                rand = Math.random() * Bones.DebugDisplay.stress_loops;
            }
            for (i = 0; i < Bones.DebugDisplay.stress_loops * rand; i++) {
                Bones.Renderer.context.fillText("", 0, 0)
            }
        }
    }, // END FUNCTION tick
    create_menu_item(x, y, width, height, text, on_activate_function, on_deactivate_function, mode='default') {
        this.menu_items.push(new MenuItem(x, y, width, height, text, on_activate_function, on_deactivate_function, mode=mode))
    },
    MapTile: class {
        constructor(x, y, width, height) {
            this.x = x
            this.y = y
            this.width = width
            this.height = height
            this.physics_prop = new Bones.World.BoxProp(new Box(this.x, this.y, this.width, this.height), 0, true)
        }
    },
    create_box_prop(x, y, width, height, anchored=false) {
        let prop = new this.BoxProp(new Box(x, y, width, height), 0, anchored)
        this.box_props.push(prop)
        return prop
    },
    create_circle_prop(x, y, radius, anchored=false) {
        let prop = new this.CircleProp(x, y, radius, 0, anchored)
        this.box_props.push(prop)
        return prop
    },
     
    CircleProp: class {
        constructor(x, y, radius, angle, anchored) {
            this.x = x
            this.y = y

            this.angle = angle;

            this.radius = radius;

            this.anchored = anchored;

            this.body = Matter.Bodies.circle(this.x, this.y, this.radius, {
                isStatic: this.anchored
            })
            Matter.Composite.add(Bones.World.Physics.matterjs_world, [this.body]);
        }
        render() {
            this.pos = this.body.position;
            this.angle = this.body.angle;
            this.x = this.pos.x;
            this.y = this.pos.y;
            Bones.Renderer.context.save()
            Bones.Renderer.context.fillStyle = "white";
            Bones.Renderer.context.translate(this.x - Bones.Renderer.camera_x, this.y - Bones.Renderer.camera_y);
            Bones.Renderer.context.rotate(this.angle);

            Bones.Renderer.context.fillRect(0 - this.w / 2, 0 - this.h / 2, this.w, this.h);
            Bones.Renderer.context.restore()
        }
    }, // END CLASS BoxProp


    BoxProp: class {
        constructor(box, angle, anchored) {
            this.x = box.x
            this.y = box.y

            this.angle = angle;

            this.w = box.width
            this.h = box.height

            this.anchored = anchored;

            this.body = Matter.Bodies.rectangle(this.x, this.y, this.w, this.h, {
                isStatic: this.anchored
            })
            Matter.Composite.add(Bones.World.Physics.matterjs_world, [this.body]);
        }
        render() {
            this.pos = this.body.position;
            this.angle = this.body.angle;
            this.x = this.pos.x;
            this.y = this.pos.y;
            Bones.Renderer.context.save()
            Bones.Renderer.context.fillStyle = "white";
            Bones.Renderer.context.translate(this.x - Bones.Renderer.camera_x, this.y - Bones.Renderer.camera_y);
            Bones.Renderer.context.rotate(this.angle);

            Bones.Renderer.context.fillRect(0 - this.w / 2, 0 - this.h / 2, this.w, this.h);
            Bones.Renderer.context.restore()
        }
    }, // END CLASS BoxProp
    NPC: class {
        constructor() {
            //npc init

            this.x = 400;
            this.y = 100;

            this.radius = 50;

            this.animation = new Animation();

            this.x_vel = 0;
            this.y_vel = 0;

            this.stuck_time = 0;

            this.kicks_counter = 0;
            this.kicks_per_minute = 0
            this.kick_timer = 0

            this.physics_prop = Bones.World.create_circle_prop(this.x, this.y, this.radius)
            this.physics_prop.body.density = 0.000001
            this.physics_prop.body.restitution = 0.9
        }
        calculate_kicks_per_minute() {
            this.kicks_per_minute = this.kicks_counter
            this.kicks_counter = 0
        }
        tick() {
            /*
            this.kick_timer += 1 * Bones.Timer.delta_time * Bones.Timer.timescale
            if (this.kick_timer > 60 * 60) {
                this.kick_timer -= 60 * 60
                this.calculate_kicks_per_minute()
            }
            this.x += this.x_vel * Bones.Timer.delta_time * Bones.Timer.timescale
            this.y += this.y_vel * Bones.Timer.delta_time * Bones.Timer.timescale
            */
            /* For top down mode:
            this.y_vel = this.y_vel / 2;
            this.x_vel = this.x_vel / 2; */
            /*
            if (this.x < 0 - this.w) {
                this.x = Bones.Renderer.width;
            }
            if (this.y < 0) {
                this.y = 0
                this.y_vel = 0 - this.y_vel
                if (this.y_vel > 0) {
                    this.y_vel = 0;
                }
            }
            if (this.x > Bones.Renderer.width) {
                this.x = -25;
            }
            if (this.y > Bones.Renderer.height - this.h) {
                this.x_vel = this.x_vel * 0.7 
                this.y = Bones.Renderer.height - this.h;
                this.y_vel = 0 - this.y_vel * 0.7 
                if (this.y_vel > 0) {
                    this.y_vel = 0;
                }
            }


            if (this.y_vel <= 1 && this.y_vel >= -1 &&
                this.x_vel <= 1 && this.x_vel >= -1) {
                this.stuck_time += 1 * Bones.Timer.delta_time * Bones.Timer.timescale;
                if (this.stuck_time > 10) {
                    this.stuck_time = 0
                    this.kicks_counter ++
                    this.y_vel = (Math.floor(Math.random() * 100) - 50)// * Bones.Timer.delta_time * Bones.Timer.timescale
                    this.x_vel = (Math.floor(Math.random() * 100) - 50)// * Bones.Timer.delta_time * Bones.Timer.timescale
                }
            }
            this.y_vel += 1 * Bones.Timer.delta_time * Bones.Timer.timescale
            */
            this.x = this.physics_prop.x
            this.y = this.physics_prop.y
        }
        render() {
            this.animation.render(this.physics_prop)
        }
    }, // END CLASS NPC


    PhysicsPlayer: class {
        constructor(x, y) {
            this.x = x
            this.y = y

            this.width = 20
            this.height = 120

            this.move_left = false;
            this.move_right = false;
            this.move_jump = false;
        
            this.previous_frame_move_left = false;
            this.previous_frame_move_right = false;
            this.previous_frame_move_jump = false;

            this.control_state_changed = false;

            this.idle_animation = new PlayerAnimation();

            this.walk_right_animation = new PlayerAnimation()
            this.walk_right_animation.skins = [
            new Skin(Bones.Assets.gfx_man_standing, 0, 0, 100, 100, 0, 0, 150, 150),
            new Skin(Bones.Assets.gfx_man_walking_flip, 0, 0, 100, 100, 0, 0, 150, 150),
            new Skin(Bones.Assets.gfx_man_running_flip, 0, 0, 100, 100, 0, 0, 150, 150),
            new Skin(Bones.Assets.gfx_man_walking_flip, 0, 0, 100, 100, 0, 0, 150, 150),
        ]
            this.walk_right_animation.x = -62
            this.walk_right_animation.y = -15

            this.walk_left_animation = new PlayerAnimation();
            this.walk_left_animation.skins = [
            new Skin(Bones.Assets.gfx_man_standing_flip, 0, 0, 100, 100, 0, 0, 150, 150),
            new Skin(Bones.Assets.gfx_man_walking, 0, 0, 100, 100, 0, 0, 150, 150),
            new Skin(Bones.Assets.gfx_man_running, 0, 0, 100, 100, 0, 0, 150, 150),
            new Skin(Bones.Assets.gfx_man_walking, 0, 0, 100, 100, 0, 0, 150, 150),
        ]
            this.walk_left_animation.x = -62 
            this.walk_left_animation.y = -15 



            this.jump_animation = new PlayerAnimation();
            this.jump_animation.skins = [
            new Skin(Bones.Assets.gfx_man_dancing, 0, 0, 100, 100, 0, 0, 150, 150),
        ]
            this.jump_animation.x = -62 
            this.jump_animation.y = -15 


            this.physics_prop = new Bones.World.BoxProp(new Box(this.x, this.y, this.width, this.height), 0, false)
            this.movement_speed = 1;
            this.x = 25;
            this.y = 0;
            this.x_vel = 0;
            this.y_vel = 0;
            this.max_x_vel = 7
            this.max_y_vel = 70
            this.x_acc = 1
            this.y_acc = 10 // Todo: air acceleration, air max vel, run speed, bunny hopping
            this.ground_friction = 0.55
            this.air_friction = 0.05
            this.gravity = 0.25
            this.facing_right = true

            this.rewind_buffer = []

        }
        read_keyboard_controls() { //Todo: fix redundancy with controller
            this.control_state_changed = false;
            if (this.previous_frame_move_left != this.move_left ||
                    this.previous_frame_move_right != this.move_right ||
                    this.previous_frame_move_jump != this.move_jump) {
               this.control_state_changed = true;
            }

            this.previous_frame_move_left = this.move_left
            this.previous_frame_move_right = this.move_right
            this.previous_frame_move_jump = this.move_jump

            this.move_left = Bones.Input.Keyboard.ControlStates["left"].pressed || Bones.Input.Keyboard.ControlStates["left"].pressed_this_frame;
            this.move_right = Bones.Input.Keyboard.ControlStates["right"].pressed || Bones.Input.Keyboard.ControlStates["right"].pressed_this_frame;
            this.move_jump = Bones.Input.Keyboard.ControlStates["jump"].pressed || Bones.Input.Keyboard.ControlStates["jump"].pressed_this_frame;
            if (this.move_left == true && this.move_right == true) {
                this.move_left = false;
                this.move_right = false;
            }
        }

        tick() {
            var bodies = Matter.Composite.allBodies(Bones.World.Physics.matterjs_engine.world)

            for (let i = 0; i < bodies.length; i++){
                if(bodies[i] == this.physics_prop.body) {
                    continue
                }
                let collide_body = Matter.Bodies.rectangle(this.physics_prop.body.position.x + 5, this.physics_prop.body.position.y - this.height / 2 + this.height - 1, this.width - 15, 2)


                if(Matter.Collision.collides(collide_body, bodies[i])) {

                    this.on_grroundound = true
                    if (this.move_jump != true) {
                        Matter.Body.set(this.physics_prop.body, 'velocity', {x: this.physics_prop.body.velocity.x, y: 0 })
                    }
                }
            }


            for (let i = 0; i < Bones.World.players.length; i++){
                let collide_body = Matter.Bodies.rectangle(this.physics_prop.body.position.x + 1, this.physics_prop.body.position.y - this.height / 2 + this.height - 1, this.width - 3, 2)


                if(Matter.Collision.collides(collide_body, Bones.World.players[i].physics_prop.body)) {

                    this.on_ground = true
                    if (this.move_jump != true) {
                        Matter.Body.set(this.physics_prop.body, 'velocity', {x: this.physics_prop.body.velocity.x, y: 0 })
                    }
                }
            }


            for (let i = 0; i < Bones.World.npcs.length; i++){
                let collide_body = Matter.Bodies.rectangle(this.physics_prop.body.position.x + 1, this.physics_prop.body.position.y - this.height / 2 + this.height - 1, this.width - 3, 2)


                if(Matter.Collision.collides(collide_body, Bones.World.npcs[i].physics_prop.body)) {

                    this.on_ground = true
                    if (this.move_jump != true) {
                        Matter.Body.set(this.physics_prop.body, 'velocity', {x: this.physics_prop.body.velocity.x, y: 0 })
                    }
                }
            }



            for (let i = 0; i < Bones.World.walls.length; i++){
                let collide_body = Matter.Bodies.rectangle(this.physics_prop.body.position.x + 1, this.physics_prop.body.position.y - this.height / 2 + this.height - 1, this.width - 3, 2)


                if(Matter.Collision.collides(collide_body, Bones.World.walls[i].physics_prop.body)) {

                    this.on_ground = true
                    if (this.move_jump != true) {
                        Matter.Body.set(this.physics_prop.body, 'velocity', {x: this.physics_prop.body.velocity.x, y: 0 })
                    }
                }
            }


            if (this.move_left) {
                this.x_vel -= this.x_acc * Bones.Timer.delta_time * Bones.Timer.timescale;
            }
            if (this.move_right) {
                this.x_vel += this.x_acc * Bones.Timer.delta_time * Bones.Timer.timescale;
            }
            if (this.move_jump && !this.jump_lock && this.on_ground) {
                this.y_vel -= this.y_acc
                
                Matter.Body.set(this.physics_prop.body, 'velocity', {x: this.physics_prop.body.velocity.x, y: - this.y_acc})
                this.on_ground = false
                this.jump_lock = true
            }
            if (!this.move_jump) {
                this.jump_lock = false
            }

            // Gravity

            this.y_vel += this.gravity * Bones.Timer.delta_time * Bones.Timer.timescale

            // Friction

            if (!this.move_left && !this.move_right) {
                if (this.x_vel > 0) {
                    if (this.on_ground == true) {
                        if (this.x_vel <= this.ground_friction * Bones.Timer.delta_time * Bones.Timer.timescale) {
                            this.x_vel = 0; // player_ground_friction;
                        } else {
                            this.x_vel -= this.ground_friction * Bones.Timer.delta_time * Bones.Timer.timescale;
                        }
                    }
                    if (this.on_ground == false) {
                        if (this.x_vel < this.air_friction * Bones.Timer.delta_time * Bones.Timer.timescale) {
                            this.x_vel = this.air_friction * Bones.Timer.delta_time * Bones.Timer.timescale;
                        } else {
                            this.x_vel -= this.air_friction * Bones.Timer.delta_time * Bones.Timer.timescale;
                        }
                    }
                }
                if (this.x_vel < 0) {
                    if (this.on_ground == true) {
                        if (this.x_vel >= -this.ground_friction * Bones.Timer.delta_time * Bones.Timer.timescale) {
                            this.x_vel = 0; // -player_ground_friction
                        } else {
                            this.x_vel += this.ground_friction * Bones.Timer.delta_time * Bones.Timer.timescale;
                        }
                    }
                    if (this.on_ground == false) {
                        if (this.x_vel > -this.air_friction * Bones.Timer.delta_time * Bones.Timer.timescale) {
                            this.x_vel = -this.air_friction * Bones.Timer.delta_time * Bones.Timer.timescale
                        } else {
                            this.x_vel += this.air_friction * Bones.Timer.delta_time * Bones.Timer.timescale
                        }
                    }
                }
            }


            // Maximum Velocities

            if (this.x_vel > this.max_x_vel) {
                this.x_vel = this.max_x_vel
            }
            if (this.x_vel < -this.max_x_vel) {
                this.x_vel = -this.max_x_vel
            }
            if (this.y_vel > this.max_y_vel) {
                this.y_vel = this.max_y_vel
            }
            if (this.y_vel < -this.max_y_vel) {
                this.y_vel = -this.max_y_vel
            }


                Matter.Body.set(this.physics_prop.body, 'velocity', {x: this.x_vel, y: this.physics_prop.body.velocity.y })
                Matter.Body.set(this.physics_prop.body, 'angle', 0)
                Matter.Body.set(this.physics_prop.body, 'angularVelocity', 0)
            this.x = this.physics_prop.x
            this.y = this.physics_prop.y

        }
        save_rewind_buffer() {
            let timestamp = Date.now()
            this.rewind_buffer.push({})
            let buf = this.rewind_buffer.at(-1)
            buf.timestamp = timestamp

            buf.x = this.x
            buf.y = this.y

            buf.move_left = this.move_left
            buf.move_right = this.move_right
            buf.move_jump = this.move_jump
        
            buf.previous_frame_move_left = this.previous_frame_move_left
            buf.previous_frame_move_right = this.previous_frame_move_right
            buf.previous_frame_move_jump = this.previous_frame_move_jump

            buf.control_state_changed = this.control_state_changed

            buf.x_vel = this.x_vel
            buf.y_vel = this.y_vel
            buf.facing_right = this.facing_right

            buf.physics_prop_body_position = { ...this.physics_prop.body.position }
            buf.physics_prop_body_velocity = { ...this.physics_prop.body.velocity }
            buf.physics_prop_body_angle = this.physics_prop.body.angle
            buf.physics_prop_body_angular_velocity = this.physics_prop.body.angularVelocity 


            while(this.rewind_buffer.length > 100) {
                this.rewind_buffer.shift()
            }
            console.log(this.rewind_buffer.length)
        }
        load_rewind_buffer(rewind_time=250) {
            let timestamp = Date.now()
            let target_timestamp = timestamp - rewind_time
            let rewind_buffer_i = -1
            for (let i = 0; i < this.rewind_buffer.length; i++) {
                console.log('i')
                console.log(i)
                console.log('try timestamp')
                console.log(this.rewind_buffer[i].timestamp)
                if(target_timestamp < this.rewind_buffer[i].timestamp) {
                    rewind_buffer_i = i
                    break
                }
            }
            console.log(rewind_buffer_i)
            let buf = this.rewind_buffer.at(rewind_buffer_i)
            console.log('target timestamp')
            console.log(timestamp)
            console.log('rewind timestamp')
            console.log(buf.timestamp)

            this.x = buf.x
            this.y = buf.y

            //this.move_left = buf.move_left
            //this.move_right = buf.move_right
            //this.move_jump = buf.move_jump

            this.previous_frame_move_left = buf.previous_frame_move_left
            this.previous_frame_move_right = buf.previous_frame_move_right

            this.previous_frame_move_jump = buf.previous_frame_move_jump

            this.control_state_changed = this.control_state_changed

            this.x_vel = buf.x_vel
            this.y_vel = buf.y_vel
            this.facing_right = buf.facing_right

            
            console.log(buf.physics_prop_body_angle)
            Matter.Body.set(this.physics_prop.body, 'position', buf.physics_prop_body_position, null);
            Matter.Body.set(this.physics_prop.body, 'velocity', buf.physics_prop_body_velocity, null);
            Matter.Body.set(this.physics_prop.body, 'angle', buf.physics_prop_body_angle, null);
            /* Matter.Body.set(this.physics_prop.body, 'angularVelocity', buf.physics_prop_body_angular_velocity, null); */
            send_player_positions()
            this.rewind_buffer = []
        }
        render() {
            if(this.x_vel <= -1) {
                this.walk_left_animation.tick(Math.abs(this.x_vel * 0.6) * Bones.Timer.delta_time)
            this.walk_left_animation.render(this.physics_prop.body.position.x, this.physics_prop.body.position.y, this.width, this.height)
            }
            if (this.x_vel >= 1) {
                this.walk_right_animation.tick(Math.abs(this.x_vel * 0.6) * Bones.Timer.delta_time)
            this.walk_right_animation.render(this.physics_prop.body.position.x, this.physics_prop.body.position.y, this.width, this.height)
            }
            if(this.x_vel < 1 && this.x_vel > -1) {
                this.walk_left_animation.timer = 0
                this.walk_right_animation.timer = 0
                this.walk_right_animation.render(this.physics_prop.body.position.x, this.physics_prop.body.position.y, this.width, this.height)
            }
        }

    }, // END CLASS Physics Player


    Controller: class {
        constructor() {
            this.previous_frame_move_left = false;
            this.previous_frame_move_right = false;
            this.previous_frame_move_jump = false;

            this.move_left = false;
            this.move_right = false;
            this.move_jump = false;

            this.control_state_changed = false;
        }
        read_keyboard_controls() {
            this.control_state_changed = false;
            if (this.previous_frame_move_left != this.move_left ||
                    this.previous_frame_move_right != this.move_right ||
                    this.previous_frame_move_jump != this.move_jump) {
               this.control_state_changed = true;
            }

            this.previous_frame_move_left = this.move_left
            this.previous_frame_move_right = this.move_right
            this.previous_frame_move_jump = this.move_jump

            this.move_left = Bones.Input.Keyboard.ControlStates["left"].pressed || Bones.Input.Keyboard.ControlStates["left"].pressed_this_frame;
            this.move_right = Bones.Input.Keyboard.ControlStates["right"].pressed || Bones.Input.Keyboard.ControlStates["right"].pressed_this_frame;
            this.move_jump = Bones.Input.Keyboard.ControlStates["jump"].pressed || Bones.Input.Keyboard.ControlStates["jump"].pressed_this_frame;
            if (this.move_left == true && this.move_right == true) {
                this.move_left = false;
                this.move_right = false;
            }
        }
    }, // END CLASS Controller
    Player: class {
        constructor() {

            //player init

            this.movement_speed = 1;
            this.x = 25;
            this.y = 0;
            this.width = 150;
            this.height = 150;
            this.x_vel = 0;
            this.y_vel = 0;
            this.max_x_vel = 7
            this.max_y_vel = 70
            this.x_acc = 1
            this.y_acc = 10 // Todo: air acceleration, air max vel, run speed, bunny hopping
            this.ground_friction = 0.55
            this.air_friction = 0.05
            this.gravity = 0.25
            this.facing_right = true

            this.previous_frame_move_left = false;
            this.previous_frame_move_right = false;
            this.previous_frame_move_jump = false;

            this.move_left = false;
            this.move_right = false;
            this.move_jump = false;

            this.control_state_changed = false;

            this.on_ground = false
            this.jump_lock = false
            this.physics_prop = new Bones.World.BoxProp(new Box(this.x, this.y, 150, 150), 0, true)
        } 
        read_keyboard_controls() {
            this.control_state_changed = false;
            if (this.previous_frame_move_left != this.move_left ||
                    this.previous_frame_move_right != this.move_right ||
                    this.previous_frame_move_jump != this.move_jump) {
               this.control_state_changed = true;
            }

            this.previous_frame_move_left = this.move_left
            this.previous_frame_move_right = this.move_right
            this.previous_frame_move_jump = this.move_jump

            this.move_left = Bones.Input.Keyboard.ControlStates["left"].pressed || Bones.Input.Keyboard.ControlStates["left"].pressed_this_frame;
            this.move_right = Bones.Input.Keyboard.ControlStates["right"].pressed || Bones.Input.Keyboard.ControlStates["right"].pressed_this_frame;
            this.move_jump = Bones.Input.Keyboard.ControlStates["jump"].pressed || Bones.Input.Keyboard.ControlStates["jump"].pressed_this_frame;
            if (this.move_left == true && this.move_right == true) {
                this.move_left = false;
                this.move_right = false;
            }
        }
        tick() {
            // Control

            if (this.move_left) {
                this.x_vel -= this.x_acc * Bones.Timer.delta_time * Bones.Timer.timescale;
            }
            if (this.move_right) {
                this.x_vel += this.x_acc * Bones.Timer.delta_time * Bones.Timer.timescale;
            }
            if (this.move_jump && !this.jump_lock && this.on_ground) {
                this.y_vel -= this.y_acc
                this.on_ground = false
                this.jump_lock = true
            }
            if (!this.move_jump) {
                this.jump_lock = false
            }

            // Gravity

            this.y_vel += this.gravity * Bones.Timer.delta_time * Bones.Timer.timescale

            // Friction

            if (!this.move_left && !this.move_right) {
                if (this.x_vel > 0) {
                    if (this.on_ground == true) {
                        if (this.x_vel <= this.ground_friction * Bones.Timer.delta_time * Bones.Timer.timescale) {
                            this.x_vel = 0; // player_ground_friction;
                        } else {
                            this.x_vel -= this.ground_friction * Bones.Timer.delta_time * Bones.Timer.timescale;
                        }
                    }
                    if (this.on_ground == false) {
                        if (this.x_vel < this.air_friction * Bones.Timer.delta_time * Bones.Timer.timescale) {
                            this.x_vel = this.air_friction * Bones.Timer.delta_time * Bones.Timer.timescale;
                        } else {
                            this.x_vel -= this.air_friction * Bones.Timer.delta_time * Bones.Timer.timescale;
                        }
                    }
                }
                if (this.x_vel < 0) {
                    if (this.on_ground == true) {
                        if (this.x_vel >= -this.ground_friction * Bones.Timer.delta_time * Bones.Timer.timescale) {
                            this.x_vel = 0; // -player_ground_friction
                        } else {
                            this.x_vel += this.ground_friction * Bones.Timer.delta_time * Bones.Timer.timescale;
                        }
                    }
                    if (this.on_ground == false) {
                        if (this.x_vel > -this.air_friction * Bones.Timer.delta_time * Bones.Timer.timescale) {
                            this.x_vel = -this.air_friction * Bones.Timer.delta_time * Bones.Timer.timescale
                        } else {
                            this.x_vel += this.air_friction * Bones.Timer.delta_time * Bones.Timer.timescale
                        }
                    }
                }
            }


            // Maximum Velocities

            if (this.x_vel > this.max_x_vel) {
                this.x_vel = this.max_x_vel
            }
            if (this.x_vel < -this.max_x_vel) {
                this.x_vel = -this.max_x_vel
            }
            if (this.y_vel > this.max_y_vel) {
                this.y_vel = this.max_y_vel
            }
            if (this.y_vel < -this.max_y_vel) {
                this.y_vel = -this.max_y_vel
            }

            // Commit x and y Velocities

            this.x += this.x_vel * Bones.Timer.delta_time * Bones.Timer.timescale;
            this.y += this.y_vel * Bones.Timer.delta_time * Bones.Timer.timescale;


            // Movement Bounderies

            if (this.x < 0) {
                this.x = 0
                this.x_vel = 0
            }
            if (this.x > Bones.World.width - 150) {
                this.x = Bones.World.width - 150
                this.x_vel = 0
            }
            if (this.y < 0) {
                this.y = 0
                this.y_vel = 0 - this.y_vel
                if (this.y_vel > 0) {
                    this.y_vel = 0
                }
            }
            if (this.y > Bones.World.height - 150) {
                this.y = Bones.World.height - 150
                this.y_vel = 0
                this.on_ground = true
            }

            Matter.Body.setPosition(this.physics_prop.body, {
                x: this.x + 150 / 2,
                y: this.y + 150 / 2
            }, true)
        }
        render() {
            Bones.Renderer.context.drawImage(Bones.Assets.gfx_player, this.x - Bones.Renderer.camera_x, this.y - Bones.Renderer.camera_y, 150, 150)
        }
    }, // END CLASS Player
} // END OBJECT Bones.World
//Bones.World.init()
