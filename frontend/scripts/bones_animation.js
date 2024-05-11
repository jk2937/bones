class Animation {
    constructor() {
        this.skins = [
            new Skin(Bones.Assets.gfx_balloon_sheet, 8, 13, 16, 39, 0, 0, 100, 200),
            new Skin(Bones.Assets.gfx_balloon_sheet, 30, 13, 16, 39, 0, 0, 100, 200),
            new Skin(Bones.Assets.gfx_balloon_sheet, 52, 13, 16, 39, 0, 0, 100, 200),
            new Skin(Bones.Assets.gfx_balloon_sheet, 74, 13, 16, 39, 0, 0, 100, 200),
        ]
        this.timer = 0
        this.frame_delay = 100
        this.loop = true
        this.x = 0
        this.y = 0
    }
    tick() {
        this.timer += Bones.Timer.delta_time * Bones.Timer.timescale
        if(this.loop == true && this.timer > this.skins.length * this.frame_delay) {
            this.timer -= this.skins.length * this.frame_delay
        }
    }
    render(x, y) {
        this.tick()
        console.log(this.timer)
        console.log(this.frame_delay)
        console.log(this.skins.length)
        console.log(Math.floor(this.timer / this.frame_delay * this.skins.length))
        let skin = Math.floor(this.timer / this.frame_delay * this.skins.length)
        console.log(this.skins.length)
        skin = skin % this.skins.length
        this.skins[skin].render(this.x + x, this.y + y)
    }
}
