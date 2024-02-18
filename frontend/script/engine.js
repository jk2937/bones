class Engine {
    constructor(auto_init=true) {
        if (auto_init) {
            this.init()
        }
    }
    init() {
        // todo: create resource pack object
        this.gfx_player = new Image();
        this.gfx_player.src = "../assets/asset2.png"
        // Canvas properties

        // todo: create renderer object
        this.canvas = document.getElementById("myCanvas");
        this.ctx = canvas.getContext("2d");

        this.gfx_ball = new Image();
        this.gfx_ball.src = "../assets/asset1.png"

        this.renderer_width = 500;
        this.renderer_height = 500;

        this.renderer_fullscreen = false;
        this.renderer_fullscreen_dynamic_res = true;

        this.canvas.width = this.renderer_width;
        this.canvas.height = this.renderer_height;

        if (renderer_fullscreen_dynamic_res) {
            // this.canvas.style.width = '100%';
            // this.canvas.style.height = '100%';
            this.canvas.style.position = "absolute";
            this.canvas.style.left = "0px";
            this.canvas.style.top = "0px";
            this.canvas.style.border = "none";
        }


        // Touch events

        this.cursor_activated = false;
        this.cursor_x = 0;
        this.cursor_y = 0;
        this.cursor_old_x = 0;
        this.cursor_old_y = 0;
        this.touch_events_buffer = [];

        this.canvas.addEventListener("touchstart", function(e) {
            e.preventDefault()
            console.log(e)
            touch_events_buffer.push(e)
        }, false);

        this.canvas.addEventListener("touchend", function(e) {
            e.preventDefault()
            console.log(e)
            touch_events_buffer.push(e)
            // cursor_activated = false;
        }, false);

        this.canvas.addEventListener("touchmove", function(e) {
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

        this.key_event_buffer = [];
        document.addEventListener("keydown", function(event) {
            key_event_buffer.push(event)
        });

        document.addEventListener("keyup", function(event) {
            key_event_buffer.push(event)
        });
        this.main_exec_lock = false;
        this.main_loop_sleep = 0;
        this.total_lag_frames = 0;
        this.fps_frame_counter = 0;
        this.fps = 0;

        this.start_time = Date.now();
        this.timescale = 60 / 1000

        this.local_control_left = false;
        this.local_control_right = false;
        this.local_control_jump = false;

        this.touch_events_history = []
        this.key_event_history = []



        import * as world from "world.js";
        this.world1 = new World()

        this.start()
    } // END FUNCTION init
    function start() {
        setInterval(this.calculate_fps, 1000)
        this.run()
    }
    function run() {
        // BEGIN execution lock code 
        if (this.main_exec_lock == true) {
            this.total_lag_frames++;
            return false;
        }
        this.main_exec_lock = true;
        // END executio lock code
        // update delta_time
        // todo: remove unneeded variable
        this.now = Date.now()
        this.delta_time = Date.now() - this.start_time
        this.start_time = this.now
        if (this.delta_time > 100) {
            this.total_lag_frames++;
            this.delta_time = 100;
        }

        // update canvas resolution
        if (this.renderer_fullscreen_dynamic_res) {
            // canvas_width = window.screen.availWidth;
            // canvas_height = window.screen.availHeight;

            this.renderer_width = window.innerWidth;
            this.renderer_height = window.innerHeight;

            this.canvas.width = this.renderer_width;
            this.canvas.height = this.renderer_height;
        }

        // clear canvas
        this.ctx.fillStyle = "LightGray";
        this.ctx.fillRect(0, 0, renderer_width, renderer_height);

        // add events to history objects
        this.touch_events_history = this.touch_events_history.concat(this.touch_events_buffer)
        this.key_event_history = this.key_event_history.concat(this.key_event_buffer)

        // todo: move control code to player object
        // tick world
        this.world1.tick();

        // empty event pools
        this.touch_events_buffer = []
        this.key_event_buffer = []

        this.fps_frame_counter++;

        this.main_exec_lock = false;
        /* BEGIN ENGINE 
            if (debug_simulate_lag == false) { i*/
        requestAnimationFrame(this.run)
        /* BEGIN ENGINE
            }
            if (debug_simulate_lag == true) {
                setTimeout(launch_loop, Math.floor(Math.random() * debug_simulated_lag_range))
            } */
    } // END FUNCTION run
    function calculate_fps() {
        this.fps = this.fps_frame_counter
        this.fps_frame_counter = 0
    }
}