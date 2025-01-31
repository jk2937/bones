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
