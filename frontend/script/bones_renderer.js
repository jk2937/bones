Bones.Renderer = new Object();

Bones.Renderer.canvas = document.getElementById("myCanvas");
Bones.Renderer.context = Bones.Renderer.canvas.getContext("2d");

Bones.Renderer.canvas.style.border = "none";

Bones.Renderer.display_mode = "stretched_fullscreen_ratio"; 

Bones.Renderer.width = 1280
Bones.Renderer.height = 720

Bones.Renderer.set_display_mode = function(mode=Bones.Renderer.display_mode, width=Bones.Renderer.width, height=Bones.Renderer.height) {
    if (mode != "embedded" && mode != "dynamic_fullscreen" && mode != "stretched_fullscreen" && mode != "stretched_fullscreen_ratio") {
        console.log("Warning: No such screen mode: \"" + mode + "\". Please use \"embedded\", \"stretched_fullscreen\", \"dynamic_fullscreen\", or \"stretched_fullscreen_ratio\".");
        return false;
    }

    Bones.Renderer.display_mode = mode

    Bones.Renderer.width = width;
    Bones.Renderer.height = height;

    if (mode == "embedded") {
        // Disable stretching
        Bones.Renderer.canvas.style.width = '';
        Bones.Renderer.canvas.style.height = '';

        // Set the canvas resolution to fixed values
        Bones.Renderer.canvas.width = Bones.Renderer.width;
        Bones.Renderer.canvas.height = Bones.Renderer.height;

        // Set the canvas position with page elements
        Bones.Renderer.canvas.style.position = "relative";
        Bones.Renderer.canvas.style.left = "";
        Bones.Renderer.canvas.style.top = "";
   }

    if (mode == "dynamic_fullscreen") {
         // Disable stretching
        Bones.Renderer.canvas.style.width = '';
        Bones.Renderer.canvas.style.height = '';

        // Get resolution from window size
        Bones.Renderer.width = window.innerWidth;
        Bones.Renderer.height = window.innerHeight;

        // Set the canvas resolution
        Bones.Renderer.canvas.width = Bones.Renderer.width;
        Bones.Renderer.canvas.height = Bones.Renderer.height

        // Set canvas position to corner of page
        Bones.Renderer.canvas.style.position = "absolute";
        Bones.Renderer.canvas.style.left = "0px";
        Bones.Renderer.canvas.style.top = "0px";
    }

    if (mode == "stretched_fullscreen") {
        // Stretch canvas to 100% of window
        Bones.Renderer.canvas.style.width = '100%';
        Bones.Renderer.canvas.style.height = '100%';

        // Set the canvas resolution
        Bones.Renderer.canvas.width = Bones.Renderer.width;
        Bones.Renderer.canvas.height = Bones.Renderer.height

        // Set canvas position to corner of page
        Bones.Renderer.canvas.style.position = "absolute";
        Bones.Renderer.canvas.style.left = "0px";
        Bones.Renderer.canvas.style.top = "0px";
    }

    if (mode == "stretched_fullscreen_ratio") {
          // Set the canvas resolution
        Bones.Renderer.canvas.width = Bones.Renderer.width;
        Bones.Renderer.canvas.height = Bones.Renderer.height

     if (window.innerWidth * Bones.Renderer.height > window.innerHeight * Bones.Renderer.width) {
        // Disable horizontal stretching, stretch canvas vertically to 100% of window
        Bones.Renderer.canvas.style.width = "";
        Bones.Renderer.canvas.style.height = "100%";

        // Center canvas horizonally, set canvas vertical position to top of window
        Bones.Renderer.canvas.style.position = "absolute";
        Bones.Renderer.canvas.style.left = String(window.innerWidth / 2 - Bones.Renderer.canvas.offsetWidth / 2) + "px";
        Bones.Renderer.canvas.style.top= "0px";
    } 

    if (window.innerHeight * Bones.Renderer.width > window.innerWidth * Bones.Renderer.height) {
        // Strech canvas horizontally to 100% of window, disable vertical streching
        Bones.Renderer.canvas.style.width = "100%";
        Bones.Renderer.canvas.style.height = "";

        // Set canvas horizontal position to left of window, center canvas vertically
        Bones.Renderer.canvas.style.position = "absolute";
        Bones.Renderer.canvas.style.left = "0px";
        Bones.Renderer.canvas.style.top = String(window.innerHeight / 2 - Bones.Renderer.canvas.offsetHeight / 2) + "px";

    }
   }
        
    return true;
}

Bones.Renderer.refresh_display = function() {
    if (Bones.Renderer.display_mode == "dynamic_fullscreen") {
    // Update variables
     Bones.Renderer.width = window.innerWidth;
    Bones.Renderer.height = window.innerHeight;

    // Update canvas resolution
    Bones.Renderer.canvas.width = Bones.Renderer.width;
    Bones.Renderer.canvas.height = Bones.Renderer.height   
    }
    if (Bones.Renderer.display_mode == "stretched_fullscreen_ratio") {
     if (window.innerWidth * Bones.Renderer.height > window.innerHeight * Bones.Renderer.width) {
        // Disable canvas horizontal stretching, set vertical stretching to 100% of window
        Bones.Renderer.canvas.style.width = "";
        Bones.Renderer.canvas.style.height = "100%";

        // Center canvas horizontally, set vertical position to top of window
        Bones.Renderer.canvas.style.left = String(window.innerWidth / 2 - Bones.Renderer.canvas.offsetWidth / 2) + "px";
        Bones.Renderer.canvas.style.top= "0px";
    } 

    if (window.innerHeight * Bones.Renderer.width > window.innerWidth * Bones.Renderer.height) {
        // Set canvas horizontal stretching to 100% of window, disable vertical stretching
        Bones.Renderer.canvas.style.width = "100%";
        Bones.Renderer.canvas.style.height = "";

        // Set canvas horizontal position to left of window, center vertically
        Bones.Renderer.canvas.style.left = "0px";
        Bones.Renderer.canvas.style.top = String(window.innerHeight / 2 - Bones.Renderer.canvas.offsetHeight / 2) + "px";
        
    }
    }

}

Bones.Renderer.set_display_mode()

Bones.Renderer.camera_x = 0;
Bones.Renderer.camera_y = 0;
Bones.Renderer.zoom = 0;
Bones.Renderer.camera_bounds_left;
Bones.Renderer.camera_bounds_right
Bones.Renderer.camera_bounds_top
Bones.Renderer.camera_bounds_bottom

