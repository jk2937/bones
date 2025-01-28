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

	if(isServer == false) {
		Bones.Renderer.refresh_display()
		
		Bones.Renderer.context.fillStyle = "#F0F8FF";
		Bones.Renderer.context.fillRect(0, 0, Bones.Renderer.width, Bones.Renderer.height);
		
		// Todo: Add this to Bones.Input.tick() perhaps
		Bones.Input.Touch.Buffers.gesture_events = Bones.Input.Touch.Buffers.gesture_events.concat(Bones.Input.Touch.Buffers.frame_events)
		Bones.Input.Mouse.Buffers.gesture_events = Bones.Input.Mouse.Buffers.gesture_events.concat(Bones.Input.Mouse.Buffers.frame_events)
		Bones.Input.Keyboard.Buffers.gesture_events = Bones.Input.Keyboard.Buffers.gesture_events.concat(Bones.Input.Keyboard.Buffers.frame_events)
		Bones.Input.load_gesture_events_buffers()
	}


    Bones.World.tick();

	
	if(isServer == false) {
		Bones.Input.Touch.Buffers.frame_events = []
		Bones.Input.Mouse.Buffers.frame_events = []
		Bones.Input.Keyboard.Buffers.frame_events = []
	}

    Bones.Timer.previous_frame_start_time = Bones.Timer.current_frame_start_time

    Bones.Timer.fps_frame_counter++;

    Bones.Timer.frame_lock = false;

    if (Bones.DebugDisplay.simulated_lag != true) { 
		if(isServer == false) {
			requestAnimationFrame(Bones.run);
		} else {
			setTimeout(Bones.run, 0)
		}
    }
    if (Bones.DebugDisplay.simulated_lag == true) {
        setTimeout(Bones.run, Math.floor(Math.random() * Bones.DebugDisplay.simulated_lag_intensity))
    }
} 

