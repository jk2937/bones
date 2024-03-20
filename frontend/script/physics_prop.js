class BoxProp {
    constructor(box, angle, anchored, matterjs_world) {
        this.x = box.x
        this.y = box.y

        this.angle = angle;

        this.w = box.width
        this.h = box.height

        this.anchored = anchored;

        this.body = Matter.Bodies.rectangle(this.x, this.y, this.w, this.h, {
            isStatic: this.anchored
        })
        Matter.Composite.add(matterjs_world, [this.body]);
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
}
