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
            },
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
            this.ControlStates.Keyboard = Object.assign({
                [entry[0]]: {
                    key: entry[1],
                    activated: false,
                    activated_this_frame: false
                }
            }, this.ControlStates.Keyboard)
        }
    }, // END FUNCTION init

    process_buffers: function() {
        // Update ControlStates with data from Buffers

        // Begin with mouse

        let cs = this.ControlStates
        let b = this.Buffers

        cs.Mouse.activated_this_frame = false;
        if (b.Mouse.frame_events.length > 0) {
            // Get the mouse cursor position from the most recent event

            let _event = b.Mouse.frame_events[b.Mouse.frame_events.length - 1];
            cs.Mouse.x = (_event.pageX - Bones.Renderer.canvas.offsetLeft) * (Bones.Renderer.width / Bones.Renderer.canvas.offsetWidth)
            cs.Mouse.y = (_event.pageY - Bones.Renderer.canvas.offsetTop) * (Bones.Renderer.height / Bones.Renderer.canvas.offsetHeight)
        }

        for (let i = 0; i < b.Mouse.frame_events.length; i++) {
            let _event = b.Mouse.frame_events[i]
            if (_event.type == "mousedown") {
                cs.Mouse.click = true;
                cs.Mouse.click_this_frame = true;
                cs.Mouse.gesture_events = []
            }
            if (_event.type == "mouseup") {
                    cs.Mouse.click = false;
                    b.Mouse.gesture_events = []
            }
        }

        // cs.Touch.touch_this_frame = false;
        if (b.Touch.frame_events.length > 0) {
            let _event = b.Touch.frame_events[b.Touch.frame_events.length - 1];
            if (_event.touches.length > 0) {
                if (this.touch_mouse == true) {
                    cs.Mouse.x = (_event.touches[0].pageX - Bones.Renderer.canvas.offsetLeft) * (Bones.Renderer.width / Bones.Renderer.canvas.offsetWidth)
                    cs.Mouse.y = (_event.touches[0].pageY - Bones.Renderer.canvas.offsetTop) * (Bones.Renderer.height / Bones.Renderer.canvas.offsetHeight)
                }
            }
        }
        for (let i = 0; i < b.Touch.frame_events.length; i++) {
            let _event = b.Touch.frame_events[i]
            if (_event.type == "touchstart") {
                if (this.touch_mouse == true) {
                    cs.Mouse.click = true;
                    cs.Mouse.click_this_frame = true;
                    cs.Mouse.events_history = []
                }
            }
            if (_event.type == "touchend") {
                if (this.touch_mouse == true) {
                    cs.Mouse.cursor_click = false;
                    cs.Mouse.events_history = []
                }
            }
        }

        // process key events

        for (let i = 0; i < Object.entries(cs.Keyboard).length; i++) {
            cs.Keyboard[Object.entries(cs.Keyboard)[i][0]].pressed_this_frame = false
        }

        for (let i = 0; i < b.Keyboard.frame_events.length; i++) {
            let _event = b.Keyboard.frame_events[i]
            
            if (_event.type == "keydown") {
                for (let i = 0; i < Object.entries(cs.Keyboard).length; i++) {
                    if (_event.key == cs.Keyboard[Object.entries(cs.Keyboard)[i][0]].key) {
                        cs.Keyboard[Object.entries(cs.Keyboard)[i][0]].pressed = true
                        cs.Keyboard[Object.entries(cs.Keyboard)[i][0]].pressed_this_frame = true
                    }
                }
            }

            if (_event.type == "keyup") {
                for (let i = 0; i < Object.entries(cs.Keyboard).length; i++) {
                    if (_event.key == cs.Keyboard[Object.entries(cs.Keyboard)[i][0]].key) {
                        cs.Keyboard[Object.entries(cs.Keyboard)[i][0]].pressed = false
                    }
                }
            }

        }

    }, // END FUNCTION process_buffers

    tick: function() {
        this.Buffers.Touch.gesture_events = this.Buffers.Touch.gesture_events.concat(this.Buffers.Touch.frame_events)
        this.Buffers.Mouse.gesture_events = this.Buffers.Mouse.gesture_events.concat(this.Buffers.Mouse.frame_events)
        this.Buffers.Keyboard.gesture_events = this.Buffers.Keyboard.gesture_events.concat(this.Buffers.Keyboard.frame_events)
    }
}
Bones.Input.init()


// Add touch events to buffer

Bones.Renderer.canvas.addEventListener("touchstart", function(_event) {
    Bones.Input.Buffers.Touch.frame_events.push(_event)
});

Bones.Renderer.canvas.addEventListener("touchend", function(_event) {
    Bones.Input.Buffers.Touch.frame_events.push(_event)
});

Bones.Renderer.canvas.addEventListener("touchmove", function(_event) {
    Bones.Input.Buffers.Touch.frame_events.push(_event)
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
    Bones.Input.Buffers.Mouse.frame_events.push(_event)
});

document.addEventListener("mouseup", function(_event) { // Note: Using "document" here to read mouseup outside of display
    Bones.Input.Buffers.Mouse.frame_events.push(_event)
});

Bones.Renderer.canvas.addEventListener("mousemove", function(_event) {
    Bones.Input.Buffers.Mouse.frame_events.push(_event)
});


// Add key events to buffer

document.addEventListener("keydown", function(_event) {
    Bones.Input.Buffers.Keyboard.frame_events.push(_event)
});

document.addEventListener("keyup", function(_event) {
    Bones.Input.Buffers.Keyboard.frame_events.push(_event)
});
