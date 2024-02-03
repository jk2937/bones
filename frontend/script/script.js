/*
 * Copyright 2024 Jonathan Kaschak
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// Canvas properties

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const ball = new Image();
ball.src = "../assets/asset1.png"

canvas_width = 500;
canvas_height = 500;

canvas_fullscreen = false;
canvas_fullscreen_dynamic_res = true;

canvas.width = canvas_width;
canvas.height = canvas_height;

if (canvas_fullscreen_dynamic_res) {
    // canvas.style.width = '100%';
    // canvas.style.height = '100%';
    canvas.style.position = "absolute";
    canvas.style.left = "0px";
    canvas.style.top = "0px";
    canvas.style.border = "none";
}


// Touch events

let cursor_activated = false;
let cursor_x = 0;
let cursor_y = 0;
let cursor_old_x = 0;
let cursor_old_y = 0;
let touch_events_buffer = [];

canvas.addEventListener("touchstart", function(e) {
    e.preventDefault()
    console.log(e)
    touch_events_buffer.push(e)
    // cursor_activated = true;
    // update_mouse_pos(e.touches[0]);
}, false);

canvas.addEventListener("touchend", function(e) {
    e.preventDefault()
    console.log(e)
    touch_events_buffer.push(e)
    // cursor_activated = false;
}, false);

canvas.addEventListener("touchmove", function(e) {
    e.preventDefault()
    console.log(e)
    touch_events_buffer.push(e)
    // update_mouse_pos(e.touches[0])
}, false);

window.addEventListener("touchstart", ev => {
    ev.preventDefault();
    ev.stopImmediatePropagation();
}, {
    passive: false
});

/* function update_mouse_pos(e) {
    let rect = canvas.getBoundingClientRect();
    cursor_x = e.clientX - rect.left;
    cursor_y = e.clientY - rect.top;
    touch_events_buffer.push([cursor_x, cursor_y])
} */


// Keyboard Events

let key_event_buffer = [];
document.addEventListener("keydown", function(event) {
    key_event_buffer.push(event)
});

document.addEventListener("keyup", function(event) {
    key_event_buffer.push(event)
});

// Main variables

display_debug_info = true

debug_simulate_lag = false
debug_wireframe = true 

// debug_display = ["fps", "control_left", "control_right", "control_jump"]
debug_display = ["fps", "total_lag_frames", "debug_simulate_lag", "", "control_left", "control_right", "control_jump", "", "control_left_this_frame", "control_right_this_frame", "control_jump_this_frame", "", "player_on_ground"]

main_exec_lock = false;
main_loop_sleep = 0;
total_lag_frames = 0;
fps_frame_counter = 0;
fps = 0;

start_time = Date.now();
timescale = 60 / 1000

stress_test = false;
stress_loops = 999999;
stress_random = false;

control_left = false;
control_right = false;
control_jump = false;

rect_x = 0;
rect_y = 0;

rect_h = 100;
rect_w = 100;

rect_x_vel = 0;
rect_y_vel = 0;

touch_events_history = []
key_event_history = []


// Main loop

function main_exec_loop() {
    let now = Date.now()
    delta_time = Date.now() - start_time
    start_time = now

    if (canvas_fullscreen_dynamic_res) {
        // canvas_width = window.screen.availWidth;
        // canvas_height = window.screen.availHeight;

        canvas_width = window.innerWidth;
        canvas_height = window.innerHeight;

        canvas.width = canvas_width;
        canvas.height = canvas_height;
    }

    ctx.fillStyle = "LightGray";
    ctx.fillRect(0, 0, canvas_width, canvas_height);


    touch_events_history = touch_events_history.concat(touch_events_buffer)
    key_event_history = key_event_history.concat(key_event_buffer)


    // Process touch_events_buffer

    ctx.font = "16px Arial";
    ctx.fillStyle = "Gray";
    ctx.textAlign = "center";
    ctx.fillText("Welcome to Bones \"Alpha\" v0.0.2!", canvas_width / 2, 20)

    for (let i = 0; i < touch_events_history.length; i++) {
        let event_ = touch_events_history[i]
        for (let j = 0; j < event_.touches.length; j++) {
            let touch = event_.touches[j]
            let canvas_position = canvas.getBoundingClientRect();
            let touch_x = touch.clientX - canvas_position.left;
            let touch_y = touch.clientY - canvas_position.top;
            ctx.fillText(event_.type + "\n" + touch.identifier, touch_x, touch_y)
        }
    }


    // Process key events

    // control_left = false;
    // control_right = false;
    // control_jump = false;

    control_left_this_frame = false
    control_right_this_frame = false
    control_jump_this_frame = false

    for (let i = 0; i < key_event_buffer.length; i++) {
        let event_ = key_event_buffer[i]
        if (event_.type = "keydown") {
            if (event_.key == "a") {
                control_left = true;
                control_left_this_frame = true;
            }
            if (event_.key == "d") {
                control_right = true;
                control_right_this_frame = true;
            }
            if (event_.key == " ") {
                console.log("press space")
                control_jump = true;
                control_jump_this_frame = true;
            }
        }
        if (event_.type == "keyup") {
            if (event_.key == "a") {
                control_left = false;
            }
            if (event_.key == "d") {
                control_right = false;
            }
            if (event_.key == " ") {
                control_jump = false;
                console.log(event_)
                console.log("release space")
            }
        }
    }


    // Player physics

    move_left = control_left || control_left_this_frame;
    move_right = control_right || control_right_this_frame;
    move_jump = control_jump || control_jump_this_frame;

    control_player(control_left, control_right, control_jump)
    move_player()

	Matter.Engine.update(engine, delta=delta_time)


    // Ball physics

    rect_x += rect_x_vel * delta_time * timescale
    rect_y += rect_y_vel * delta_time * timescale

	/* For top down mode:
    rect_y_vel = rect_y_vel / 2;
    rect_x_vel = rect_x_vel / 2; */

    if (rect_x < 0 - rect_w) {
        rect_x = canvas_width;
    }
    if (rect_y < 0) {
        rect_y = 0
        rect_y_vel = 0 - rect_y_vel
        if (rect_y_vel > 0) {
            rect_y_vel = 0;
        }
    }
    if (rect_x > canvas_width) {
        rect_x = -25;
    }
    if (rect_y > canvas_height - rect_h) {
        rect_x_vel = rect_x_vel * 0.7
        rect_y = canvas_height - rect_h;
        rect_y_vel = 0 - rect_y_vel * 0.7
        if (rect_y_vel > 0) {
            rect_y_vel = 0;
        }
    }


    if (rect_y_vel <= 1 && rect_y_vel >= -1 &&
        rect_x_vel <= 1 && rect_x_vel >= -1) {
        rect_y_vel = Math.floor(Math.random() * 100) - 50
        rect_x_vel = Math.floor(Math.random() * 100) - 50
    }
    rect_y_vel++;

    // ctx.fillStyle = "Gray";
    // ctx.fillRect(rect_x, rect_y, rect_w, rect_h);

	test_block.draw()
	test_block2.draw()
	ground.draw()

	if (debug_wireframe == true) {
		var bodies = Matter.Composite.allBodies(engine.world)

		ctx.save()

		ctx.beginPath();

		for (var i = 0; i < bodies.length; i++) {
			var vertices = bodies[i].vertices;

			ctx.moveTo(vertices[0].x, vertices[0].y);

			for (var j = 1; j < vertices.length; j += 1) {
				ctx.lineTo(vertices[j].x, vertices[j].y);
			}

			ctx.lineTo(vertices[0].x, vertices[0].y);
		}

		ctx.lineWidth = 1;
		ctx.strokeStyle = '#999';
		ctx.stroke();

		ctx.restore()
	}

    draw_player()
    ctx.drawImage(ball, rect_x, rect_y, rect_w, rect_h)

    if (display_debug_info == true) {
        ctx.font = "14px Arial";
        ctx.fillStyle = "Gray"
        ctx.textAlign = "left";
        /* ctx.fillText("canvas_width", 10, 50)
        ctx.fillText(canvas_width, 175, 50)
        ctx.fillText("canvas_height", 10, 65)
        ctx.fillText(canvas_height, 175, 65)

        ctx.fillText("main_loop_sleep", 10, 95)
        ctx.fillText(main_loop_sleep, 175, 95)
        ctx.fillText("total_lag_frames", 10, 110)
        ctx.fillText(total_lag_frames, 175, 110)

        ctx.fillText("fps", 10, 140)
        ctx.fillText(fps, 175, 140) */

        for (let i = 0; i < debug_display.length; i++) {
            if (debug_display[i] != "") {
                ctx.fillText(debug_display[i], 10, 50 + i * 15)
                ctx.fillText(eval(debug_display[i]), 175, 50 + i * 15)
            }
        }
    }

    if (stress_test == true) {
        rand = 1
        if (stress_random) {
            rand = Math.random() * stress_loops;
        }
        for (i = 0; i < stress_loops * rand; i++) {
            ctx.fillText("", 0, 0)
        }
    }

    touch_events_buffer = []
    key_event_buffer = []

    fps_frame_counter++;
}


// Loop launcher

function launch_loop() {
    if (main_exec_lock == true) {
        total_lag_frames++;
        reset_setInterval();
        return false;
    }
    main_exec_lock = true;
    main_exec_loop();
    main_exec_lock = false;

	if (debug_simulate_lag == false) {
    	requestAnimationFrame(launch_loop)
	}
	if (debug_simulate_lag == true) {
		setTimeout(launch_loop, Math.floor(Math.random() * 100) + 2)
	}
    return true;
}

function calculate_fps() {
    fps = fps_frame_counter
    fps_frame_counter = 0
}

test_block = new physics_object("square", {x:400, y:200, w:80, h:80})
test_block2 = new physics_object("square", {x:450, y:50, w:80, h:20})
ground = new physics_object("square", {x:400, y:610, w:810, h:60}, anchored=true)

window.onload = function() {
    launch_loop()
    setInterval(calculate_fps, 1000)
}
