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

    Bones.Renderer.refresh_display()

    Bones.Renderer.context.fillStyle = "LightGray";
    Bones.Renderer.context.fillRect(0, 0, Bones.Renderer.width, Bones.Renderer.height);

    // Todo: Add this to Bones.Input.tick() perhaps
    Bones.Input.touch_events_history = Bones.Input.touch_events_history.concat(Bones.Input.Touch.Buffers.frame_events)
    Bones.Input.mouse_events_history = Bones.Input.mouse_events_history.concat(Bones.Input.Mouse.Buffers.frame_events)
    Bones.Input.key_events_history = Bones.Input.key_events_history.concat(Bones.Input.Keyboard.Buffers.frame_events)

    Bones.demo_world1.tick(Bones.Renderer.context, Bones.Renderer.width, Bones.delta_time, Bones.timescale);

    Bones.Input.Touch.Buffers.frame_events = []
    Bones.Input.Mouse.Buffers.frame_events = []
    Bones.Input.Keyboard.Buffers.frame_events = []

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

