class NPC {
    constructor() {
        //npc init

        this.x = 0;
        this.y = 0;

        this.h = 100;
        this.w = 100;

        this.x_vel = 0;
        this.y_vel = 0;
    }
    tick() {
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
            this.y_vel = Math.floor(Math.random() * 100) - 50
            this.x_vel = Math.floor(Math.random() * 100) - 50
        }
        this.y_vel++;
    }
    render() {
        Bones.Renderer.context.drawImage(Bones.Assets.gfx_ball, this.x, this.y, this.w, this.h)
    }
}
