class PhysicsProp {
    constructor(shape, box, angle, anchored, matterjs_world) {
        this.shape = shape;

        this.x = box.x
        this.y = box.y

        this.angle = angle;

        if (this.shape == "square") {
            this.w = box.width
            this.h = box.height
        }
        if (this.shape == "circle") {
            this.r = box.r;
        }

        this.anchored = anchored;

        if (this.shape == "square") {
            this.body = Matter.Bodies.rectangle(this.x, this.y, this.w, this.h, {
                isStatic: this.anchored
            })
            Matter.Composite.add(matterjs_world, [this.body]);
        }
        if (this.shape == "circle") {

        }
    }
    render() {
        this.pos = this.body.position;
        this.angle = this.body.angle;
        this.x = this.pos.x;
        this.y = this.pos.y;
        Bones.Renderer.context.save()
        Bones.Renderer.context.fillStyle = "white";
        if (this.shape == "square") {
            Bones.Renderer.context.translate(this.x - Bones.Renderer.camera_x, this.y - Bones.Renderer.camera_y);
            Bones.Renderer.context.rotate(this.angle);

            Bones.Renderer.context.fillRect(0 - this.w / 2, 0 - this.h / 2, this.w, this.h);
        }
        if (this.shape == "circle") {

        }
        Bones.Renderer.context.restore()
    }
}