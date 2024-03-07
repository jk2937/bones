class Player {
    constructor(matterjs_world) {

        //player init

        this.movement_speed = 1;
        this.x = 25;
        this.y = 0;
        this.x_vel = 0;
        this.y_vel = 0;
        this.max_x_vel = 7
        this.max_y_vel = 70
        this.x_acc = 1
        this.y_acc = 10 // Todo: air acceleration, air max vel, run speed
        this.ground_friction = 0.55
        this.air_friction = 0.05
        this.gravity = 0.25
        this.facing_right = true

		this.control_left = false;
		this.control_right = false;
		this.control_jump = false;
		this.control_left_this_frame = false;
		this.control_right_this_frame = false;
		this.control_jump_this_frame = false;
		this.move_left = false;
		this.move_right = false;
		this.move_jump = false;

        this.on_ground = false
        this.jump_lock = false
        this.matterjs_world = matterjs_world
        this.physics_prop = new PhysicsProp("square", {
            x: this.x,
            y: this.y,
            w: 150,
            h: 150
        }, true, this.matterjs_world)
    } 
	read_keyboard_controls(key_events_buffer) {
        // process key events
        this.control_left_this_frame = false
        this.control_right_this_frame = false
        this.control_jump_this_frame = false

        for (let i = 0; i < key_events_buffer.length; i++) {
            let event_ = key_events_buffer[i]
            if (event_.type == "keydown") {
                if (event_.key == "a") {
                    this.control_left = true;
                    this.control_left_this_frame = true;
                }
                if (event_.key == "d") {
                    this.control_right = true;
                    this.control_right_this_frame = true;
                }
                if (event_.key == " ") {
                    this.control_jump = true;
                    this.control_jump_this_frame = true;
                }
            }
            if (event_.type == "keyup") {
                if (event_.key == "a") {
                    this.control_left = false;
                }
                if (event_.key == "d") {
                    this.control_right = false;
                }
                if (event_.key == " ") {
                    this.control_jump = false;
                }
            }
        }

        this.move_left = this.control_left || this.control_left_this_frame;
        this.move_right = this.control_right || this.control_right_this_frame;
        this.move_jump = this.control_jump || this.control_jump_this_frame;
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
        Bones.Renderer.context.drawImage(Bones.Assets.gfx_player, this.x, this.y, 150, 150)
	}
}
