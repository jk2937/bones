Bones.Input = {
    init: function() {
        this.Touch = {
            Buffers: {
                frame_events: [],
                gesture_events: []
            }
        }
        this.Mouse = {
            Buffers: {
                frame_events: [],
                gesture_events: []
            }
        }
        this.Keyboard = {
            Buffers: {
                frame_events: [],
                gesture_events: []
            }
        }

        this.Touch.Buffers.frame_events = [];
        this.Mouse.Buffers.frame_events = [];
        this.Keyboard.Buffers.frame_events = [];

        this.touch_events_history = []
        this.mouse_events_history = []
        this.key_events_history = []

        // this.keys

        // Todo: implement a key mapper

        this.Keyboard.ControlStates = new Object()

        this.keymap = {
            "up": "w",
            "down": "s",
            "left": "a",
            "right": "d",
            "jump": " ",
            "sprint": "Shift",
            "crouch": "Control"
        }

        let entries = Object.entries(this.keymap)

        for (let i = 0; i < entries.length; i++) {
            let entry = entries[i]
            // out: entry = ["up", "w"]
            this.Keyboard.ControlStates = Object.assign({ [entry[0]]: { key: entry[1], pressed: false, pressed_this_frame: false } }, this.Keyboard.ControlStates)
        }

        /*
        this.control_jump_alt = false;
        this.control_jump_alt = false;

        this.control_run_alt = false;
        this.control_run_alt = false;
        */


        this.mouse_cursor_click = false;
        this.mouse_cursor_click_this_frame = false;
        this.mouse_cursor_x = window.innerWidth / 2;
        this.mouse_cursor_y = window.innerHeight / 2;

        this.touch_cursor_click = false;
        this.touch_cursor_click_this_frame = false;
        this.touch_cursor_x = window.innerWidth / 2;
        this.touch_cursor_y = window.innerHeight / 2;

        this.mouse_read_controls = function(){
            this.mouse_cursor_click_this_frame = false;
            if (this.Mouse.Buffers.frame_events.length > 0) {
                let _event = this.Mouse.Buffers.frame_events[this.Mouse.Buffers.frame_events.length - 1];
                this.mouse_cursor_x = (_event.pageX - Bones.Renderer.canvas.offsetLeft) * (Bones.Renderer.width / Bones.Renderer.canvas.offsetWidth) 
                this.mouse_cursor_y = (_event.pageY - Bones.Renderer.canvas.offsetTop) * (Bones.Renderer.height / Bones.Renderer.canvas.offsetHeight) 
            }
            for (let i = 0; i < this.Mouse.Buffers.frame_events.length; i++) {
                let _event = this.Mouse.Buffers.frame_events[i]
                if (_event.type == "mousedown") {
                    this.mouse_cursor_click = true;
                    this.mouse_cursor_click_this_frame = true;
                    this.mouse_events_history = []
                }
                if (_event.type == "mouseup") {
                    this.mouse_cursor_click = false;
                    this.mouse_events_history = []
                }
            }
        }

        this.touch_read_controls = function(){
            this.touch_cursor_click_this_frame = false;
            if (this.Touch.Buffers.frame_events.length > 0) {
                let _event = this.Touch.Buffers.frame_events[this.Touch.Buffers.frame_events.length - 1];
                if (_event.touches.length > 0) {
                    this.touch_cursor_x = (_event.touches[0].pageX - Bones.Renderer.canvas.offsetLeft) * (Bones.Renderer.width / Bones.Renderer.canvas.offsetWidth) 
                    this.touch_cursor_y = (_event.touches[0].pageY - Bones.Renderer.canvas.offsetTop) * (Bones.Renderer.height / Bones.Renderer.canvas.offsetHeight) 
                    }
            }
            for (let i = 0; i < this.Touch.Buffers.frame_events.length; i++) {
                let _event = this.Touch.Buffers.frame_events[i]
                if (_event.type == "touchstart") {
                    this.touch_cursor_click = true;
                    this.touch_cursor_click_this_frame = true;
                    this.touch_events_history = []
                }
                if (_event.type == "touchend") {
                    this.touch_cursor_click = false;
                    this.touch_events_history = []
        }
            }
        }


        this.keys_read_controls = function() {
            // process key events
            // this.control_jump_this_frame = false

            for (let i = 0; i < Object.entries(this.Keyboard.ControlStates).length; i++) {
                this.Keyboard.ControlStates[Object.entries(this.Keyboard.ControlStates)[i][0]].pressed_this_frame = false
            }

            for (let i = 0; i < this.Keyboard.Buffers.frame_events.length; i++) {
                let _event = this.Keyboard.Buffers.frame_events[i]
                if (_event.type == "keydown") {
                   for (let i = 0; i < Object.entries(this.Keyboard.ControlStates).length; i++) {
                        if (_event.key == this.Keyboard.ControlStates[Object.entries(this.Keyboard.ControlStates)[i][0]].key) {
                            this.Keyboard.ControlStates[Object.entries(this.Keyboard.ControlStates)[i][0]].pressed = true
                            this.Keyboard.ControlStates[Object.entries(this.Keyboard.ControlStates)[i][0]].pressed_this_frame = true
                        }
                   }
                }
                if (_event.type == "keyup") {
                   for (let i = 0; i < Object.entries(this.Keyboard.ControlStates).length; i++) {
                        if (_event.key == this.Keyboard.ControlStates[Object.entries(this.Keyboard.ControlStates)[i][0]].key) {
                            this.Keyboard.ControlStates[Object.entries(this.Keyboard.ControlStates)[i][0]].pressed = false
                        }
                   }
                }
            }

        }

    }
}
Bones.Input.init()


// Add touch events to buffer

Bones.Renderer.canvas.addEventListener("touchstart", function(_event) {
    Bones.Input.Touch.Buffers.frame_events.push(_event)
});

Bones.Renderer.canvas.addEventListener("touchend", function(_event) {
    Bones.Input.Touch.Buffers.frame_events.push(_event)
});

Bones.Renderer.canvas.addEventListener("touchmove", function(_event) {
    Bones.Input.Touch.Buffers.frame_events.push(_event)
});


// Prevent default touch behaviour (https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#using_passive_listeners)

window.addEventListener("touchstart", function(_event) {
    _event.preventDefault();
    _event.stopImmediatePropagation();
}, { passive: false });

window.addEventListener("touchmove", function(_event) {
    _event.preventDefault();
    _event.stopImmediatePropagation();
}, { passive: false });


// Add mouse events to buffer

Bones.Renderer.canvas.addEventListener("mousedown", function(_event) {
    Bones.Input.Mouse.Buffers.frame_events.push(_event)
});

document.addEventListener("mouseup", function(_event) { // Note: Using "document" here to read mouseup outside of display
    Bones.Input.Mouse.Buffers.frame_events.push(_event)
});

Bones.Renderer.canvas.addEventListener("mousemove", function(_event) {
    Bones.Input.Mouse.Buffers.frame_events.push(_event)
});


// Add key events to buffer

document.addEventListener("keydown", function(_event) {
    Bones.Input.Keyboard.Buffers.frame_events.push(_event)
});

document.addEventListener("keyup", function(_event) {
    Bones.Input.Keyboard.Buffers.frame_events.push(_event)
}); 
