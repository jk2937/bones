Bones.Debugger = new Object();
Bones.Debugger.simulated_lag = false;
Bones.Debugger.simulated_lag_intensity = 500;

Bones.Debugger.visible = true

Bones.Debugger.show_lag_frames = false

Bones.Debugger.physics_wireframe = true

Bones.Debugger.test_simple_player_movement = false

Bones.Debugger.variables = ["Bones.Timer.fps", "", "Bones.demo_world1.player1.control_left", "Bones.demo_world1.player1.control_right", "Bones.demo_world1.player1.control_jump", "", "Bones.demo_world1.player1.control_left_this_frame", "Bones.demo_world1.player1.control_right_this_frame", "Bones.demo_world1.player1.control_jump_this_frame"]
Bones.Debugger.stress_test = false;
Bones.Debugger.stress_loops = 999999;
Bones.Debugger.stress_random = false;

Bones.Debugger.render = function() {
    if (Bones.Debugger.visible == true) {
        Bones.Renderer.context.font = "12px Monospace";
        Bones.Renderer.context.fillStyle = "Gray"
        Bones.Renderer.context.textAlign = "left";

        for (let i = 0; i < Bones.Debugger.variables.length; i++) {
            if (Bones.Debugger.variables[i] != "") {
                Bones.Renderer.context.fillText(Bones.Debugger.variables[i], 10, 50 + i * 15)
                Bones.Renderer.context.fillText(eval(Bones.Debugger.variables[i]), 400, 50 + i * 15)
            }
        }
    }
}
