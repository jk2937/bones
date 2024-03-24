class World {
    constructor() {
        //player init

        this.player1 = new Player()

        this.menu_items = []
        this.menu_items.push(new MenuItem(Bones.Renderer.width - 280, 50, 250, 300, "Menu", function() {}))
        this.menu_items.push(new MenuItem(Bones.Renderer.width - 280 + 5, 50 + 45, 250 - 10, 30, "Refresh", function() { Bones.demo_world1 = new World(); }))

        this.menu_items.push(new MenuItem(Bones.Renderer.width - 280 + 5, 50 + 40 * 2, 250 - 10, 30, "Camera Mode", function() { Bones.DebugDisplay.test_camera = true }, function() { Bones.DebugDisplay.test_camera = false }, "toggle"))



        //npc init

        this.npc1 = new NPC()

        // prop init

        this.test_prop1 = new BoxProp(new Box(400, 200, 80, 80), 0, false)
        this.test_prop2 = new BoxProp(new Box(450, 50, 80, 20), 0, false)
        this.ground1 = new BoxProp(new Box(400, 610, 810, 60), 0, true)

    }
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

        this.npc1.tick()

        Matter.Engine.update(Bones.Physics.matterjs_engine, Bones.Timer.delta_time)

        this.test_prop1.render()
        this.test_prop2.render()
        this.ground1.render()

        if (Bones.DebugDisplay.physics_wireframe == true) {
            var bodies = Matter.Composite.allBodies(Bones.Physics.matterjs_engine.world)

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

        this.player1.render()
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
        this.npc1.render()

        Bones.DebugDisplay.render()

        if (Bones.DebugDisplay.stress_test == true) {
            rand = 1
            if (Bones.DebugDisplay.stress_random) {
                rand = Math.random() * Bones.DebugDisplay.stress_loops;
            }
            for (i = 0; i < Bones.DebugDisplay.stress_loops * rand; i++) {
                Bones.Renderer.context.fillText("", 0, 0)
            }
        }
    }
}
