Bones.Timer = {
    init: function() {
        this.frame_lock = false;
        // Bones.main_loop_sleep = 0;
        this.total_lag_frames = 0;
        this.fps_frame_counter = 0;
        this.fps = 0;

        this.current_frame_start_time = Date.now();
        this.previous_frame_start_time = Date.now();

        this.delta_time = 0;

        this.timescale = 60 / 1000;
        this.physics_timescale = 1;

        this.calculate_fps = function() {
            this.fps = this.fps_frame_counter
            this.fps_frame_counter = 0
        }
    }
}
Bones.Timer.init()
