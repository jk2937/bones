class MenuItem {
    constructor(x, y, width, height, text, on_activate_function) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.on_activate_function = on_activate_function;
    }
    render() {
     Bones.Renderer.context.fillStyle = "Gray";
            Bones.Renderer.context.fillRect(this.x-1, this.y-1, this.width+2, this.height+2);

   Bones.Renderer.context.fillStyle = "white";
            Bones.Renderer.context.fillRect(this.x, this.y, this.width, this.height);

 
        Bones.Renderer.context.font = "18px Monospace";
        Bones.Renderer.context.fillStyle = "Gray";
        Bones.Renderer.context.textAlign = "center";
        Bones.Renderer.context.fillText(this.text, this.x + this.width / 2, this.y + 20)

    }
    read_input() {
        if (Bones.Input.mouse_click_this_frame == true 
        && Bones.Input.mouse_x > this.x && Bones.Input.mouse_x < this.x + this.width
        && Bones.Input.mouse_y > this.y && Bones.Input.mouse_y < this.y + this.height) {
            this.on_activate_function()
        }
    }
}
