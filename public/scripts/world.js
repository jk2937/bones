Bones.World = {
    init() {

		this.players = []
        //this.players.push(new this.Player())
		
		this.controllers = []

        this.menu_items = []
        /*this.create_menu_item(Bones.Renderer.width - 280, 50, 250, 300, "Menu", function() {})
        this.create_menu_item(Bones.Renderer.width - 280 + 5, 50 + 45, 250 - 10, 30, "Reset", function() { Bones.World.init() })
        this.create_menu_item(Bones.Renderer.width - 280 + 5, 50 + 40 * 2, 250 - 10, 30, "Add Physics Object", function() { Bones.World.npcs.push(new Bones.World.NPC()) })
*/
        // this.create_menu_item(Bones.Renderer.width - 280 + 5, 50 + 40 * 3, 250 - 10, 30, "Camera Mode", function() { Bones.DebugDisplay.test_camera = true }, function() { Bones.DebugDisplay.test_camera = false }, "toggle")

        //npc init

        this.npcs = []
        /*this.npcs.push(new this.NPC())*/


    }, // END FUNCTION init
    tick() {
		if (isServer == false) {
			Bones.Renderer.context.font = "18px Monospace";
			Bones.Renderer.context.fillStyle = "Gray";
			Bones.Renderer.context.textAlign = "center";
			Bones.Renderer.context.fillText("Welcome to Bones \"Alpha\" v0.1.0!", Bones.Renderer.canvas.width / 2, 20)

			Bones.Input.process_buffers()
		}

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
			
			for (let i = 0; i < this.players.length; i++){
				for (let i = 0; i < this.controllers.length; i++) {
					if (this.controllers[i].id == this.players[i].id) {
						this.players[i].read_keyboard_controls(
							this.controllers[i].left,
							this.controllers[i].right,
							this.controllers[i].jump
						);
					}
				}
				this.players[i].tick()
			}
			if (isServer == false) {
				for (let i = 0; i < this.controllers.length; i++) {
					if(clientId == this.controllers[i].id){
						this.controllers[i].update()
					}
				}
			}
        }

        for (let i = 0; i < this.npcs.length; i++) {
            this.npcs[i].tick()
        }


        // Todo: move this

        for (let i = 0; i < this.npcs.length; i++) {
            this.npcs[i].render()
        }

        for (let i = 0; i < this.menu_items.length; i++) {
            this.menu_items[i].read_input()
            this.menu_items[i].render()
        }

		if(isServer == false) {
			Bones.DebugDisplay.render()
		}
		
		if (isServer == false) {
			for (let i = 0; i < this.players.length; i++){
				this.players[i].render()
			}
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
        }
        render() {
        }
    }, // END CLASS NPC
	
	Controller: class {
		constructor(id) {
			this.left = false;
			this.right = false;
			this.jump = false;
			this.id = id
		}
		update() {
			if(Bones.Input.Keyboard.ControlStates["left"].pressed || Bones.Input.Keyboard.ControlStates["left"].pressed_this_frame) {
				this.left = true;
			} else {
				this.left = false;
			}
			if(Bones.Input.Keyboard.ControlStates["right"].pressed || Bones.Input.Keyboard.ControlStates["right"].pressed_this_frame) {
				this.right = true;
			} else {
				this.right = false;
			}
			if(Bones.Input.Keyboard.ControlStates["jump"].pressed || Bones.Input.Keyboard.ControlStates["jump"].pressed_this_frame) {
				this.jump = true;
			} else {
				this.jump = false;
			}
		}
		serialize() {
			return JSON.stringify([this.left, this.right, this.jump])
		}
		deserialize(dumps) {
			const state = JSON.parse(dumps);
			this.left = state[0];
			this.right = state[1];
			this.jump = state[2];
		}
	}, // END CONTROLLER CLASS

    Player: class {
        constructor(id) {
            //player init
			this.id = id
            this.movement_speed = 1;
            this.x = 25;
            this.y = 0;
			this.interp_strength = 10
			this.x_interp = []
			this.y_interp = []
			for (let i = 0; i < this.interp_strength; i++) {
				this.x_interp.push(this.x)
				this.y_interp.push(this.y)
			}
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
        } 
        read_keyboard_controls(move_left, move_right, move_jump) {
            this.move_left = move_left;
            this.move_right = move_right;
            this.move_jump = move_jump;
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
        }
        render() {
			this.x_interp.push(this.x)
			this.y_interp.push(this.y)
			let interp_x = this.x
			let interp_y = this.y
			for (let i = 0; i < this.interp_strength; i++) {
				interp_x = interp_x + this.x_interp[this.x_interp.length-1-i]
				interp_y = interp_y + this.y_interp[this.y_interp.length-1-i]
			}
			interp_x = interp_x / (this.interp_strength+1)
			interp_y = interp_y / (this.interp_strength+1)
            Bones.Renderer.context.drawImage(Bones.Assets.gfx_player, interp_x - Bones.Renderer.camera_x, interp_y - Bones.Renderer.camera_y, 150, 150)
        }
		serialize() {
			return JSON.stringify([this.movement_speed, this.x, this.y, this.x_vel, this.y_vel, this.max_x_vel, this.max_y_vel, this.x_acc, this.y_acc, this.ground_friction, this.air_friction, this.gravity, this.facing_right, this.move_left, this.move_right, this.move_jump, this.on_ground, this.jump_lock = false])
		}
		deserialize(dumps) {
			const state = JSON.parse(dumps);
			
            this.movement_speed = state[0];
            this.x = state[1];
            this.y = state[2];
            this.x_vel = state[3];
            this.y_vel = state[4];
            this.max_x_vel = state[5]
            this.max_y_vel = state[6]
            this.x_acc = state[7]
            this.y_acc = state[8] // Todo: air acceleration, air max vel, run speed, bunny hopping
            this.ground_friction = state[9]
            this.air_friction = state[10]
            this.gravity = state[11]
            this.facing_right = state[12]

            this.move_left = state[13];
            this.move_right = state[14];
            this.move_jump = state[15];

            this.on_ground = state[16]
            this.jump_lock = state[17]
		}
    }, // END CLASS Player
} // END OBJECT Bones.World
Bones.World.init()
