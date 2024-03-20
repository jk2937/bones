class MenuItem {
    constructor(x, y, width, height, text, on_activate_function, on_deactivate_function, mode="default") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.on_activate_function = on_activate_function;
        this.mode = mode
        if (this.mode == "toggle") {
            this.on_deactivate_function = on_deactivate_function;
            this.activated = false
        }
    }
    render() {
     Bones.Renderer.context.fillStyle = "Gray";
            Bones.Renderer.context.fillRect(this.x-1, this.y-1, this.width+2, this.height+2);

        if (this.mode == "toggle") {
            if (this.activated == true) {
                Bones.Renderer.context.fillStyle = "MediumSeaGreen";
            } else {
                Bones.Renderer.context.fillStyle = "Tomato";
            }
        }
        else if (this.mode != "toggle") {
            Bones.Renderer.context.fillStyle = "white";
        }

        Bones.Renderer.context.fillRect(this.x, this.y, this.width, this.height);

        Bones.Renderer.context.font = "18px Monospace";
        if (this.mode == "toggle") {
            Bones.Renderer.context.fillStyle = "White";
        }
        else if (this.mode != "toggle") {
            Bones.Renderer.context.fillStyle = "Gray";
        }
        Bones.Renderer.context.textAlign = "center";
        Bones.Renderer.context.fillText(this.text, this.x + this.width / 2, this.y + 20)

    }
    read_input() {
        if (
                (
                    Bones.Input.Mouse.ControlStates.click_this_frame == true 
                    && Bones.Input.Mouse.ControlStates.x > this.x && Bones.Input.Mouse.ControlStates.x < this.x + this.width
                    && Bones.Input.Mouse.ControlStates.y > this.y && Bones.Input.Mouse.ControlStates.y < this.y + this.height
                )
                || (
                    Bones.Input.Touch.ControlStates.click_this_frame == true 
                    && Bones.Input.Touch.ControlStates.x > this.x && Bones.Input.Touch.ControlStates.x < this.x + this.width
                    && Bones.Input.Touch.ControlStates.y > this.y && Bones.Input.Touch.ControlStates.y < this.y + this.height
                )
            ) {
            if (this.mode != "toggle") {
                this.on_activate_function()
            }
            if (this.mode == "toggle") {
                if (this.activated == true) {
                    this.on_deactivate_function()
                    this.activated = false
                }
                else if (this.activated == false) {
                    this.on_activate_function()
                    this.activated = true
                }
            }
        }
    }
}
