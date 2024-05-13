Bones.World = {
    init() {
        this.Physics = new Object()
        this.Physics.matterjs_engine = Matter.Engine.create();
        this.Physics.matterjs_world = this.Physics.matterjs_engine.world;

        this.player1 = new this.Player()

        this.menu_items = []
        this.create_menu_item(Bones.Renderer.width - 280, 50, 250, 300, "Menu", function() {})
        this.create_menu_item(Bones.Renderer.width - 280 + 5, 50 + 45, 250 - 10, 30, "Refresh", function() { Bones.World.init() })
        this.create_menu_item(Bones.Renderer.width - 280 + 5, 50 + 40 * 2, 250 - 10, 30, "Add Physics Object", function() { Bones.World.npcs.push(new Bones.World.NPC()) })

        this.create_menu_item(Bones.Renderer.width - 280 + 5, 50 + 40 * 3, 250 - 10, 30, "Camera Mode", function() { Bones.DebugDisplay.test_camera = true }, function() { Bones.DebugDisplay.test_camera = false }, "toggle")


        // prop init

        this.box_props = []
        //this.create_box_prop(400, 200, 80, 80)
        //this.create_box_prop(450, 50, 80, 20)

        this.create_box_prop(Bones.Renderer.width / 2, -50, Bones.Renderer.width, 100, anchored=true)
        this.create_box_prop(Bones.Renderer.width / 2, Bones.Renderer.height + 50, Bones.Renderer.width, 100, anchored=true)
        this.create_box_prop(-50, Bones.Renderer.height / 2, 100, Bones.Renderer.height, anchored=true)
        this.create_box_prop(Bones.Renderer.width + 50, Bones.Renderer.height / 2, 100, Bones.Renderer.height, anchored=true)

        //npc init

        this.npcs = []
        this.npcs.push(new this.NPC())


    }, // END FUNCTION init
    tick() {
        Bones.Renderer.context.font = "18px Monospace";
        Bones.Renderer.context.fillStyle = "Gray";
        Bones.Renderer.context.textAlign = "center";
        Bones.Renderer.context.fillText("Welcome to Bones \"Alpha\" v0.0.8!", Bones.Renderer.canvas.width / 2, 20)

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
            this.player1.read_keyboard_controls()
            this.player1.tick()
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

        this.player1.render()
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

            this.x = 200;
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

    Player: class {
        constructor() {

            //player init

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

            this.move_left = false;
            this.move_right = false;
            this.move_jump = false;

            this.on_ground = false
            this.jump_lock = false
            this.physics_prop = new Bones.World.BoxProp(new Box(this.x, this.y, 150, 150), 0, true)
        } 
        read_keyboard_controls() {
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
            if (this.x > Bones.Renderer.width - 150) {
                this.x = Bones.Renderer.width - 150
                this.x_vel = 0
            }
            if (this.y < 0) {
                this.y = 0
                this.y_vel = 0 - this.y_vel
                if (this.y_vel > 0) {
                    this.y_vel = 0
                }
            }
            if (this.y > Bones.Renderer.height - 150) {
                this.y = Bones.Renderer.height - 150
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
Bones.World.init()
