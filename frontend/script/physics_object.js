class physics_object {
	constructor() {
		this.x = 0;
		this.y = 0

		this.angle = 0;

		this.w = 0;
		this.h = 0;

		this.r = 0;

		this.shape = "square";

		this.anchored = false;

		if (this.shape == "square") {
			this.body = Matter.Bodies.rectangle(this.x, this.y, this.w, this.h)
		}
		if (this.shape == "circle") {

		}
	}
	move(delta_time) {
	}
	draw() {
		this.pos = this.body.position;
		this.angle = this.body.angle;
		this.x = this.pos.x;
		this.y = this.pos.y;
		ctx.save()
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		ctx.fillStyle = "white";
		if (this.shape == "square") {
			ctx.fillRect(0, 0, this.w, this.h);
		}
		if (this.shape == "circle") {

		}
		ctx.restore()
		//ctx.fillRect(this.x, this.y, this.w, this.h);
		//console.log([this.x, this.y, this.w, this.h])
	}
}
