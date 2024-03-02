Bones = new Object();


Bones.Renderer = new Object();

Bones.Renderer.canvas = document.getElementById("myCanvas");
Bones.Renderer.context = Bones.Renderer.canvas.getContext("2d");

Bones.Renderer.width = 500;
Bones.Renderer.height = 500;

// Todo: implement other display modes (fullscreen_stretch, embedded)

// canvas_width = window.screen.availWidth;
// canvas_height = window.screen.availHeight;

Bones.Renderer.display_mode = "fullscreen_dynamic"; 

Bones.Renderer.canvas.width = Bones.Renderer.width;
Bones.Renderer.canvas.height = Bones.Renderer.height;

if (Bones.Renderer.display_mode == "fullscreen_dynamic") {
    // Bones.canvas.style.width = '100%';
    // Bones.canvas.style.height = '100%';
    Bones.Renderer.canvas.style.position = "absolute";
    Bones.Renderer.canvas.style.left = "0px";
    Bones.Renderer.canvas.style.top = "0px";
    Bones.Renderer.canvas.style.border = "none";
}


Bones.Assets = new Object();

Bones.Assets.gfx_player = new Image();
Bones.Assets.gfx_player.src = "../assets/asset2.png";

Bones.Assets.gfx_ball = new Image();
Bones.Assets.gfx_ball.src = "../assets/asset1.png";


Bones.Input = new Object();

Bones.Input.source = "mouse_and_keyboard";

// Simple input
/* Bones.Input.cursor_activated = false;
Bones.Input.cursor_x = 0;
Bones.Input.cursor_y = 0;
Bones.Input.cursor_old_x = 0;
Bones.Input.cursor_old_y = 0; */

Bones.Input.touch_events_buffer = [];
Bones.Input.key_events_buffer = [];

Bones.Input.touch_events_history = []
Bones.Input.key_event_history = []

// Todo: implement a key mapper

Bones.Input.control_left = false;
Bones.Input.control_right = false;
Bones.Input.control_jump = false;

/* function update_mouse_pos(e) {
    let rect = canvas.getBoundingClientRect();
    cursor_x = e.clientX - rect.left;
    cursor_y = e.clientY - rect.top;
    touch_events_buffer.push([cursor_x, cursor_y])
} */

// Todo: create timer object

Bones.frame_lock = false;
// Bones.main_loop_sleep = 0;
Bones.total_lag_frames = 0;
Bones.fps_frame_counter = 0;
Bones.fps = 0;

Bones.frame_start_time = Date.now();
Bones.previous_frame_start_time = Date.now();

Bones.timescale = 60 / 1000;

Bones.demo_world1 = new World();

Bones.start = function() {
    setInterval(Bones.calculate_fps, 1000);
    Bones.run();
}

Bones.run = function() {
    // Begin execution lock
    // Todo: test this
    if (Bones.main_execution_lock == true) {
        Bones.total_lag_frames++;
        return false;
    }
    Bones.main_execution_lock = true;
    // End execution lock

    Bones.frame_start_time = Date.now()
    Bones.delta_time = Bones.frame_start_time - Bones.previous_frame_start_time
    if (Bones.delta_time > 100) {
        // Cap delta_time to prevent odd physics engine behaviour
        Bones.total_lag_frames++;
        Bones.delta_time = 100;
    }

    if (Bones.Renderer.display_mode = "fullscreen_dynamic") {
        console.log("debug")
        Bones.Renderer.width = window.innerWidth;
        Bones.Renderer.height = window.innerHeight;

        Bones.Renderer.canvas.width = Bones.Renderer.width;
        Bones.Renderer.canvas.height = Bones.Renderer.height;
    }

    Bones.Renderer.context.fillStyle = "LightGray";
    Bones.Renderer.context.fillRect(0, 0, Bones.Renderer.width, Bones.Renderer.height);

    // Todo: Add this to Bones.Input.tick() perhaps
    Bones.Input.touch_events_history = Bones.Input.touch_events_history.concat(Bones.Input.touch_events_buffer)
    Bones.Input.key_event_history = Bones.Input.key_event_history.concat(Bones.Input.key_event_buffer)

    Bones.demo_world1.tick(Bones.Renderer.context, Bones.Renderer.width, Bones.delta_time, Bones.timescale);

    Bones.Input.touch_events_buffer = []
    Bones.Input.key_event_buffer = []

    Bones.previous_frame_start_time = Bones.frame_start_time

    Bones.fps_frame_counter++;

    Bones.main_execution_lock = false;
    // Todo: Re-implement simulated lag
    /* 
        if (debug_simulate_lag == false) { i*/
    requestAnimationFrame(Bones.run);
    /* 
        }
        if (debug_simulate_lag == true) {
            setTimeout(launch_loop, Math.floor(Math.random() * debug_simulated_lag_range))
        } */
} 

Bones.calculate_fps = function() {
    Bones.fps = Bones.fps_frame_counter
    Bones.fps_frame_counter = 0
}

Bones.Renderer.canvas.addEventListener("touchstart", function(_event) {
	_event.preventDefault()
	Bones.touch_events_buffer.push(_event)
}, false);

Bones.Renderer.canvas.addEventListener("touchend", function(_event) {
	_event.preventDefault()
	Bones.Input.touch_events_buffer.push(_event)
	Bones.Input.cursor_activated = false;
}, false);

Bones.Renderer.canvas.addEventListener("touchmove", function(_event) {
	_event.preventDefault()
	Bones.Input.touch_events_buffer.push(_event)
}, false);

window.addEventListener("touchstart", _event => {
	_event.preventDefault();
	_event.stopImmediatePropagation();
}, {
	passive: false
});

document.addEventListener("keydown", function(_event) {
	Bones.Input.key_event_buffer.push(_event)
});

document.addEventListener("keyup", function(_event) {
	Bones.Input.key_event_buffer.push(_event)
}); 
