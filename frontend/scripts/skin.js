class Skin {
    constructor() {
        this.sx = 8
        this.sy = 13
        this.sw = 16
        this.sh = 39

        this.dw = 100
        this.dh = 200

        this.static_image = Bones.Assets.gfx_balloon_sheet
    }
    render(x, y) {
        Bones.Renderer.context.drawImage(this.static_image, this.sx, this.sy, this.sw, this.sh, x - Bones.Renderer.camera_x, y - Bones.Renderer.camera_y, this.dw, this.dh)
    }
}
