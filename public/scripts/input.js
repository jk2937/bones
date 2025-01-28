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

        this.Touch.Buffers.gesture_events = []
        this.Mouse.Buffers.gesture_events = []
        this.Keyboard.Buffers.gesture_events = []

        this.Keyboard.ControlStates = new Object()

        let keymap = {
            "up": "w",
            "down": "s",
            "left": "a",
            "right": "d",
            "jump": " ",
            "sprint": "Shift",
            "crouch": "Control",
            "select0": "1",
            "select1": "2",
            "select2": "3",
            "select3": "4",
        }

        let entries = Object.entries(keymap)

        for (let i = 0; i < entries.length; i++) {
            let entry = entries[i]
            // out: entry = ["up", "w"]
            this.Keyboard.ControlStates = Object.assign({ [entry[0]]: { key: entry[1], pressed: false, pressed_this_frame: false } }, this.Keyboard.ControlStates)
        }

        this.Mouse.ControlStates = new Object()

        this.Mouse.ControlStates.click = false;
        this.Mouse.ControlStates.click_this_frame = false;
        this.Mouse.ControlStates.x = window.innerWidth / 2;
        this.Mouse.ControlStates.y = window.innerHeight / 2;


        this.Touch.ControlStates = new Object()

        this.Touch.ControlStates.click = false;
        this.Touch.ControlStates.click_this_frame = false;
        this.Touch.ControlStates.x = window.innerWidth / 2;
        this.Touch.ControlStates.y = window.innerHeight / 2;

    }, // END FUNCTION init

        process_buffers: function(){
            this.Mouse.ControlStates.click_this_frame = false;
            if (this.Mouse.Buffers.frame_events.length > 0) {
                let _event = this.Mouse.Buffers.frame_events[this.Mouse.Buffers.frame_events.length - 1];
                this.Mouse.ControlStates.x = (_event.pageX - Bones.Renderer.canvas.offsetLeft) * (Bones.Renderer.width / Bones.Renderer.canvas.offsetWidth) 
                this.Mouse.ControlStates.y = (_event.pageY - Bones.Renderer.canvas.offsetTop) * (Bones.Renderer.height / Bones.Renderer.canvas.offsetHeight) 
            }
            for (let i = 0; i < this.Mouse.Buffers.frame_events.length; i++) {
                let _event = this.Mouse.Buffers.frame_events[i]
                if (_event.type == "mousedown") {
                    this.Mouse.ControlStates.click = true;
                    this.Mouse.ControlStates.click_this_frame = true;
                    this.Mouse.Buffers.gesture_events = []
                }
                if (_event.type == "mouseup") {
                    this.Mouse.ControlStates.click = false;
                    this.Mouse.Buffers.gesture_events = []
                }
            }
            this.Touch.ControlStates.click_this_frame = false;
            if (this.Touch.Buffers.frame_events.length > 0) {
                let _event = this.Touch.Buffers.frame_events[this.Touch.Buffers.frame_events.length - 1];
                if (_event.touches.length > 0) {
                    this.Touch.ControlStates.x = (_event.touches[0].pageX - Bones.Renderer.canvas.offsetLeft) * (Bones.Renderer.width / Bones.Renderer.canvas.offsetWidth) 
                    this.Touch.ControlStates.y = (_event.touches[0].pageY - Bones.Renderer.canvas.offsetTop) * (Bones.Renderer.height / Bones.Renderer.canvas.offsetHeight) 
                    }
            }
            for (let i = 0; i < this.Touch.Buffers.frame_events.length; i++) {
                let _event = this.Touch.Buffers.frame_events[i]
                if (_event.type == "touchstart") {
                    this.Touch.ControlStates.click = true;
                    this.Touch.ControlStates.click_this_frame = true;
                    this.Touch.Buffers.gesture_events = []
                }
                if (_event.type == "touchend") {
                    this.Touch.ControlStates.click = false;
                    this.Touch.Buffers.gesture_events = []
        }
            }
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

        }, // END FUNCTION process_buffers

        load_gesture_events_buffers: function() {
            this.Touch.Buffers.gesture_events = this.Touch.Buffers.gesture_events.concat(this.Touch.Buffers.frame_events)
            this.Mouse.Buffers.gesture_events = Bones.Input.Mouse.Buffers.gesture_events.concat(this.Mouse.Buffers.frame_events)
            this.Keyboard.Buffers.gesture_events = this.Keyboard.Buffers.gesture_events.concat(this.Keyboard.Buffers.frame_events)
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

document.addEventListener('contextmenu', event => event.preventDefault());
