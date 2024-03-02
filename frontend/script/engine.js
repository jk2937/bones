Engine = new Object()
Engine.canvas = document.getElementById("myCanvas"),
Engine.ctx = Engine.canvas.getContext("2d")
// todo: create resource pack object
Engine.gfx_player = new Image();
Engine.gfx_player.src = "../assets/asset2.png"
// Canvas properties

// todo: create renderer object

Engine.gfx_ball = new Image();
Engine.gfx_ball.src = "../assets/asset1.png"

Engine.renderer_width = 500;
Engine.renderer_height = 500;

Engine.renderer_fullscreen = false;
Engine.renderer_fullscreen_dynamic_res = true;

Engine.canvas.width = Engine.renderer_width;
Engine.canvas.height = Engine.renderer_height;

        if (Engine.renderer_fullscreen_dynamic_res) {
            // Engine.canvas.style.width = '100%';
            // Engine.canvas.style.height = '100%';
            Engine.canvas.style.position = "absolute";
            Engine.canvas.style.left = "0px";
            Engine.canvas.style.top = "0px";
            Engine.canvas.style.border = "none";
        }

		
        // Touch events

        Engine.cursor_activated = false;
        Engine.cursor_x = 0;
        Engine.cursor_y = 0;
        Engine.cursor_old_x = 0;
        Engine.cursor_old_y = 0;
        Engine.touch_events_buffer = [];
		Engine.key_event_buffer = [];
        /* function update_mouse_pos(e) {
            let rect = canvas.getBoundingClientRect();
            cursor_x = e.clientX - rect.left;
            cursor_y = e.clientY - rect.top;
            touch_events_buffer.push([cursor_x, cursor_y])
        } */

        Engine.main_exec_lock = false;
        Engine.main_loop_sleep = 0;
        Engine.total_lag_frames = 0;
        Engine.fps_frame_counter = 0;
        Engine.fps = 0;

        Engine.start_time = Date.now();
        Engine.timescale = 60 / 1000

        Engine.local_control_left = false;
        Engine.local_control_right = false;
        Engine.local_control_jump = false;

        Engine.touch_events_history = []
        Engine.key_event_history = []



        Engine.world1 = new World()

        //Engine.start()
	Engine.start = function() {
        setInterval(Engine.calculate_fps, 1000)
        Engine.run()
    }
    Engine.run = function() {
        // BEGIN execution lock code 
        if (Engine.main_exec_lock == true) {
            Engine.total_lag_frames++;
            return false;
        }
        Engine.main_exec_lock = true;
        // END executio lock code
        // update delta_time
        // todo: remove unneeded variable
        Engine.now = Date.now()
        Engine.delta_time = Date.now() - Engine.start_time
        Engine.start_time = Engine.now
        if (Engine.delta_time > 100) {
            Engine.total_lag_frames++;
            Engine.delta_time = 100;
        }

        // update canvas resolution
        if (Engine.renderer_fullscreen_dynamic_res) {
            // canvas_width = window.screen.availWidth;
            // canvas_height = window.screen.availHeight;

            Engine.renderer_width = window.innerWidth;
            Engine.renderer_height = window.innerHeight;

            Engine.canvas.width = Engine.renderer_width;
            Engine.canvas.height = Engine.renderer_height;
        }

        // clear canvas
        Engine.ctx.fillStyle = "LightGray";
        Engine.ctx.fillRect(0, 0, Engine.renderer_width, Engine.renderer_height);

        // add events to history objects
        Engine.touch_events_history = Engine.touch_events_history.concat(Engine.touch_events_buffer)
        Engine.key_event_history = Engine.key_event_history.concat(Engine.key_event_buffer)

        // todo: move control code to player object
        // tick world
        Engine.world1.tick(Engine.ctx, Engine.canvas_width, Engine.delta_time, Engine.timescale);

        // empty event pools
        Engine.touch_events_buffer = []
        Engine.key_event_buffer = []

        Engine.fps_frame_counter++;

        Engine.main_exec_lock = false;
        /* BEGIN ENGINE 
            if (debug_simulate_lag == false) { i*/
        requestAnimationFrame(Engine.run);
        /* BEGIN ENGINE
            }
            if (debug_simulate_lag == true) {
                setTimeout(launch_loop, Math.floor(Math.random() * debug_simulated_lag_range))
            } */
    } // END FUNCTION run
    Engine.calculate_fps = function() {
        Engine.fps = Engine.fps_frame_counter
        Engine.fps_frame_counter = 0
    }


Engine.canvas.addEventListener("touchstart", function(e) {
	e.preventDefault()
	console.log(e)
	Engine.touch_events_buffer.push(e)
}, false);

Engine.canvas.addEventListener("touchend", function(e) {
	e.preventDefault()
	console.log(e)
	Engine.touch_events_buffer.push(e)
	// cursor_activated = false;
}, false);

Engine.canvas.addEventListener("touchmove", function(e) {
	e.preventDefault()
	console.log(e)
	Engine.touch_events_buffer.push(e)
	// update_mouse_pos(e.touches[0])
}, false);

window.addEventListener("touchstart", ev => {
	ev.preventDefault();
	ev.stopImmediatePropagation();
}, {
	passive: false
});


// Keyboard Events
document.addEventListener("keydown", function(event) {
	Engine.key_event_buffer.push(event)
});

document.addEventListener("keyup", function(event) {
	Engine.key_event_buffer.push(event)
}); 

