class Skin {
    constructor(static_image, sx, sy, sw, sh, dx, dy, dw, dh) {
        this.sx = sx
        this.sy = sy
        this.sw = sw
        this.sh = sh

        this.dx = dx
        this.dy = dy
        this.dw = dw
        this.dh = dh

        this.static_image = Bones.Assets.gfx_balloon_sheet
    }
    render(x, y) {
        Bones.Renderer.context.drawImage(this.static_image, this.sx, this.sy, this.sw, this.sh, this.dx + x, this.dy + y, this.dw, this.dh)
    }
}
