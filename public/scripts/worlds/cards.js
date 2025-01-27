class CardsWorld {
    constructor() {
    }
    tick() {
        Bones.Renderer.context.font = "18px Monospace";
        Bones.Renderer.context.fillStyle = "Gray";
        Bones.Renderer.context.textAlign = "center";
        Bones.Renderer.context.fillText("Welcome to Bones \"Alpha\" v0.0.8!", Bones.Renderer.canvas.width / 2, 20)

        Bones.Input.process_buffers()

        Matter.Engine.update(Bones.Physics.matterjs_engine, Bones.Timer.delta_time)

        Bones.Renderer.context.font = "18px Monospace";
        Bones.Renderer.context.fillStyle = "Gray";
        Bones.Renderer.context.textAlign = "center";

        Bones.Renderer.context.fillText("Controls:", Bones.Renderer.width - 280 + 125 + 5, 50 + 200)
        Bones.Renderer.context.fillText("A, D ............ Move", Bones.Renderer.width - 280 + 125 + 5, 50 + 200 + 30)
        Bones.Renderer.context.fillText("SPACE ........... Jump", Bones.Renderer.width - 280 + 125 + 5, 50 + 200 + 60)
    }
}
