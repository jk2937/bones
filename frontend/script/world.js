class World {
    constructor() {

        this.engine = Matter.Engine.create();
        this.world = engine.world;

        //player init

        player1 = new Player()

        //debug init
        
        debug_display1 = new DebugDisplay()

        //npc init

        npc1 = new NPC()

        // prop init

        test_prop1 = new PhysicsProp("square", {
            x: 400,
            y: 200,
            w: 80,
            h: 80
        })
        test_prop2 = new PhysicsProp("square", {
            x: 450,
            y: 50,
            w: 80,
            h: 20
        })
        ground1 = new physics_object("square", {
            x: 400,
            y: 610,
            w: 810,
            h: 60
        }, anchored = true)

    }
    tick() {
        if (debug_lag_frames == true) {
            console.log("delta_time: " + delta_time);
        }
        // Process touch_events_buffer

        ctx.font = "16px Arial";
        ctx.fillStyle = "Gray";
        ctx.textAlign = "center";
        ctx.fillText("Welcome to Bones \"Alpha\" v0.0.5!", canvas_width / 2, 20)
        }
    
        if (debug_simple_player_movement == false) {
            player1.tick()
        }
        if (debug_simple_player_movement == true) {
            if (move_right) {
                player_x += 5 * delta_time * timescale
            }
            if (move_left) {
                player_x -= 5 * delta_time * timescale
            }
        }

        Matter.Engine.update(engine, delta = delta_time)


        // Ball physics

        rect_x += rect_x_vel * delta_time * timescale
        rect_y += rect_y_vel * delta_time * timescale
        /* For top down mode:
        rect_y_vel = rect_y_vel / 2;
        rect_x_vel = rect_x_vel / 2; */
        if (rect_x < 0 - rect_w) {
            rect_x = canvas_width;
        }
        if (rect_y < 0) {
            rect_y = 0
            rect_y_vel = 0 - rect_y_vel
            if (rect_y_vel > 0) {
                rect_y_vel = 0;
            }
        }
        if (rect_x > canvas_width) {
            rect_x = -25;
        }
        if (rect_y > canvas_height - rect_h) {
            rect_x_vel = rect_x_vel * 0.7
            rect_y = canvas_height - rect_h;
            rect_y_vel = 0 - rect_y_vel * 0.7
            if (rect_y_vel > 0) {
                rect_y_vel = 0;
            }
        }


        if (rect_y_vel <= 1 && rect_y_vel >= -1 &&
            rect_x_vel <= 1 && rect_x_vel >= -1) {
            rect_y_vel = Math.floor(Math.random() * 100) - 50
            rect_x_vel = Math.floor(Math.random() * 100) - 50
        }
        rect_y_vel++;

        // ctx.fillStyle = "Gray";
        // ctx.fillRect(rect_x, rect_y, rect_w, rect_h);

        test_block.draw()
        test_block2.draw()
        ground.draw()

        if (debug_wireframe == true) {
            var bodies = Matter.Composite.allBodies(engine.world)

            ctx.save()

            ctx.beginPath();

            for (var i = 0; i < bodies.length; i++) {
                var vertices = bodies[i].vertices;

                ctx.moveTo(vertices[0].x, vertices[0].y);

                for (var j = 1; j < vertices.length; j += 1) {
                    ctx.lineTo(vertices[j].x, vertices[j].y);
                }

                ctx.lineTo(vertices[0].x, vertices[0].y);
            }

            ctx.lineWidth = 1;
            ctx.strokeStyle = '#999';
            ctx.stroke();

            ctx.restore()
        }

        draw_player()
        ctx.drawImage(ball, rect_x, rect_y, rect_w, rect_h)

        if (display_debug_info == true) {
            ctx.font = "14px Arial";
            ctx.fillStyle = "Gray"
            ctx.textAlign = "left";
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
            for (let i = 0; i < debug_display.length; i++) {
                if (debug_display[i] != "") {
                    ctx.fillText(debug_display[i], 10, 50 + i * 15)
                    ctx.fillText(eval(debug_display[i]), 175, 50 + i * 15)
                }
            }
        }

        if (stress_test == true) {
            rand = 1
            if (stress_random) {
                rand = Math.random() * stress_loops;
            }
            for (i = 0; i < stress_loops * rand; i++) {
                ctx.fillText("", 0, 0)
            }
        }
    }
}
