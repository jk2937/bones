Bones.Input = {
    init: function() {
        // These buffers are populated by onmousemove and other similar events outside of the program loop and processed once per frame

        this.Buffers = {
            Touch: {
                frame_events: [],
                gesture_events: []
            },
            Mouse: {
                frame_events: [],
                gesture_events: []
            },
            Keyboard: {
                frame_events: [],
                gesture_events: []
            }
        }

        // Control states organize the data from the buffers. They are updated once per frame with the buffers

        this.ControlStates = {
            Mouse: {
                click: false,
                click_this_frame: false,
                x: window.innerwidth / 2,
                y: window.innerheight / 2
            }
            Keyboard: {}
        }

        // Write Buffer.Touch into ControlStates.Mouse

        this.touch_mouse = true;

        // Populate the ControlStates.Keyboard object using a keymap

        // This may be turned into a let variable or made as part of a function to change the Keymap object if the object turns out to be useful enough to keep around

        this.Keymap = {
            "Up": "w",
            "Down": "s",
            "Left": "a",
            "Right": "d",
            "Jump": " ",
            "Sprint": "Shift",
            "Crouch": "Control"
        }

        let entries = Object.entries(this.Keymap)

        for (let i = 0; i < entries.length; i++) {
            let entry = entries[i]
            this.ControlStates = Object.assign({
                [entry[0]]: {
                    key: entry[1],
                    activated: false,
                    activated_this_frame: false
                }
            }, this.ControlStates)
        }

        this.process_buffers = function() {
            // Update ControlStates with data from Buffers

            // Begin with mouse

            this.ControlStates.Mouse.activated_this_frame = false;
            if (this.Buffers.Mouse.frame_events.lengt > 0) {
                // Get the mouse cursor position from the most recent event

                let _event = this.Buffers.Mouse.frame_events[this.Buffers.Mouse.frame_events.length - 1];
                this.ControlStates.Mouse.x = (_event.pageX - Bones.Renderer.canvas.offsetLeft) * (Bones.Renderer.width / Bones.Renderer.canvas.offsetWidth)
                this.ControlStates.Mouse.y = (_event.pageY - Bones.Renderer.canvas.offsetTop) * (Bones.Renderer.height / Bones.Renderer.canvas.offsetHeight)
            }

            for (let i = 0; i < this.Mouse.frame_buffer.length; i++) {
                let _event = this.Buffers.Mouse.frame_events[i]
                if (_event.type == "mousedown") {
                    this.ControlStates.Mouse.click = true;
                    this.ControlStates.Mouse.click_this_frame = true;
                    this.Buffer.Mouse.gesture_events = []
                }
                if (_event.type == "mouseup") {
                    this.ControlStates.Mouse.click = false;
                    this.Buffer.Mouse.gesture_events = []
                }
            }

            this.ControlStates.Touch.touch_this_frame = false;
            if (this.Buffers.Touch.frame_events.length > 0) {
                let _event = this.Buffers.Touch.frame_events[this.Buffers.Touch.frame_events.length - 1];
                if (_event.touches.length > 0) {
                    this.ControlStates.Touch.x = (_event.touches[0].pageX - Bones.Renderer.canvas.offsetLeft) * (Bones.Renderer.width / Bones.Renderer.canvas.offsetWidth)
                    this.ControlStates.Touch.y = (_event.touches[0].pageY - Bones.Renderer.canvas.offsetTop) * (Bones.Renderer.height / Bones.Renderer.canvas.offsetHeight)
                }
            }
            for (let i = 0; i < this.Buffers.Touch.frame_events.length; i++) {
                let _event = this.Buffers.Touch.frame_events[i]
                if (_event.type == "touchstart") {
                    this.ControlStates.Touch.click = true;
                    this.ControlStates.Touch.click_this_frame = true;
                    this.ControlStates.Touch.events_history = []
                }
                if (_event.type == "touchend") {
                    this.ControlStates.Touch.cursor_click = false;
                    this.ControlStates.Touch.events_history = []
                }
            }


            // process key events
            // this.control_jump_this_frame = false

            for (let i = 0; i < Object.entries(this.controls).length; i++) {
                this.controls[Object.entries(this.controls)[i][0]].pressed_this_frame = false
            }

            for (let i = 0; i < this.key_events_buffer.length; i++) {
                let _event = this.key_events_buffer[i]
                if (_event.type == "keydown") {
                    for (let i = 0; i < Object.entries(this.controls).length; i++) {
                        if (_event.key == this.controls[Object.entries(this.controls)[i][0]].key) {
                            this.controls[Object.entries(this.controls)[i][0]].pressed = true
                            this.controls[Object.entries(this.controls)[i][0]].pressed_this_frame = true
                        }
                    }
                }
                if (_event.type == "keyup") {
                    for (let i = 0; i < Object.entries(this.controls).length; i++) {
                        if (_event.key == this.controls[Object.entries(this.controls)[i][0]].key) {
                            this.controls[Object.entries(this.controls)[i][0]].pressed = false
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
    Bones.Input.touch_events_buffer.push(_event)
});

Bones.Renderer.canvas.addEventListener("touchend", function(_event) {
    Bones.Input.touch_events_buffer.push(_event)
});

Bones.Renderer.canvas.addEventListener("touchmove", function(_event) {
    Bones.Input.touch_events_buffer.push(_event)
});


// Prevent default touch behaviour (https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#using_passive_listeners)

window.addEventListener("touchstart", function(_event) {
    _event.preventDefault();
    _event.stopImmediatePropagation();
}, {
    passive: false
});

window.addEventListener("touchmove", function(_event) {
    _event.preventDefault();
    _event.stopImmediatePropagation();
}, {
    passive: false
});


// Add mouse events to buffer

Bones.Renderer.canvas.addEventListener("mousedown", function(_event) {
    Bones.Input.mouse_events_buffer.push(_event)
});

document.addEventListener("mouseup", function(_event) { // Note: Using "document" here to read mouseup outside of display
    Bones.Input.mouse_events_buffer.push(_event)
});

Bones.Renderer.canvas.addEventListener("mousemove", function(_event) {
    Bones.Input.mouse_events_buffer.push(_event)
});


// Add key events to buffer

document.addEventListener("keydown", function(_event) {
    Bones.Input.key_events_buffer.push(_event)
});

document.addEventListener("keyup", function(_event) {
    Bones.Input.key_events_buffer.push(_event)
});
