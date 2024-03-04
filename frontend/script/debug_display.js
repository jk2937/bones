class DebugDisplay {
    constructor() {
        this.visible = true

        this.show_lag_frames = false

        this.simulated_lag = false
        this.simulated_lag_range = 500
        this.physics_wireframe = true

        this.test_simple_player_movement = false

        this.variables = ["Bones.fps", "", "Bones.demo_world1.player1.control_left", "Bones.demo_world1.player1.control_right", "Bones.demo_world1.player1.control_jump", "", "Bones.demo_world1.player1.control_left_this_frame", "Bones.demo_world1.player1.control_right_this_frame", "Bones.demo_world1.player1.control_jump_this_frame"]
        //this.variables = ["fps", "total_lag_frames", "debug_simulate_lag", "", "control_left", "control_right", "control_jump", "", "control_left_this_frame", "control_right_this_frame", "control_jump_this_frame", "", "player_on_ground"]
        //this.variables2 = ["fps", "control_left", "control_right", "control_jump"]
        this.stress_test = false;
        this.stress_loops = 999999;
        this.stress_random = false;
    }
}
