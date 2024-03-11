

Bones.Input = new Object();

Bones.Input.touch_events_buffer = [];
Bones.Input.mouse_events_buffer = [];
Bones.Input.key_events_buffer = [];

Bones.Input.touch_events_history = []
Bones.Input.mouse_events_history = []
Bones.Input.key_events_history = []

// Bones.Input.keys

// Todo: implement a key mapper

Bones.Input.controls = {}

Bones.Input.keymap = {
    "up": "w",
    "down": "s",
    "left": "a",
    "right": "d",
    "jump": " ",
    "sprint": "Shift",
    "crouch": "Control"
}

let entries = Object.entries(Bones.Input.keymap)

for (let i = 0; i < entries.length; i++) {
    let entry = entries[i]
    // out: entry = ["up", "w"]
    Bones.Input.controls = Object.assign({ [entry[0]]: { key: entry[1], pressed: false, pressed_this_frame: false } }, Bones.Input.controls)
}

/*
Bones.Input.control_jump_alt = false;
Bones.Input.control_jump_alt = false;

Bones.Input.control_run_alt = false;
Bones.Input.control_run_alt = false;
*/


Bones.Input.mouse_cursor_click = false;
Bones.Input.mouse_cursor_click_this_frame = false;
Bones.Input.mouse_cursor_x = window.innerWidth / 2;
Bones.Input.mouse_cursor_y = window.innerHeight / 2;

Bones.Input.touch_cursor_click = false;
Bones.Input.touch_cursor_click_this_frame = false;
Bones.Input.touch_cursor_x = window.innerWidth / 2;
Bones.Input.touch_cursor_y = window.innerHeight / 2;

Bones.Input.mouse_read_controls = function(){
    Bones.Input.mouse_cursor_click_this_frame = false;
    if (Bones.Input.mouse_events_buffer.length > 0) {
        let _event = Bones.Input.mouse_events_buffer[Bones.Input.mouse_events_buffer.length - 1];
        Bones.Input.mouse_cursor_x = (_event.pageX - Bones.Renderer.canvas.offsetLeft) * (Bones.Renderer.width / Bones.Renderer.canvas.offsetWidth) 
        Bones.Input.mouse_cursor_y = (_event.pageY - Bones.Renderer.canvas.offsetTop) * (Bones.Renderer.height / Bones.Renderer.canvas.offsetHeight) 
    }
    for (let i = 0; i < Bones.Input.mouse_events_buffer.length; i++) {
        let _event = Bones.Input.mouse_events_buffer[i]
        if (_event.type == "mousedown") {
            Bones.Input.mouse_cursor_click = true;
            Bones.Input.mouse_cursor_click_this_frame = true;
            Bones.Input.mouse_events_history = []
        }
        if (_event.type == "mouseup") {
            Bones.Input.mouse_cursor_click = false;
            Bones.Input.mouse_events_history = []
        }
    }
}

Bones.Input.touch_read_controls = function(){
    Bones.Input.touch_cursor_click_this_frame = false;
    if (Bones.Input.touch_events_buffer.length > 0) {
        let _event = Bones.Input.touch_events_buffer[Bones.Input.touch_events_buffer.length - 1];
        if (_event.touches.length > 0) {
            Bones.Input.touch_cursor_x = (_event.touches[0].pageX - Bones.Renderer.canvas.offsetLeft) * (Bones.Renderer.width / Bones.Renderer.canvas.offsetWidth) 
            Bones.Input.touch_cursor_y = (_event.touches[0].pageY - Bones.Renderer.canvas.offsetTop) * (Bones.Renderer.height / Bones.Renderer.canvas.offsetHeight) 
            }
    }
    for (let i = 0; i < Bones.Input.touch_events_buffer.length; i++) {
        let _event = Bones.Input.touch_events_buffer[i]
        if (_event.type == "touchstart") {
            Bones.Input.touch_cursor_click = true;
            Bones.Input.touch_cursor_click_this_frame = true;
            Bones.Input.touch_events_history = []
        }
        if (_event.type == "touchend") {
            Bones.Input.touch_cursor_click = false;
            Bones.Input.touch_events_history = []
}
    }
}


Bones.Input.keys_read_controls = function() {
    // process key events
    // Bones.Input.control_jump_this_frame = false

    for (let i = 0; i < Object.entries(Bones.Input.controls).length; i++) {
        Bones.Input.controls[Object.entries(Bones.Input.controls)[i][0]].pressed_this_frame = false
    }

    for (let i = 0; i < Bones.Input.key_events_buffer.length; i++) {
        let _event = Bones.Input.key_events_buffer[i]
        if (_event.type == "keydown") {
           for (let i = 0; i < Object.entries(Bones.Input.controls).length; i++) {
                if (_event.key == Bones.Input.controls[Object.entries(Bones.Input.controls)[i][0]].key) {
                    Bones.Input.controls[Object.entries(Bones.Input.controls)[i][0]].pressed = true
                    Bones.Input.controls[Object.entries(Bones.Input.controls)[i][0]].pressed_this_frame = true
                }
           }
        }
        if (_event.type == "keyup") {
           for (let i = 0; i < Object.entries(Bones.Input.controls).length; i++) {
                if (_event.key == Bones.Input.controls[Object.entries(Bones.Input.controls)[i][0]].key) {
                    Bones.Input.controls[Object.entries(Bones.Input.controls)[i][0]].pressed = false
                }
           }
        }
    }

}


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
}, { passive: false });

window.addEventListener("touchmove", function(_event) {
	_event.preventDefault();
	_event.stopImmediatePropagation();
}, { passive: false });


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
