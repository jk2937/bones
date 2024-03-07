Bones = new Object();


Bones.Renderer = new Object();

Bones.Renderer.canvas = document.getElementById("myCanvas");
Bones.Renderer.context = Bones.Renderer.canvas.getContext("2d");

Bones.Renderer.canvas.style.border = "none";

Bones.Renderer.width = 500;
Bones.Renderer.height = 500;

Bones.Renderer.display_mode = null; 

Bones.Renderer.display_to_relative_position = function() {
    Bones.Renderer.canvas.style.position = "relative";
}

Bones.Renderer.display_to_absolute_position = function() {
    Bones.Renderer.canvas.style.position = "absolute";
    Bones.Renderer.canvas.style.left = "0px";
    Bones.Renderer.canvas.style.top = "0px";
}

Bones.Renderer.update_dynamic_fullscreen_display = function() {
    Bones.Renderer.width = window.innerWidth;
    Bones.Renderer.height = window.innerHeight;
    Bones.Renderer.canvas.width = Bones.Renderer.width;
    Bones.Renderer.canvas.height = Bones.Renderer.height   
}

Bones.Renderer.set_display_mode = function(mode=Bones.Renderer.display_mode, width=Bones.Renderer.width, height=Bones.Renderer.height) {
    if (mode != "embedded" && mode != "dynamic_fullscreen" && mode != "stretched_fullscreen") {
        console.log("Warning: No such screen mode: \"" + mode + "\". Please use \"embedded\", \"stretched_fullscreen\", or \"dynamic_fullscreen\".");
        return false;
    }

    Bones.Renderer.display_mode = mode

    Bones.Renderer.width = width;
    Bones.Renderer.height = height;

    if (mode == "embedded" || mode == "stretched_fullscreen") {
        Bones.Renderer.canvas.style.width = '';
        Bones.Renderer.canvas.style.height = '';
        Bones.Renderer.canvas.width = Bones.Renderer.width;
        Bones.Renderer.canvas.height = Bones.Renderer.height;
    }

    if (mode == "dynamic_fullscreen") {
        Bones.Renderer.update_dynamic_fullscreen_display()
        Bones.Renderer.display_to_absolute_position()
    }

    if (mode == "stretched_fullscreen") {
        Bones.Renderer.canvas.style.width = '100%';
        Bones.Renderer.canvas.style.height = '100%';
        Bones.Renderer.display_to_absolute_position()
    }
    return true;
}

Bones.Renderer.set_display_mode("dynamic_fullscreen")

Bones.Assets = new Object();

Bones.Assets.gfx_player = new Image();
Bones.Assets.gfx_player.src = "../assets/asset2.png";

Bones.Assets.gfx_ball = new Image();
Bones.Assets.gfx_ball.src = "../assets/asset1.png";


Bones.Input = new Object();

Bones.Input.source = "mouse_and_keyboard";

Bones.Input.touch_events_buffer = [];
Bones.Input.key_events_buffer = [];

Bones.Input.touch_events_history = []
Bones.Input.key_events_history = []

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

Bones.Timer = new Object()

Bones.Timer.frame_lock = false;
// Bones.main_loop_sleep = 0;
Bones.Timer.total_lag_frames = 0;
Bones.Timer.fps_frame_counter = 0;
Bones.Timer.fps = 0;

Bones.Timer.current_frame_start_time = Date.now();
Bones.Timer.previous_frame_start_time = Date.now();

Bones.Timer.delta_time = 0;

Bones.Timer.timescale = 60 / 1000;
Bones.Timer.physics_timescale = 1;

Bones.Timer.calculate_fps = function() {
    Bones.Timer.fps = Bones.Timer.fps_frame_counter
    Bones.Timer.fps_frame_counter = 0
}

Bones.Debugger = new Object();
Bones.Debugger.simulated_lag = false;
Bones.Debugger.simulated_lag_intensity = 500;


Bones.demo_world1 = new World();


Bones.start = function() {
    setInterval(Bones.Timer.calculate_fps, 1000);
    Bones.run();
}

Bones.run = function() {
    if (Bones.Timer.frame_lock == true) {
        Bones.Timer.total_lag_frames++;
        console.log("Warning: frame locked")
        return false;
    }
    Bones.Timer.frame_lock = true;

    Bones.Timer.current_frame_start_time = Date.now()
    Bones.Timer.delta_time = Bones.Timer.current_frame_start_time - Bones.Timer.previous_frame_start_time
    if (Bones.Timer.delta_time > 100) {
        // Cap delta_time to prevent odd physics engine behaviour
        Bones.Timer.total_lag_frames++;
        Bones.Timer.delta_time = 100;
    }

    if (Bones.Renderer.display_mode == "dynamic_fullscreen") {
        Bones.Renderer.update_dynamic_fullscreen_display()
    }

    Bones.Renderer.context.fillStyle = "LightGray";
    Bones.Renderer.context.fillRect(0, 0, Bones.Renderer.width, Bones.Renderer.height);

    // Todo: Add this to Bones.Input.tick() perhaps
    Bones.Input.touch_events_history = Bones.Input.touch_events_history.concat(Bones.Input.touch_events_buffer)
    Bones.Input.key_events_history = Bones.Input.key_events_history.concat(Bones.Input.key_events_buffer)

    Bones.demo_world1.tick(Bones.Renderer.context, Bones.Renderer.width, Bones.delta_time, Bones.timescale);

    Bones.Input.touch_events_buffer = []
    Bones.Input.key_events_buffer = []

    Bones.Timer.previous_frame_start_time = Bones.Timer.current_frame_start_time

    Bones.Timer.fps_frame_counter++;

    Bones.Timer.frame_lock = false;

    if (Bones.Debugger.simulated_lag != true) { 
        requestAnimationFrame(Bones.run);
    }
    if (Bones.Debugger.simulated_lag == true) {
        setTimeout(Bones.run, Math.floor(Math.random() * Bones.Debugger.simulated_lag_intensity))
    }
} 

Bones.Renderer.canvas.addEventListener("touchstart", function(_event) {
	_event.preventDefault()
	Bones.Input.touch_events_buffer.push(_event)
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


// Prevent screen movement

window.addEventListener("touchstart", function(_event) {
	_event.preventDefault();
	_event.stopImmediatePropagation();
}, {
	passive: false
});


document.addEventListener("keydown", function(_event) {
	Bones.Input.key_events_buffer.push(_event)
});

document.addEventListener("keyup", function(_event) {
	Bones.Input.key_events_buffer.push(_event)
}); 
