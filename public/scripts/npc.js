/* class NPC {
    constructor() {
        //npc init

        this.x = 0;
        this.y = 0;

        this.w = 100;
        this.h = 100;

        this.animation = new Animation();

        this.x_vel = 0;
        this.y_vel = 0;

        this.stuck_time = 0;

        this.kicks_counter = 0;
        this.kicks_per_minute = 0
        this.kick_timer = 0

        this.physics_prop = Bones.World.create_box_prop(this.x, this.y, this.w, this.h)
    }
    calculate_kicks_per_minute() {
        this.kicks_per_minute = this.kicks_counter
        this.kicks_counter = 0
    }
    tick() {
        this.kick_timer += 1 * Bones.Timer.delta_time * Bones.Timer.timescale
        if (this.kick_timer > 60 * 60) {
            this.kick_timer -= 60 * 60
            this.calculate_kicks_per_minute()
        }
        this.x += this.x_vel * Bones.Timer.delta_time * Bones.Timer.timescale
        this.y += this.y_vel * Bones.Timer.delta_time * Bones.Timer.timescale

        /* For top down mode:
        this.y_vel = this.y_vel / 2;
        this.x_vel = this.x_vel / 2; */

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

        this.x = this.physics_prop.x
        this.y = this.physics_prop.y
    }
    render() {
        this.animation.render(this.x, this.y)
    }
} 
