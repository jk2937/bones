class PhysicsProp {
    constructor(shape = "square", shape_data, anchored = false) {
        this.shape = shape;

        this.x = shape_data.x
        this.y = shape_data.y

        this.angle = shape_data.angle;

        if (this.shape == "square") {
            this.w = shape_data.w
            this.h = shape_data.h
        }
        if (this.shape == "circle") {
            this.r = shape_data.r;
        }

        this.anchored = anchored;

        if (this.shape == "square") {
            this.body = Matter.Bodies.rectangle(this.x, this.y, this.w, this.h, {
                isStatic: this.anchored
            })
            Matter.Composite.add(engine.world, [this.body]);
        }
        if (this.shape == "circle") {

        }
    }
    move(delta_time) {}
    draw() {
        this.pos = this.body.position;
        this.angle = this.body.angle;
        this.x = this.pos.x;
        this.y = this.pos.y;
        ctx.save()
        ctx.fillStyle = "white";
        if (this.shape == "square") {
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

            ctx.fillRect(0 - this.w / 2, 0 - this.h / 2, this.w, this.h);
        }
        if (this.shape == "circle") {

        }
        ctx.restore()
    }
}
