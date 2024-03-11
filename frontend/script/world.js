class World {
    constructor() {
	// todo: wrap physics functions into class
        this.matterjs_engine = Matter.Engine.create();
        this.matterjs_world = this.matterjs_engine.world;

        //player init

        this.player1 = new Player(this.matterjs_world)

        this.test_menu_item1 = new MenuItem(Bones.Renderer.width - 280, 50, 250, 300, "Menu", function() {});
        this.test_menu_item2 = new MenuItem(Bones.Renderer.width - 280 + 5, 50 + 45, 250 - 10, 30, "Refresh", function() { Bones.demo_world1 = new World(); });

        this.test_menu_item3 = new MenuItem(Bones.Renderer.width - 280 + 5, 50 + 40 * 2, 250 - 10, 30, "Camera Mode", function() { Bones.Debugger.test_camera = true }, function() { Bones.Debugger.test_camera = false }, "toggle");



        //npc init

        this.npc1 = new NPC()

        // prop init

        this.test_prop1 = new PhysicsProp("square", {
            x: 400,
            y: 200,
            w: 80,
            h: 80
        }, false, this.matterjs_world)
        this.test_prop2 = new PhysicsProp("square", {
            x: 450,
            y: 50,
            w: 80,
            h: 20
        }, false, this.matterjs_world)
        this.ground1 = new PhysicsProp("square", {
            x: 400,
            y: 610,
            w: 810,
            h: 60
        }, true, this.matterjs_world)

    }
    tick() {
        Bones.Renderer.context.font = "18px Monospace";
        Bones.Renderer.context.fillStyle = "Gray";
        Bones.Renderer.context.textAlign = "center";
        Bones.Renderer.context.fillText("Welcome to Bones \"Alpha\" v0.0.8!", Bones.Renderer.canvas.width / 2, 20)

        Bones.Input.mouse_read_controls()
        Bones.Input.touch_read_controls()
        Bones.Input.keys_read_controls()

        // Todo: Combine player code into Bones.Input.keys_read_controls, read all keystates with || keystate_this_frame

        if (Bones.Debugger.test_camera == true) {
            if (Bones.Input.controls["right"].pressed || Bones.Input.controls["right"].pressed_this_frame) {
                Bones.Renderer.camera_x += 5 * Bones.Timer.delta_time * Bones.Timer.timescale
            }
            if (Bones.Input.controls["left"].pressed || Bones.Input.controls["left"].pressed_this_frame) {
                Bones.Renderer.camera_x -= 5 * Bones.Timer.delta_time * Bones.Timer.timescale
            } 
            if (Bones.Input.controls["up"].pressed || Bones.Input.controls["up"].pressed_this_frame) {
                Bones.Renderer.camera_y -= 5 * Bones.Timer.delta_time * Bones.Timer.timescale
            }
            if (Bones.Input.controls["down"].pressed || Bones.Input.controls["down"].pressed_this_frame) {
                Bones.Renderer.camera_y += 5 * Bones.Timer.delta_time * Bones.Timer.timescale
            } 
            this.player1.tick()
        }

        if (Bones.Debugger.debug_simple_player_movement == true) {
            if (move_right) {
                this.player1.x += 5 * Bones.Timer.delta_time * Bones.Timer.timescale
            }
            if (move_left) {
                this.player1.x -= 5 * Bones.Timer.delta_time * Bones.Timer.timescale
            }
        }
        if (Bones.Debugger.test_simple_player_movement != true && Bones.Debugger.test_camera != true) {
            this.player1.read_keyboard_controls()
            this.player1.tick()
        }

        this.test_menu_item1.read_input()
        this.test_menu_item2.read_input()
        this.test_menu_item3.read_input()

        this.npc1.tick()

        Matter.Engine.update(this.matterjs_engine, Bones.Timer.delta_time)

        this.test_prop1.render()
        this.test_prop2.render()
        this.ground1.render()

        if (Bones.Debugger.physics_wireframe == true) {
            var bodies = Matter.Composite.allBodies(this.matterjs_engine.world)

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
        this.test_menu_item1.render()
        this.test_menu_item2.render()
        this.test_menu_item3.render()


        Bones.Renderer.context.font = "18px Monospace";
        Bones.Renderer.context.fillStyle = "Gray";
        Bones.Renderer.context.textAlign = "center";

        Bones.Renderer.context.fillText("Controls:", Bones.Renderer.width - 280 + 125 + 5, 50 + 200)
        Bones.Renderer.context.fillText("A, D ............ Move", Bones.Renderer.width - 280 + 125 + 5, 50 + 200 + 30)
        Bones.Renderer.context.fillText("SPACE ........... Jump", Bones.Renderer.width - 280 + 125 + 5, 50 + 200 + 60)
        this.npc1.render()

        Bones.Debugger.render()

        if (Bones.Debugger.stress_test == true) {
            rand = 1
            if (Bones.Debugger.stress_random) {
                rand = Math.random() * Bones.Debugger.stress_loops;
            }
            for (i = 0; i < Bones.Debugger.stress_loops * rand; i++) {
                Bones.Renderer.context.fillText("", 0, 0)
            }
        }
    }
}
