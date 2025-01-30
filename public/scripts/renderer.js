Bones.Renderer = {
    init: function() {

        this.width = 1280
        this.height = 720
		
		if (isServer == false) {
			this.canvas = document.getElementById("myCanvas");
			this.context = this.canvas.getContext("2d");

			this.canvas.style.border = "none";

			this.display_mode = "stretched_fullscreen_ratio"; 
			this.canvas.style.cursor = "none";

			this.set_display_mode()
		}

        this.camera_x = 0;
        this.camera_y = 0;
        this.zoom = 0;
        this.camera_bounds_left;
        this.camera_bounds_right
        this.camera_bounds_top
        this.camera_bounds_bottom


    }, // END FUNCTION init

    set_display_mode: function(mode=this.display_mode, width=this.width, height=this.height) {
        if (mode != "embedded" && mode != "dynamic_fullscreen" && mode != "stretched_fullscreen" && mode != "stretched_fullscreen_ratio") {
            console.log("Warning: No such screen mode: \"" + mode + "\". Please use \"embedded\", \"stretched_fullscreen\", \"dynamic_fullscreen\", or \"stretched_fullscreen_ratio\".");
            return false;
        }

        this.display_mode = mode

        this.width = width;
        this.height = height;

        if (mode == "embedded") {
            // Disable stretching
            this.canvas.style.width = '';
            this.canvas.style.height = '';

            // Set the canvas resolution to fixed values
            this.canvas.width = this.width;
            this.canvas.height = this.height;

            // Set the canvas position with page elements
            this.canvas.style.position = "relative";
            this.canvas.style.left = "";
            this.canvas.style.top = "";
       }

        if (mode == "dynamic_fullscreen") {
             // Disable stretching
            this.canvas.style.width = '';
            this.canvas.style.height = '';

            // Get resolution from window size
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            // Set the canvas resolution
            this.canvas.width = this.width;
            this.canvas.height = this.height

            // Set canvas position to corner of page
            this.canvas.style.position = "absolute";
            this.canvas.style.left = "0px";
            this.canvas.style.top = "0px";
        }

        if (mode == "stretched_fullscreen") {
            // Stretch canvas to 100% of window
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';

            // Set the canvas resolution
            this.canvas.width = this.width;
            this.canvas.height = this.height

            // Set canvas position to corner of page
            this.canvas.style.position = "absolute";
            this.canvas.style.left = "0px";
            this.canvas.style.top = "0px";
        }

        if (mode == "stretched_fullscreen_ratio") {
              // Set the canvas resolution
            this.canvas.width = this.width;
            this.canvas.height = this.height

         if (window.innerWidth * this.height > window.innerHeight * this.width) {
            // Disable horizontal stretching, stretch canvas vertically to 100% of window
            this.canvas.style.width = "";
            this.canvas.style.height = "100%";

            // Center canvas horizonally, set canvas vertical position to top of window
            this.canvas.style.position = "absolute";
            this.canvas.style.left = String(window.innerWidth / 2 - this.canvas.offsetWidth / 2) + "px";
            this.canvas.style.top= "0px";
        } 

        if (window.innerHeight * this.width > window.innerWidth * this.height) {
            // Strech canvas horizontally to 100% of window, disable vertical streching
            this.canvas.style.width = "100%";
            this.canvas.style.height = "";

            // Set canvas horizontal position to left of window, center canvas vertically
            this.canvas.style.position = "absolute";
            this.canvas.style.left = "0px";
            this.canvas.style.top = String(window.innerHeight / 2 - this.canvas.offsetHeight / 2) + "px";

        }
       }
            
        return true;
    }, // END FUNCTION set_display_mode

    refresh_display: function() {
        if (this.display_mode == "dynamic_fullscreen") {
        // Update variables
         this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Update canvas resolution
        this.canvas.width = this.width;
        this.canvas.height = this.height   
        }
        if (this.display_mode == "stretched_fullscreen_ratio") {
         if (window.innerWidth * this.height > window.innerHeight * this.width) {
            // Disable canvas horizontal stretching, set vertical stretching to 100% of window
            this.canvas.style.width = "";
            this.canvas.style.height = "100%";

            // Center canvas horizontally, set vertical position to top of window
            this.canvas.style.left = String(window.innerWidth / 2 - this.canvas.offsetWidth / 2) + "px";
            this.canvas.style.top= "0px";
        } 

        if (window.innerHeight * this.width > window.innerWidth * this.height) {
            // Set canvas horizontal stretching to 100% of window, disable vertical stretching
            this.canvas.style.width = "100%";
            this.canvas.style.height = "";

            // Set canvas horizontal position to left of window, center vertically
            this.canvas.style.left = "0px";
            this.canvas.style.top = String(window.innerHeight / 2 - this.canvas.offsetHeight / 2) + "px";
            
        }
        }

    } // END FUNCTION refresh_display

}
Bones.Renderer.init()
