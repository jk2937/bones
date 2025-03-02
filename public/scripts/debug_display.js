Bones.DebugDisplay = { 
    init: function() {
        this.simulated_lag = false;
        this.simulated_lag_intensity = 100;
        // The maximum amount of simulated lag you can use before getting lag frames is 100

        this.visible = false

        this.touch_data = true
        this.mouse_data = true

        this.show_lag_frames = false

        this.physics_wireframe = true

        this.test_simple_player_movement = false
        this.test_camera = false

        this.variables = ["Bones.Timer.fps", "Bones.Timer.total_lag_frames", "", "Bones.Input.Keyboard.ControlStates[\"left\"].pressed", "Bones.Input.Keyboard.ControlStates[\"right\"].pressed", "Bones.Input.Keyboard.ControlStates[\"up\"].pressed", "Bones.Input.Keyboard.ControlStates[\"down\"].pressed", "Bones.Input.Keyboard.ControlStates[\"jump\"].pressed", "", "Bones.Input.Keyboard.ControlStates[\"left\"].pressed_this_frame", "Bones.Input.Keyboard.ControlStates[\"right\"].pressed_this_frame", "Bones.Input.Keyboard.ControlStates[\"jump\"].pressed_this_frame", "", "Bones.Input.Mouse.ControlStates.x", "Bones.Input.Mouse.ControlStates.y", "", "Bones.Input.Mouse.ControlStates.click", "Bones.Input.Mouse.ControlStates.click_this_frame", "Bones.Input.Mouse.ControlStates.scroll_up_this_frame", "Bones.Input.Mouse.ControlStates.scroll_down_this_frame", "Bones.Input.Mouse.ControlStates.scroll_delta", "", "Bones.Input.Touch.ControlStates.x", "Bones.Input.Touch.ControlStates.y", "", "Bones.Input.Touch.ControlStates.click", "Bones.Input.Touch.ControlStates.click_this_frame"]
        this.stress_test = false;
        this.stress_loops = 999999;
        this.stress_random = false;

        this.render = function() {
            if (this.visible == true) {
                Bones.Renderer.context.font = "12px Monospace";
                Bones.Renderer.context.fillStyle = "#495664"
                Bones.Renderer.context.textAlign = "left";

                for (let i = 0; i < this.variables.length; i++) {
                    if (this.variables[i] != "") {
                        Bones.Renderer.context.fillText(this.variables[i], 10, 250 + i * 15)
                        Bones.Renderer.context.fillText(eval(this.variables[i]), Bones.Renderer.width / 2, 250 + i * 15)
                    }
                }
            }
            if (this.mouse_data == true && Bones.Input.Mouse.ControlStates.click == true) {
               for (let i = 0; i < Bones.Input.Mouse.Buffers.gesture_events.length; i++) {
                    let _event = Bones.Input.Mouse.Buffers.gesture_events[i]
                    let canvas_position = Bones.Renderer.canvas.getBoundingClientRect();
                    let mouse_x = (_event.pageX - Bones.Renderer.canvas.offsetLeft) * (Bones.Renderer.width / Bones.Renderer.canvas.offsetWidth) 
                    let mouse_y = (_event.pageY - Bones.Renderer.canvas.offsetTop) * (Bones.Renderer.height / Bones.Renderer.canvas.offsetHeight) 
                    //Bones.Renderer.context.fillText(_event.type + " " + mouse_x + " " + mouse_y, mouse_x, mouse_y)
                }
            }
            if (this.touch_data == true) {
               for (let i = 0; i < Bones.Input.Touch.Buffers.gesture_events.length; i++) {
                    let _event = Bones.Input.Touch.Buffers.gesture_events[i]
                    for (let j = 0; j < _event.touches.length; j++) {
                        let touch = _event.touches[j]
                        let canvas_position = Bones.Renderer.canvas.getBoundingClientRect();
                        let touch_x = (touch.pageX - Bones.Renderer.canvas.offsetLeft) * (Bones.Renderer.width / Bones.Renderer.canvas.offsetWidth) 
                        let touch_y = (touch.pageY - Bones.Renderer.canvas.offsetTop) * (Bones.Renderer.height / Bones.Renderer.canvas.offsetHeight) 
                        //Bones.Renderer.context.fillText(_event.type + " " + touch.identifier + " " + touch_x + " " + touch_y, touch_x, touch_y)
                    }
                }  
            }
        }
    }
}
Bones.DebugDisplay.init()

