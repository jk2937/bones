class World {
    constructor() {
	// todo: wrap physics functions into class
        this.matterjs_engine = Matter.Engine.create();
        this.matterjs_world = this.matterjs_engine.world;

        //player init

        this.player1 = new Player(this.matterjs_world)

        //debug init
        
        this.debug_display1 = new DebugDisplay()

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
        if (this.debug_display1.debug_lag_frames == true) {
            console.log("delta_time: " + delta_time);
        }
        // Process touch_events_buffer

        
        Bones.Renderer.context.font = "16px Arial";
        Bones.Renderer.context.fillStyle = "Gray";
        Bones.Renderer.context.textAlign = "center";
        Bones.Renderer.context.fillText("Welcome to Bones \"Alpha\" v0.0.5!", Bones.Renderer.canvas.width / 2, 20)
    
        if (this.debug_display1.debug_simple_player_movement == true) {
            if (move_right) {
                this.player1.x += 5 * delta_time * timescale
            }
            if (move_left) {
                this.player1.x -= 5 * delta_time * timescale
            }
        }
        else {
            this.player1.read_keyboard_controls(Bones.Input.key_events_buffer)
            this.player1.tick()
        }

        this.npc1.tick()

        Matter.Engine.update(this.matterjs_engine, Bones.delta_time)

        this.test_prop1.draw(Bones.Renderer.context)
        this.test_prop2.draw(Bones.Renderer.context)
        this.ground1.draw(Bones.Renderer.context)

        if (this.debug_display1.physics_wireframe == true) {
            var bodies = Matter.Composite.allBodies(this.matterjs_engine.world)

            Bones.Renderer.context.save()

            Bones.Renderer.context.beginPath();

            for (var i = 0; i < bodies.length; i++) {
                var vertices = bodies[i].vertices;

                Bones.Renderer.context.moveTo(vertices[0].x, vertices[0].y);

                for (var j = 1; j < vertices.length; j += 1) {
                    Bones.Renderer.context.lineTo(vertices[j].x, vertices[j].y);
                }

                Bones.Renderer.context.lineTo(vertices[0].x, vertices[0].y);
            }

            Bones.Renderer.context.lineWidth = 1;
            Bones.Renderer.context.strokeStyle = '#999';
            Bones.Renderer.context.stroke();

            Bones.Renderer.context.restore()
        }

        this.player1.render()
        this.npc1.render()

        if (this.debug_display1.visible == true) {
            Bones.Renderer.context.font = "14px Arial";
            Bones.Renderer.context.fillStyle = "Gray"
            Bones.Renderer.context.textAlign = "left";
            /* ctx.fillText("canvas_width", 10, 50)
            ctx.fillText(canvas_width, 175, 50)
            ctx.fillText("canvas_height", 10, 65)
            ctx.fillText(canvas_height, 175, 65)

            ctx.fillText("main_loop_sleep", 10, 95)
            ctx.fillText(main_loop_sleep, 175, 95)
            ctx.fillText("total_lag_frames", 10, 110)
            ctx.fillText(total_lag_frames, 175, 110)

            ctx.fillText("fps", 10, 140)
            ctx.fillText(fps, 175, 140) */
            for (let i = 0; i < this.debug_display1.variables.length; i++) {
                if (this.debug_display1.variables[i] != "") {
                    Bones.Renderer.context.fillText(this.debug_display1.variables[i], 10, 50 + i * 15)
                    Bones.Renderer.context.fillText(eval(this.debug_display1.variables[i]), 400, 50 + i * 15)
                }
            }
        }

        if (this.debug_display1.stress_test == true) {
            rand = 1
            if (this.debug_display1.stress_random) {
                rand = Math.random() * this.debug_display1.stress_loops;
            }
            for (i = 0; i < this.debug_display1.stress_loops * rand; i++) {
                Bones.Renderer.context.fillText("", 0, 0)
            }
        }
    }
}
