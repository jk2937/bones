function circle_collision(p1x, p1y, r1, p2x, p2y, r2) {
  var a;
  var x;
  var y;

  a = r1 + r2;
  x = p1x - p2x;
  y = p1y - p2y;

  if (a > Math.sqrt((x * x) + (y * y))) {
	return true;
  } else {
	return false;
  }
}
function seeded_random(seed) {
	let state = seed;
	state = (1103515245 * state + 12345) % 2**31;
    return state / 2**31;
}
function removeXComponent(angle, magnitude) {
    // Convert the angle to radians
    let angleInRadians = angle * Math.PI / 180;

    // Convert the vector to Cartesian coordinates
    let x = magnitude * Math.cos(angleInRadians);
    let y = magnitude * Math.sin(angleInRadians);

    // Remove the x component
    x = 0;

    // Convert the vector back to polar coordinates
    let newMagnitude = Math.sqrt(x * x + y * y);
    let newAngleInRadians = Math.atan2(y, x);

    // Convert the new angle back to degrees
    let newAngle = newAngleInRadians * 180 / Math.PI;

    // If the new magnitude is 0, set the new angle to 0
    if (newMagnitude === 0) {
        newAngle = 0;
    }

    // Return the new angle and magnitude
    return [newAngle, newMagnitude];
}
function removeYComponent(angle, magnitude) {
    // Convert the angle to radians
    let angleInRadians = angle * Math.PI / 180;

    // Convert the vector to Cartesian coordinates
    let x = magnitude * Math.cos(angleInRadians);
    let y = magnitude * Math.sin(angleInRadians);

    // Remove the y component
    y = 0;

    // Convert the vector back to polar coordinates
    let newMagnitude = Math.sqrt(x * x + y * y);
    let newAngleInRadians = Math.atan2(y, x);

    // Convert the new angle back to degrees
    let newAngle = newAngleInRadians * 180 / Math.PI;

    // If the new magnitude is 0, set the new angle to 0
    if (newMagnitude === 0) {
        newAngle = 0;
    }

    // Return the new angle and magnitude
    return [newAngle, newMagnitude];
}
function circleBoxCollision(x1, y1, w, h, x2, y2, r) {
  // Find the closest point to the circle within the box
  let closestX = Math.max(x1, Math.min(x2, x1 + w));
  let closestY = Math.max(y1, Math.min(y2, y1 + h));

  // Calculate the distance between the circle and the closest point
  let distanceX = x2 - closestX;
  let distanceY = y2 - closestY;

  // If the distance is less than or equal to the radius, there's a collision
  if (distanceX * distanceX + distanceY * distanceY <= r * r) {
    return true;
  }

  return false;
}
function addForceToVector(angle, magnitude, targetAngle, targetMagnitude, rotationSpeed = 0.1, acceleration = 0.1) {
    // Convert the angles to radians
    angle = angle * Math.PI / 180;
    targetAngle = targetAngle * Math.PI / 180;

    // Calculate the difference between the target angle and the current angle
    let angleDiff = targetAngle - angle;

    // Normalize the angle difference to be between -π and π
    if (angleDiff > Math.PI) {
        angleDiff -= 2 * Math.PI;
    } else if (angleDiff < -Math.PI) {
        angleDiff += 2 * Math.PI;
    }

    // Update the angle
    let newAngle = angle + Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), rotationSpeed);

    // Update the magnitude
    let magnitudeDiff = targetMagnitude - magnitude;
    let newMagnitude = magnitude + Math.min(Math.max(magnitudeDiff, -acceleration), acceleration);

    // Return the new angle and magnitude
    return [newAngle * 180 / Math.PI, newMagnitude];
}
Bones.World = {
    init() {

		this.players = []
        //this.players.push(new this.Player())
		
		this.controllers = []
		this.bullets = []
		this.walls = []
		
		/*
		this.walls.push(new this.Wall(92 * 2, 153 * 2, 45 * 2, 58 * 2))
		this.walls.push(new this.Wall(313 * 2, 158 * 2, 49 * 2, 43 * 2))
		this.walls.push(new this.Wall(211 * 2, 310 * 2, 38 * 2, 54 * 2))
		this.walls.push(new this.Wall(94 * 2, 432 * 2, 57 * 2, 51 * 2))
		this.walls.push(new this.Wall(301 * 2, 436 * 2, 63 * 2, 48 * 2))
		this.walls.push(new this.Wall(475 * 2, 0 * 2, 50 * 2, 194 * 2))
		this.walls.push(new this.Wall(596 * 2, 169 * 2, 403 * 2, 30 * 2))
		this.walls.push(new this.Wall(478 * 2, 445 * 2, 47 * 2, 557 * 2))
		this.walls.push(new this.Wall(625 * 2, 574 * 2, 246 * 2, 30 * 2))
		this.walls.push(new this.Wall(729 * 2, 603 * 2, 31 * 2, 230 * 2))
		this.walls.push(new this.Wall(629 * 2, 832 * 2, 237 * 2, 36 * 2))
		*/

        this.menu_items = []
        /*this.create_menu_item(Bones.Renderer.width - 280, 50, 250, 300, "Menu", function() {})
        this.create_menu_item(Bones.Renderer.width - 280 + 5, 50 + 45, 250 - 10, 30, "Reset", function() { Bones.World.init() })
        this.create_menu_item(Bones.Renderer.width - 280 + 5, 50 + 40 * 2, 250 - 10, 30, "Add Physics Object", function() { Bones.World.npcs.push(new Bones.World.NPC()) })
*/
        // this.create_menu_item(Bones.Renderer.width - 280 + 5, 50 + 40 * 3, 250 - 10, 30, "Camera Mode", function() { Bones.DebugDisplay.test_camera = true }, function() { Bones.DebugDisplay.test_camera = false }, "toggle")

        //npc init

        this.npcs = []
		
		this.map_select = 0
		this.num_maps = 2
		
		this.winner = -1;
		this.win_timer = 0;
		this.win_score = 10;
        /*this.npcs.push(new this.NPC())*/
		
		this.load_map()

		this.colors = [
			//'AliceBlue',
			//'AntiqueWhite',
			//'Aqua',
			//'Aquamarine',
			//'Azure',
			//'Beige',
			//'Bisque',
			//'Black',
			//'BlanchedAlmond',
			'Blue',
			'Crimson',
			'BlueViolet',
			'DarkGreen',
			'GoldenRod',
			//'BurlyWood',
			//'CadetBlue',
			//'Chartreuse',
			//'Chocolate',
			//'Coral',
			//'CornflowerBlue',
			//'Cyan',
			'DarkBlue',
			'Brown',
			//'DarkCyan',
			//'DarkGoldenRod',
			//'DarkGray',
			//'DarkGrey',
			//'DarkKhaki',
			'DarkMagenta',
			//'DarkOliveGreen',
			//'DarkOrange',
			//'DarkOrchid',
			'DarkRed',
			//'DarkSalmon',
			//'DarkSeaGreen',
			'DarkSlateBlue',
			//'DarkSlateGray',
			//'DarkSlateGrey',
			//'DarkTurquoise',
			'DarkViolet',
			'DeepPink',
			//'DeepSkyBlue',
			//'DimGray',
			//'DimGrey',
			//'DodgerBlue',
			'FireBrick',
			//'FloralWhite',
			'ForestGreen',
			'Fuchsia',
			//'Gainsboro',
			//'GhostWhite',
			//'Gold',
			//'Gray',
			//'Grey',
			'Green',
			//'GreenYellow',
			//'HoneyDew',
			'HotPink',
			'IndianRed',
			'Indigo',
			//Ivory',
			//'Khaki',
			//'Lavender',
			//'LavenderBlush',
			//'LawnGreen',
			//'LemonChiffon',
			//'LightBlue',
			//'LightCoral',
			//'LightCyan',
			//'LightGoldenRodYellow',
			//'LightGray',
			//'LightGrey',
			//'LightGreen',
			//'LightPink',
			//'LightSalmon',
			//'LightSeaGreen',
			//'LightSkyBlue',
			//'LightSlateGray',
			//'LightSlateGrey',
			//'LightSteelBlue',
			//'LightYellow',
			//'Lime',
			//'LimeGreen',
			//'Linen',
			'Magenta',
			'Maroon',
			//'MediumAquaMarine',
			'MediumBlue',
			//'MediumOrchid',
			//'MediumPurple',
			//'MediumSeaGreen',
			//'MediumSlateBlue',
			//'MediumSpringGreen',
			//'MediumTurquoise',
			'MediumVioletRed',
			'MidnightBlue',
			//'MintCream',
			//'MistyRose',
			//'Moccasin',
			//'NavajoWhite',
			//'Navy',
			//'OldLace',
			//'Olive',
			//'OliveDrab',
			//'Orange',
			'OrangeRed',
			//'Orchid',
			//'PaleGoldenRod',
			//'PaleGreen',
			//'PaleTurquoise',
			//'PaleVioletRed',
			//'PapayaWhip',
			//'PeachPuff',
			//'Peru',
			//'Pink',
			//'Plum',
			//'PowderBlue',
			'Purple',
			//'RebeccaPurple',
			'Red',
			//'RosyBrown',
			//'RoyalBlue',
			//'SaddleBrown',
			//'Salmon',
			//'SandyBrown',
			//'SeaGreen',
			//'SeaShell',
			'Sienna',
			//'Silver',
			//'SkyBlue',
			//'SlateBlue',
			//'SlateGray',
			//'SlateGrey',
			//'Snow',
			//'SpringGreen',
			//'SteelBlue',
			//'Tan',
			'Teal',
			//'Thistle',
			//'Tomato',
			//'Turquoise',
			//'Violet',
			//'Wheat',
			//'White',
			//'WhiteSmoke',
			//'Yellow',
			//'YellowGreen',
		]
    }, // END FUNCTION init
	load_map() {
		if(this.map_select == 0){
			this.width = 2000
			this.height = 2000
			this.tilemap = [
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
				[0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
				[0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
			]
			this.walls = []
			for (let y = 0; y < this.tilemap.length; y++) {
				for (let x = 0; x < this.tilemap[y].length; x++) {
					if (this.tilemap[y][x] == 1) {
						this.walls.push(new this.Wall(this.width / this.tilemap[0].length * x, this.height / this.tilemap.length * y, this.width / this.tilemap[0].length, this.height / this.tilemap.length))
					}
				}
			}
		} else {
			this.width = 3000
			this.height = 800
			this.tilemap = [
				[0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
				[0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
				[0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
			]
			this.walls = []
			for (let y = 0; y < this.tilemap.length; y++) {
				for (let x = 0; x < this.tilemap[y].length; x++) {
					if (this.tilemap[y][x] == 1) {
						this.walls.push(new this.Wall(this.width / this.tilemap[0].length * x, this.height / this.tilemap.length * y, this.width / this.tilemap[0].length, this.height / this.tilemap.length))
					}
				}
			}
		}
	},
    tick() {
		if (isServer == false) {
			Bones.DebugDisplay.render()
			Bones.Input.process_buffers()
		}
		
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].active == false) {
				this.players.splice(i, 1)
				console.log('player deactivated')
			}
		}
		
		if(this.winner == -1) {
			for (let i = 0; i < this.players.length; i++) {
				if(this.players[i].active == true && this.players[i].score >= this.win_score) {
					this.winner = this.players[i].id
				}
			}

			// Todo: Combine player code into Bones.Input.keys_read_controls, read all keystates with || keystate_this_frame

			if (Bones.DebugDisplay.test_camera == true) {
				if (Bones.Input.Keyboard.ControlStates["right"].pressed || Bones.Input.Keyboard.ControlStates["right"].pressed_this_frame) {
					Bones.Renderer.camera_x += 5 * Bones.Timer.delta_time * Bones.Timer.timescale
				}
				if (Bones.Input.Keyboard.ControlStates["left"].pressed || Bones.Input.Keyboard.ControlStates["left"].pressed_this_frame) {
					Bones.Renderer.camera_x -= 5 * Bones.Timer.delta_time * Bones.Timer.timescale
				} 
				if (Bones.Input.Keyboard.ControlStates["up"].pressed || Bones.Input.Keyboard.ControlStates["up"].pressed_this_frame) {
					Bones.Renderer.camera_y -= 5 * Bones.Timer.delta_time * Bones.Timer.timescale
				}
				if (Bones.Input.Keyboard.ControlStates["down"].pressed || Bones.Input.Keyboard.ControlStates["down"].pressed_this_frame) {
					Bones.Renderer.camera_y += 5 * Bones.Timer.delta_time * Bones.Timer.timescale
				} 
				//this.player1.tick()
			}

			if (Bones.DebugDisplay.debug_simple_player_movement == true) {
				if (move_right) {
					this.player1.x += 5 * Bones.Timer.delta_time * Bones.Timer.timescale
				}
				if (move_left) {
					this.player1.x -= 5 * Bones.Timer.delta_time * Bones.Timer.timescale
				}
			}
			
			if (Bones.DebugDisplay.test_simple_player_movement != true && Bones.DebugDisplay.test_camera != true) {
				
				if (isServer == false) {
					for (let i = 0; i < this.controllers.length; i++) {
						if(clientId == this.controllers[i].id){
							this.controllers[i].update()
						}
					}
				} 
				for (let i = 0; i < this.players.length; i++){
					for (let j = 0; j < this.controllers.length; j++) {
						if (this.controllers[j].id == this.players[i].id) {
							
							if (isServer || this.players[i].id == clientId) {
								this.players[i].read_keyboard_controls(
									this.controllers[j].left,
									this.controllers[j].right,
									this.controllers[j].up,
									this.controllers[j].down,
									this.controllers[j].aim,
									this.controllers[j].Shotgun,
									this.controllers[j].jump,
									this.controllers[j]._select,
								);
							}
						}
					}
				}
			}
			
			if (Bones.DebugDisplay.test_simple_player_movement != true && Bones.DebugDisplay.test_camera != true) {
				for (let i = 0; i < this.players.length; i++){
					this.players[i].tick(Bones.Timer.delta_time)
					if(!isServer && this.players[i].id == clientId && this.players[i].process_history){
						this.players[i].process_history = false
						let controller_object = null
						for (let j = 0; j < Bones.World.controllers.length; j++) {
							if (Bones.World.controllers[j].id == this.players[i].id) {
								controller_object = Bones.World.controllers[j]
							}
						}
						if(controller_object != null) {
						console.log('processing history')
							let total_calc_hist_time_delta = 0
							let current_ping = ping / 2
							for (let j = 0; j < controller_object._history.length; j++){
								//Math.ceil(ping / 2 / Bones.Timer.delta_time)
								if (total_calc_hist_time_delta > ping) {
									this.players[i].tick(total_calc_hist_time_delta - ping, true)
									break;
								}
								this.players[i].read_keyboard_controls(
									controller_object._history[controller_object._history.length-1-j].left,
									controller_object._history[controller_object._history.length-1-j].right,
									controller_object._history[controller_object._history.length-1-j].up,
									controller_object._history[controller_object._history.length-1-j].down,
									this.players[i].move_aim,
									controller_object._history[controller_object._history.length-1-j].Shotgun,
									controller_object._history[controller_object._history.length-1-j].jump,
									controller_object._history[controller_object._history.length-1-j]._select,
								)
								this.players[i].tick(controller_object._history[controller_object._history.length-1-j].delta_time, true)
								total_calc_hist_time_delta += controller_object._history[controller_object._history.length-1-j].delta_time
							}
						}
					}
				}
			}

			/*if(!isServer) {
				if(Bones.Input.Mouse.ControlStates.click_this_frame) {
					for (let i = 0; i < this.players.length; i++){
						if (this.players[i].id == clientId) {
							size = 100
							offset = 30 + size / 2
							this.bullets.push(new this.Bullet(this.players[i].x + this.players[i].width / 2 + Math.cos(this.players[i].move_aim * 2 * Math.PI) * (this.players[i].width / 2 + offset) - size / 2, this.players[i].y + this.players[i].height / 2 + Math.sin(this.players[i].move_aim * 2 * Math.PI) * (this.players[i].height / 2 + offset) - size / 2, 10, this.players[i].move_aim, 5000, size))
						}
					}
				}
			}*/
		}
		if(!isServer){
			let size = 35
			let cols = Math.floor( Bones.Renderer.width / size ) + 2
			let grids = Math.floor( Bones.Renderer.height / size ) * cols + 3 * cols
			for (let i = 0; i < grids; i++){
				Bones.Renderer.context.beginPath();
				Bones.Renderer.context.strokeStyle = "#8c97a2";
				Bones.Renderer.context.lineWidth = 1;
				Bones.Renderer.context.rect((0 - Bones.Renderer.camera_x % size + i * size) % (size * cols) - size, 0 - Bones.Renderer.camera_y % size + (Math.floor(i / cols) * size ) - size, size, size);
				Bones.Renderer.context.stroke();
			}
		}
		if(this.winner == -1){
			
			//if(isServer) {
				for (let j = 0; j < this.bullets.length; j++) {
					for (let i = 0; i < Bones.World.walls.length; i++){
						if(circleBoxCollision(Bones.World.walls[i].x, Bones.World.walls[i].y, Bones.World.walls[i].width, Bones.World.walls[i].height, this.bullets[j].x_interp_calc + this.bullets[j].size / 2, this.bullets[j].y_interp_calc + this.bullets[j].size / 2, this.bullets[j].size / 2)
							|| this.bullets[j].x_interp_calc + this.bullets[j].size / 2 < this.bullets[j].size / 2 || this.bullets[j].x_interp_calc + this.bullets[j].size / 2 > this.width - this.bullets[j].size / 2 ||
				this.bullets[j].y_interp_calc + this.bullets[j].size / 2 < this.bullets[j].size / 2 || this.bullets[j].y_interp_calc + this.bullets[j].size / 2 > this.height - this.bullets[j].size / 2){
							this.bullets[j].deactivate()
						}
					}
					/*if (){
						if(isServer) {
								this.bullets[j].deactivate()
							}
						else if(this.bullets[j].owner != clientId) {
							this.bullets[j].deactivate()	
						}
					}*/
				}
			//}
			
			for (let i = 0; i < this.players.length; i++) {
				for (let j = 0; j < this.bullets.length; j++) {
					if(this.players[i].id != this.bullets[j].owner/* || this.bullets[j].size > 70*/) {
						if (circle_collision(
						this.players[i].x_interp_calc + this.players[i].width / 2, 
						this.players[i].y_interp_calc + this.players[i].height / 2,
						this.players[i].width / 2,
						this.bullets[j].x_interp_calc + this.bullets[j].size / 2,
						this.bullets[j].y_interp_calc + this.bullets[j].size / 2,
						this.bullets[j].size / 2
						) && (this.players[i].respawning == false || (this.players[i].respawning && this.players[i].respawn_timer > 150))) {
							if(isServer) {
								this.players[i].health -= this.bullets[j].damage
								if (this.players[i].health <= 0) {
									this.players[i].health = 0
									for (let k = 0; k < this.players.length; k++) {
										if (this.players[k].id == this.bullets[j].owner && this.players[i].respawning == false) {
											this.players[k].score ++
											if (this.players[i].health <= 0) {
												this.players[i].respawn_timer = 175;
												this.players[i].respawning = true;
											}
										}
									}
								}
							}
							this.bullets[j].deactivate()
						}
					}
				}
			}

			for (let i = 0; i < this.bullets.length; i++) {
				this.bullets[i].tick(Bones.Timer.delta_time)
				if (this.bullets[i].active == false) {
					this.bullets.splice(i, 1)
				}
			}
			

			for (let i = 0; i < this.menu_items.length; i++) {
				this.menu_items[i].read_input()
				this.menu_items[i].render()
			}
			
			if (isServer == false) {
				Bones.Renderer.context.beginPath();
				Bones.Renderer.context.strokeStyle = "#495664";
				Bones.Renderer.context.lineWidth = 8;
				Bones.Renderer.context.rect(0 - Bones.Renderer.camera_x, 0 - Bones.Renderer.camera_y, this.width, this.height);
				Bones.Renderer.context.stroke();
			}
				for (let i = 0; i < this.walls.length; i++) {
					if (isServer == false) {
						this.walls[i].render()
					}
				}
				for (let i = 0; i < this.bullets.length; i++) {
					this.bullets[i].calc_interp()
					if (isServer == false) {
						this.bullets[i].render()
					}
				}
				for (let i = 0; i < this.players.length; i++){
					if(isServer || this.players[i].id != clientId) {
						this.players[i].calc_interp()
						if (isServer == false) {
							this.players[i].render()
						}
					}
				}
				
				if(!isServer) {
					for (let i = 0; i < this.players.length; i++){
						if (this.players[i].id == clientId) {
							this.players[i].calc_interp()
							if (isServer == false) {
								Bones.Renderer.camera_x = this.players[i].x_interp_calc + this.players[i].width / 2 - Bones.Renderer.width / 2
								Bones.Renderer.camera_y = this.players[i].y_interp_calc + this.players[i].height / 2 - Bones.Renderer.height / 2
								this.players[i].render()
							}
						}
					}
				}
			
			if (isServer == false) {
				Bones.Renderer.context.beginPath();
				Bones.Renderer.context.strokeStyle = "#495664";
				Bones.Renderer.context.lineWidth = 4;
				let reticle_width = 15
				Bones.Renderer.context.arc(Bones.Input.Mouse.ControlStates.x, Bones.Input.Mouse.ControlStates.y, reticle_width, 0, 2 * Math.PI);
				Bones.Renderer.context.stroke();
				
				Bones.Renderer.context.beginPath();
				Bones.Renderer.context.strokeStyle = "#495664";
				Bones.Renderer.context.lineWidth = 4;
				Bones.Renderer.context.beginPath();
				
				Bones.Renderer.context.moveTo(Bones.Input.Mouse.ControlStates.x + 15, Bones.Input.Mouse.ControlStates.y);
				Bones.Renderer.context.lineTo(Bones.Input.Mouse.ControlStates.x + 22, Bones.Input.Mouse.ControlStates.y);
				
				Bones.Renderer.context.moveTo(Bones.Input.Mouse.ControlStates.x - 15, Bones.Input.Mouse.ControlStates.y);
				Bones.Renderer.context.lineTo(Bones.Input.Mouse.ControlStates.x - 22, Bones.Input.Mouse.ControlStates.y);
				
				Bones.Renderer.context.moveTo(Bones.Input.Mouse.ControlStates.x, Bones.Input.Mouse.ControlStates.y + 15);
				Bones.Renderer.context.lineTo(Bones.Input.Mouse.ControlStates.x, Bones.Input.Mouse.ControlStates.y + 22);
				
				Bones.Renderer.context.moveTo(Bones.Input.Mouse.ControlStates.x, Bones.Input.Mouse.ControlStates.y - 15);
				Bones.Renderer.context.lineTo(Bones.Input.Mouse.ControlStates.x, Bones.Input.Mouse.ControlStates.y - 22);
				Bones.Renderer.context.stroke();
				
				Bones.Renderer.context.beginPath();
				Bones.Renderer.context.arc(Bones.Input.Mouse.ControlStates.x, Bones.Input.Mouse.ControlStates.y, 1, 0, 2 * Math.PI);
				Bones.Renderer.context.stroke();
				
				Bones.Renderer.context.font = "bold 24px Monospace";
				Bones.Renderer.context.fillStyle = "#495664";
				Bones.Renderer.context.textAlign = "left";
				Bones.Renderer.context.fillText("1. Mine", 30, Bones.Renderer.height - 100)
				Bones.Renderer.context.fillText("2. Flamethrower", 30, Bones.Renderer.height - 75)
				Bones.Renderer.context.fillText("3. Shotgun", 30, Bones.Renderer.height - 50)
				Bones.Renderer.context.fillText("4. Pistol", 30, Bones.Renderer.height - 25)
				
				Bones.Renderer.context.font = "bold 24px Monospace";
				Bones.Renderer.context.fillStyle = "#495664";
				Bones.Renderer.context.textAlign = "left";
				Bones.Renderer.context.fillText("Ping " + ping, Bones.Renderer.width - 130, 50)
				Bones.Renderer.context.fillText("FPS " + Bones.Timer.fps, Bones.Renderer.width - 130, 80)

				Bones.Renderer.context.stroke();
				
				for (let i = 0; i < this.players.length; i++) {
					Bones.Renderer.context.font = "bold 24px Monospace";
					Bones.Renderer.context.fillStyle = Bones.World.colors[this.players[i].id%Bones.World.colors.length];
					Bones.Renderer.context.textAlign = "left";
					Bones.Renderer.context.fillText("Player " + (this.players[i].id + 1) + ": " + this.players[i].score, 30, i* 30 + 50)
				}
			}
			if (Bones.DebugDisplay.stress_test == true) {
				rand = 1
				if (Bones.DebugDisplay.stress_random) {
					rand = Math.random() * Bones.DebugDisplay.stress_loops;
				}
				for (i = 0; i < Bones.DebugDisplay.stress_loops * rand; i++) {
					Bones.Renderer.context.fillText("", 0, 0)
				}
			}
			
		}
		
		if (isServer == false) {
					
			Bones.Renderer.context.font = "bold 24px Monospace";
			Bones.Renderer.context.fillStyle = "#495664";
			Bones.Renderer.context.textAlign = "center";
			Bones.Renderer.context.fillText("Welcome to Project Bones Alpha branch-network_testing-0.3.10!", Bones.Renderer.canvas.width / 2, 25)
			
			for (let i = 0; i < this.players.length; i++) {
				Bones.Renderer.context.font = "bold 24px Monospace";
				Bones.Renderer.context.fillStyle = Bones.World.colors[this.players[i].id%Bones.World.colors.length];
				Bones.Renderer.context.textAlign = "left";
				Bones.Renderer.context.fillText("Player " + (this.players[i].id + 1) + ": " + this.players[i].score, 30, i* 30 + 50)
			}
		}
				
		if(this.winner != -1) {
			if(!isServer){
				Bones.Renderer.context.font = "bold 24px Monospace";
				Bones.Renderer.context.fillStyle = "#495664";
				Bones.Renderer.context.textAlign = "center";
				Bones.Renderer.context.fillText("Game over!", Bones.Renderer.width / 2, Bones.Renderer.height / 2 - 80)
				Bones.Renderer.context.fillText("Congradulations", Bones.Renderer.width / 2, Bones.Renderer.height / 2 - 50)
				Bones.Renderer.context.fillStyle = Bones.World.colors[this.winner%Bones.World.colors.length];
				Bones.Renderer.context.fillText("Player " + (this.winner + 1), Bones.Renderer.width / 2, Bones.Renderer.height / 2 - 20)
				Bones.Renderer.context.fillStyle = "#495664";
				Bones.Renderer.context.fillText("You win!", Bones.Renderer.width / 2, Bones.Renderer.height / 2 + 10)
			}
			this.win_timer += 1 * Bones.Timer.delta_time * Bones.Timer.timescale
			if(this.win_timer > 400) {
				this.win_timer = 0;
				this.winner = -1;
				this.map_select = (this.map_select + 1) % this.num_maps
				this.load_map()
				for (let i = 0; i < this.players.length; i++) {
					this.players[i].score = 0;
					this.players[i].respawn()
				}
			}
		}
    }, // END FUNCTION tick
    create_menu_item(x, y, width, height, text, on_activate_function, on_deactivate_function, mode='default') {
        this.menu_items.push(new MenuItem(x, y, width, height, text, on_activate_function, on_deactivate_function, mode=mode))
    },
	serialize() {
		return JSON.stringify([this.winner, this.win_timer, this.map_select, this.bullet_id])
	},
	deserialize(dumps) {
		const state = JSON.parse(dumps);
		this.winner = state[0];
		this.win_timer = state[1];
		this.map_select = state[2];
		this.bullet_id = state[3];
	},
    CircleProp: class {
        constructor(x, y, radius, angle, anchored) {
            this.x = x
            this.y = y

            this.angle = angle;

            this.radius = radius;

            this.anchored = anchored;

            this.body = Matter.Bodies.circle(this.x, this.y, this.radius, {
                isStatic: this.anchored
            })
            Matter.Composite.add(Bones.World.Physics.matterjs_world, [this.body]);
        }
        render() {
            this.pos = this.body.position;
            this.angle = this.body.angle;
            this.x = this.pos.x;
            this.y = this.pos.y;
            Bones.Renderer.context.save()
            Bones.Renderer.context.fillStyle = "white";
            Bones.Renderer.context.translate(this.x - Bones.Renderer.camera_x, this.y - Bones.Renderer.camera_y);
            Bones.Renderer.context.rotate(this.angle);

            Bones.Renderer.context.fillRect(0 - this.w / 2, 0 - this.h / 2, this.w, this.h);
            Bones.Renderer.context.restore()
        }
    }, // END CLASS BoxProp
    bullet_id: 0,
	getBulletId(){
		ret_bullet_id = this.bullet_id
		this.bullet_id++;
		if (this.bullet_id > 1000) {
			this.bullet_id = 0
		}
		return ret_bullet_id
	},
    Bullet: class {
        constructor(x, y, velocity, angle, ttl, size, damage, owner, id, _type) {
            this.x = x
            this.y = y
			
			this.interp_strength = 1000
			this.x_interp = []
			this.y_interp = []
			this.x_interp_calc = this.x
			this.y_interp_calc = this.y
			for (let i = 0; i < this.interp_strength; i++) {
				this.x_interp.push(this.x)
				this.y_interp.push(this.y)
			}
			
            this.velocity = velocity
            this.angle = angle;
            this.ttl = ttl;
            this.size = size;
			this.active = true;
			this.damage = damage;
			this.owner = owner
			this.id = id
			this._type = _type
        }
		deactivate() {
			this.active = false
			this.velocity = 0
			this.damage = 0
			if(isServer) {
				server_network_queue.push(["server bullet deactivate", this.id])
			}
		}
		tick (delta_time, physics=false) {
			//if(isServer || this.owner == clientId) {
				this.x += this.velocity * Math.cos(this.angle * 2 * Math.PI) * delta_time * Bones.Timer.timescale
				this.y += this.velocity * Math.sin(this.angle * 2 * Math.PI) * delta_time * Bones.Timer.timescale
				this.ttl -= 1 * delta_time * Bones.Timer.timescale
				if (this.ttl <= 0) {
					this.deactivate()
				}	
			//}
		}
		calc_interp(){
				
			this.x_interp.push(this.x)
			this.y_interp.push(this.y)
			this.x_interp = this.x_interp.slice(0-this.interp_strength)
			this.y_interp = this.y_interp.slice(0-this.interp_strength)
			this.x_interp_calc = this.x
			this.y_interp_calc = this.y
			//this.interp_strength = 10
			let x = 1
			if(!isServer) {
				x = Math.ceil((200/* + ping*/) / Bones.Timer.delta_time)
				if (x == Infinity) {
					x = 1000
				}
			}
			for (let i = 0; i < x; i++) {
				if(i > this.x_interp.length) {
					console.log('interp time larger than buffer')
					break
				}
				this.x_interp_calc = this.x_interp_calc + this.x_interp[this.x_interp.length-1-i]
				this.y_interp_calc = this.y_interp_calc + this.y_interp[this.y_interp.length-1-i]
			}
			this.x_interp_calc = this.x_interp_calc / (x+1)
			this.y_interp_calc = this.y_interp_calc / (x+1)
		}
        render() {
			
			Bones.Renderer.context.beginPath();
			Bones.Renderer.context.strokeStyle = Bones.World.colors[this.owner%Bones.World.colors.length]
			Bones.Renderer.context.lineWidth = 4;
			//if(this.owner == clientId) {
				Bones.Renderer.context.arc(this.x_interp_calc + this.size / 2 - Bones.Renderer.camera_x, this.y_interp_calc + this.size / 2 - Bones.Renderer.camera_y, this.size / 2, 0, 2 * Math.PI);
			//} else {
				//Bones.Renderer.context.arc(this.x + this.size / 2 - Bones.Renderer.camera_x, this.y + this.size / 2 - Bones.Renderer.camera_y, this.size / 2, 0, 2 * Math.PI);
			//}
			Bones.Renderer.context.stroke();
        }
		serialize() {
			return JSON.stringify([this.x, this.y, this.velocity, this.angle, this.ttl, this.size, this.active, this.damage, this.owner, this.id, this._type])
		}
		deserialize(dumps) {
			if(this._type != 'Flamethrower'){
				const state = JSON.parse(dumps);
				this.x = state[0];
				this.y = state[1];
				this.velocity = state[2];
				this.angle = state[3];
				this.ttl = state[4];
				this.size = state[5];
				this.active = state[6];
				this.damage = state[7];
				this.owner = state[8];
				this.id = state[9];
				this._type = state[10];
				if(!isServer){
					this.tick(ping / 2, true)
				}
			}
		}
    }, // END CLASS BoxProp

	Wall: class {
        constructor(x, y, width, height) {
            this.x = x
            this.y = y
            this.width = width
			this.height = height
        }
        render() {
			Bones.Renderer.context.beginPath();
			Bones.Renderer.context.strokeStyle = "#495664";
			Bones.Renderer.context.lineWidth = 8;
			Bones.Renderer.context.rect(this.x - Bones.Renderer.camera_x, this.y - Bones.Renderer.camera_y, this.width, this.height);
			Bones.Renderer.context.stroke();
        }
    }, // END CLASS BoxProp


    NPC: class {
        constructor() {
            //npc init

            this.x = 400;
            this.y = 100;

            this.radius = 50;

            this.animation = new Animation();

            this.x_vel = 0;
            this.y_vel = 0;

            this.stuck_time = 0;

            this.kicks_counter = 0;
            this.kicks_per_minute = 0
            this.kick_timer = 0
        }
        calculate_kicks_per_minute() {
            this.kicks_per_minute = this.kicks_counter
            this.kicks_counter = 0
        }
        tick() {
            /*
            this.kick_timer += 1 * Bones.Timer.delta_time * Bones.Timer.timescale
            if (this.kick_timer > 60 * 60) {
                this.kick_timer -= 60 * 60
                this.calculate_kicks_per_minute()
            }
            this.x += this.x_vel * Bones.Timer.delta_time * Bones.Timer.timescale
            this.y += this.y_vel * Bones.Timer.delta_time * Bones.Timer.timescale
            */
            /* For top down mode:
            this.y_vel = this.y_vel / 2;
            this.x_vel = this.x_vel / 2; */
            /*
            if (this.x < 0 - this.w) {
                this.x = Bones.Renderer.width;
            }
            if (this.y < 0) {
                this.y = 0
                this.y_vel = 0 - this.y_vel
                if (this.y_vel > 0) {
                    this.y_vel = 0;
                }
            }
            if (this.x > Bones.Renderer.width) {
                this.x = -25;
            }
            if (this.y > Bones.Renderer.height - this.h) {
                this.x_vel = this.x_vel * 0.7 
                this.y = Bones.Renderer.height - this.h;
                this.y_vel = 0 - this.y_vel * 0.7 
                if (this.y_vel > 0) {
                    this.y_vel = 0;
                }
            }


            if (this.y_vel <= 1 && this.y_vel >= -1 &&
                this.x_vel <= 1 && this.x_vel >= -1) {
                this.stuck_time += 1 * Bones.Timer.delta_time * Bones.Timer.timescale;
                if (this.stuck_time > 10) {
                    this.stuck_time = 0
                    this.kicks_counter ++
                    this.y_vel = (Math.floor(Math.random() * 100) - 50)// * Bones.Timer.delta_time * Bones.Timer.timescale
                    this.x_vel = (Math.floor(Math.random() * 100) - 50)// * Bones.Timer.delta_time * Bones.Timer.timescale
                }
            }
            this.y_vel += 1 * Bones.Timer.delta_time * Bones.Timer.timescale
            */
        }
        render() {
        }
    }, // END CLASS NPC
	
	Controller: class {
		constructor(id) {
			this.left = false;
			this.right = false;
			this.up = false;
			this.down = false;
			this.aim = 90;
			this.Shotgun = false;
			this.jump = false;
			this._select = 3;
			this.id = id
			this.timestamp = Date.now()
			this.delta_time = Bones.Timer.delta_time
			this._history = []
		}
		update() {
			if(Bones.Input.Keyboard.ControlStates["up"].pressed || Bones.Input.Keyboard.ControlStates["up"].pressed_this_frame) {
				this.up = true;
			} else {
				this.up = false;
			}
			if(Bones.Input.Keyboard.ControlStates["down"].pressed || Bones.Input.Keyboard.ControlStates["down"].pressed_this_frame) {
				this.down = true;
			} else {
				this.down = false;
			}
			if(Bones.Input.Keyboard.ControlStates["left"].pressed || Bones.Input.Keyboard.ControlStates["left"].pressed_this_frame) {
				this.left = true;
			} else {
				this.left = false;
			}
			if(Bones.Input.Keyboard.ControlStates["right"].pressed || Bones.Input.Keyboard.ControlStates["right"].pressed_this_frame) {
				this.right = true;
			} else {
				this.right = false;
			}
			if(Bones.Input.Keyboard.ControlStates["jump"].pressed || Bones.Input.Keyboard.ControlStates["jump"].pressed_this_frame) {
				this.jump = true;
			} else {
				this.jump = false;
			}
			if(Bones.Input.Mouse.ControlStates.click_this_frame || Bones.Input.Mouse.ControlStates.click) {
				this.Shotgun = true;
			} else {
				this.Shotgun = false;
			}
			if(Bones.Input.Keyboard.ControlStates["select0"].pressed || Bones.Input.Keyboard.ControlStates["select0"].pressed_this_frame) {
				this._select = 0;
			}
			if(Bones.Input.Keyboard.ControlStates["select1"].pressed || Bones.Input.Keyboard.ControlStates["select1"].pressed_this_frame) {
				this._select = 1;
			}
			if(Bones.Input.Keyboard.ControlStates["select2"].pressed || Bones.Input.Keyboard.ControlStates["select2"].pressed_this_frame) {
				this._select = 2;
			}
			if(Bones.Input.Keyboard.ControlStates["select3"].pressed || Bones.Input.Keyboard.ControlStates["select3"].pressed_this_frame) {
				this._select = 3;
			}
			if(Bones.Input.Mouse.ControlStates.scroll_up_this_frame) {
				this._select = (this._select + 1) % 4
				console.log('select up')
				console.log(this._select)
			}
			if(Bones.Input.Mouse.ControlStates.scroll_down_this_frame) {
				this._select = (this._select - 1) % 4
				if(this._select < 0){
					this._select += 4
				}
				console.log('select down')
				console.log(this._select)
			}
			for (let i = 0; i < Bones.World.players.length; i++) {
				if (Bones.World.players[i].id == this.id) {
					let mx = Bones.Input.Mouse.ControlStates.x + Bones.Renderer.camera_x
					let my = Bones.Input.Mouse.ControlStates.y + Bones.Renderer.camera_y
					
					let x = mx - Bones.World.players[i].x_interp_calc - Bones.World.players[i].width / 2 
					let y = my - Bones.World.players[i].y_interp_calc - Bones.World.players[i].height / 2 
					
					var dAx = x;
					var dAy = y;
					var dBx = 0;
					var dBy = -1;
					var angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
					var degree_angle = 360 - angle * (180 / Math.PI);
					
					this.aim = (degree_angle - 90) / 360
				}
			}
			this.timestamp = Date.now()
			this.delta_time = Bones.Timer.delta_time
			let history_object = new Bones.World.Controller()
			history_object.left = this.left;
			history_object.right = this.right;
			history_object.up = this.up;
			history_object.down = this.down;
			history_object.aim = this.aim;
			history_object.Shotgun = this.Shotgun;
			history_object.jump = this.jump;
			history_object._select = this._select;
			history_object.id = this.id
			history_object.timestamp = this.timestamp
			history_object.delta_time = this.delta_time
			this._history.push(history_object)
			//console.log(this._history)
			//this._history.slice(-1000)
			
		}
		serialize() {
			return JSON.stringify([this.left, this.right, this.up, this.down, this.aim, this.Shotgun, this.jump, this._select])
		}
		deserialize(dumps) {
			const state = JSON.parse(dumps);
			this.left = state[0];
			this.right = state[1];
			this.up = state[2];
			this.down = state[3];
			this.aim = state[4];
			this.Shotgun = state[5];
			this.jump = state[6];
			this._select = state[7];
		}
	}, // END CONTROLLER CLASS
    Player: class {
        constructor(id) {
            //player init
			this.id = id
            this.movement_speed = 1;
            this.x = Math.random() * Bones.World.width;
            this.y = Math.random() * Bones.World.height;
			this.old_x = this.x
			this.old_y = this.y
			
			this.width = 65;
			this.height = 65;
			
			
			
			this.respawn()
			
			this.interp_strength = 10
			this.x_interp = []
			this.y_interp = []
			this.x_interp_calc = this.x
			this.y_interp_calc = this.y
			for (let i = 0; i < 1000; i++) {
				this.x_interp.push(this.x)
				this.y_interp.push(this.y)
			}
            this.x_vel = 0;
            this.y_vel = 0;
			this.velocity = 7;
			this.angle = 90;
            this.max_x_vel = 7
            this.max_y_vel = 70
            this.x_acc = 1.5
			this.max_x_vel_aim = 3
            this.y_acc = 10 // Todo: Pistol acceleration, Pistol max vel, run speed, bunny hopping
            this.ground_friction = 99 //0.55
            this.air_friction = 0.05
            this.gravity = 0.25
            this.facing_right = true

            this.move_left = false;
            this.move_right = false;
			this.move_up = false;
			this.move_down = false;
			this.move_aim = 90;
			this.move_aim_interp = []
			this.aim_interp_calc = this.move_aim
			for (let i = 0; i < 1000; i++) {
				this.move_aim_interp.push(this.move_aim)
			}
			this.move_Shotgun = false;
			this.fire_cooldown = 0;
            this.move_jump = false;
            this.jump_lock = false;
			
			this._class = 'Shotgun'
			
			this._select = 2
			
			this.health = 100
			this.active = true;
			
			this.respawn_timer = 0;
			this.respawning = false;
			
			this.score = 0;
			
			this.just_respawned = true;
			
			this.interp_cooldown = 50;
			
			this.change_class('Pistol')
			
			this.afk_timer = 0
			
			this.process_history = false
        }
		respawn() {
			this.fire_cooldown = 0;
			this.respawn_timer = 0;
			let collide_with_wall_or_bullet = true
			while(collide_with_wall_or_bullet){
				collide_with_wall_or_bullet = false
				this.x = Math.random() * Bones.World.width;
				this.y = Math.random() * Bones.World.height;
				for (let i = 0; i < Bones.World.walls.length; i++){
					if(circleBoxCollision(Bones.World.walls[i].x, Bones.World.walls[i].y, Bones.World.walls[i].width, Bones.World.walls[i].height, this.x + this.width / 2, this.y + this.height / 2, this.width / 2)) {
						collide_with_wall_or_bullet = true;
					}
				}
				for (let j = 0; j < Bones.World.bullets.length; j++) {
					if (circle_collision(
						this.x + this.width / 2, 
						this.y + this.height / 2,
						this.width / 2,
						Bones.World.bullets[j].x_interp_calc + Bones.World.bullets[j].size / 2,
						Bones.World.bullets[j].y_interp_calc + Bones.World.bullets[j].size / 2,
						Bones.World.bullets[j].size / 2
					)) {
						collide_with_wall_or_bullet = true;
					}
				}
			}
		}
		change_class(_class) {
			this._class = _class;
			
			if (this._class == 'Mine') {
				this.x_acc = 1.5
				this.max_x_vel = 7;
				this.max_x_vel_aim = 7;
			}
			
			if (this._class == 'Pistol') {
				this.x_acc = 99 //1.5
				this.max_x_vel = 7;
				this.max_x_vel_aim = 1;
			}
			
			if (this._class == 'Flamethrower') {
				this.x_acc = 1.5
				this.max_x_vel = 7;
				this.max_x_vel_aim = 7;
			}
			
			if (this._class == 'Shotgun') {
				this.x_acc = 1.5
				this.max_x_vel = 7;
				this.max_x_vel_aim = 7;
			}
		}
		deactivate() {
			this.active = false;
		}
        read_keyboard_controls(move_left, move_right, move_up, move_down, move_aim, move_Shotgun, move_jump, _select) {
            this.move_left = move_left;
            this.move_right = move_right;
			this.move_up = move_up;
			this.move_down = move_down;
			this.move_aim = move_aim;
			this.move_Shotgun = move_Shotgun;
            this.move_jump = move_jump;
            if (this.move_left == true && this.move_right == true) {
                this.move_left = false;
                this.move_right = false;
            }
            if (this.move_up == true && this.move_down == true) {
                this.move_up = false;
                this.move_down = false;
            }
			this._select = _select
				
			/*if(!isServer) {
				
			}*/
        }
        tick(delta_time, physics=false) {
			this.old_x = this.x;
			this.old_y = this.y;
			if(!physics){
				this.interp_cooldown -= 1;
			}
			if (this.interp_cooldown <= 0){
				this.interp_cooldown = 0
			}
			
			if ((this.just_respawned == true && this.respawn_timer == 0) || this.interp_cooldown > 0) {
				this.just_respawned = false;
				console.log('just respawned')
				for (let i = 0; i < this.interp_strength; i++) {
					this.x_interp = []
					this.y_interp = []
					this.x_interp_calc = this.x
					this.y_interp_calc = this.y
					for (let i = 0; i < this.interp_strength; i++) {
						this.x_interp.push(this.x)
						this.y_interp.push(this.y)
					}
				}
			}
			if(this.respawning == false){
				// Control
				let new_vec = []
				if (this.move_up && this.move_right) {
					//this.angle = 315 / 360
					//this.velocity = this.max_x_vel
					new_vec = addForceToVector(this.angle, this.velocity, 315 / 360, this.max_x_vel, this.x_acc * delta_time * Bones.Timer.timescale, this.x_acc * delta_time * Bones.Timer.timescale)
					this.angle = new_vec[0]
					this.velocity = new_vec[1]
				}
				else if (this.move_right && this.move_down) {
					//this.x_vel += this.x_acc * Bones.Timer.delta_time * Bones.Timer.timescale;
					new_vec = addForceToVector(this.angle, this.velocity, 45 / 360, this.max_x_vel, this.x_acc * delta_time * Bones.Timer.timescale, this.x_acc * delta_time * Bones.Timer.timescale)
					this.angle = new_vec[0]
					this.velocity = new_vec[1]
				}
				else if (this.move_down && this.move_left) {
					new_vec = addForceToVector(this.angle, this.velocity, 135 / 360, this.max_x_vel, this.x_acc * delta_time * Bones.Timer.timescale, this.x_acc * delta_time * Bones.Timer.timescale)
					this.angle = new_vec[0]
					this.velocity = new_vec[1]
				}
				else if (this.move_left && this.move_up) {
					//this.x_vel -= this.x_acc * Bones.Timer.delta_time * Bones.Timer.timescale;
					new_vec = addForceToVector(this.angle, this.velocity, 225 / 360, this.max_x_vel, this.x_acc * delta_time * Bones.Timer.timescale, this.x_acc * delta_time * Bones.Timer.timescale)
					this.angle = new_vec[0]
					this.velocity = new_vec[1]
				}
				else if (this.move_up) {
					new_vec = addForceToVector(this.angle, this.velocity, 270 / 360, this.max_x_vel, this.x_acc * delta_time * Bones.Timer.timescale, this.x_acc * delta_time * Bones.Timer.timescale)
					this.angle = new_vec[0]
					this.velocity = new_vec[1]
				}
				else if (this.move_right) {
					//this.x_vel += this.x_acc * Bones.Timer.delta_time * Bones.Timer.timescale;
					new_vec = addForceToVector(this.angle, this.velocity, 360 / 360, this.max_x_vel, this.x_acc * delta_time * Bones.Timer.timescale, this.x_acc * delta_time * Bones.Timer.timescale)
					this.angle = new_vec[0]
					this.velocity = new_vec[1]
				}
				else if (this.move_down) {
					new_vec = addForceToVector(this.angle, this.velocity, 90 / 360, this.max_x_vel, this.x_acc * delta_time * Bones.Timer.timescale, this.x_acc * delta_time * Bones.Timer.timescale)
					this.angle = new_vec[0]
					this.velocity = new_vec[1]
				}
				else if (this.move_left) {
					//this.x_vel -= this.x_acc * Bones.Timer.delta_time * Bones.Timer.timescale;
					new_vec = addForceToVector(this.angle, this.velocity, 180 / 360, this.max_x_vel, this.x_acc * delta_time * Bones.Timer.timescale, this.x_acc * delta_time * Bones.Timer.timescale)
					this.angle = new_vec[0]
					this.velocity = new_vec[1]
				}
				
				if(this.fire_cooldown <= 0){
					if (this._select == 0) {
						this.change_class('Mine')
					}
					if (this._select == 1) {
						this.change_class('Flamethrower')
					}
					if (this._select == 2) {
						this.change_class('Shotgun')
					}
					if (this._select == 3) {
						this.change_class('Pistol')
					}
				}
				/*if (this.move_jump && !this.jump_lock && this.on_ground) {
					this.y_vel -= this.y_acc
					this.on_ground = false
					this.jump_lock = true
				}*/
				/*this.on_ground = true;
				if (!this.move_jump) {
					this.jump_lock = false
				}*/

				// Gravity

				//this.y_vel += this.gravity * Bones.Timer.delta_time * Bones.Timer.timescale

				// Friction

				if(!this.move_left && !this.move_right && !this.move_up && !this.move_down && this.velocity > 0) {
					if (this.velocity <= this.ground_friction * delta_time * Bones.Timer.timescale) {
						this.velocity = 0; // player_ground_friction;
					} else {
						this.velocity -= this.ground_friction * delta_time * Bones.Timer.timescale;
					}
				}
				/*if (!this.move_left && !this.move_right) {
					if (this.x_vel > 0) {
						if (this.on_ground == true) {
							if (this.x_vel <= this.ground_friction * Bones.Timer.delta_time * Bones.Timer.timescale) {
								this.x_vel = 0; // player_ground_friction;
							} else {
								this.x_vel -= this.ground_friction * Bones.Timer.delta_time * Bones.Timer.timescale;
							}
						}
						if (this.on_ground == false) {
							if (this.x_vel < this.air_friction * Bones.Timer.delta_time * Bones.Timer.timescale) {
								this.x_vel = this.air_friction * Bones.Timer.delta_time * Bones.Timer.timescale;
							} else {
								this.x_vel -= this.air_friction * Bones.Timer.delta_time * Bones.Timer.timescale;
							}
						}
					}
					if (this.x_vel < 0) {
						if (this.on_ground == true) {
							if (this.x_vel >= -this.ground_friction * Bones.Timer.delta_time * Bones.Timer.timescale) {
								this.x_vel = 0; // -player_ground_friction
							} else {
								this.x_vel += this.ground_friction * Bones.Timer.delta_time * Bones.Timer.timescale;
							}
						}
						if (this.on_ground == false) {
							if (this.x_vel > -this.air_friction * Bones.Timer.delta_time * Bones.Timer.timescale) {
								this.x_vel = -this.air_friction * Bones.Timer.delta_time * Bones.Timer.timescale
							} else {
								this.x_vel += this.air_friction * Bones.Timer.delta_time * Bones.Timer.timescale
							}
						}
					}
				}
				if (!this.move_up && !this.move_down) {
					if (this.y_vel > 0) {
						if (this.y_vel <= this.ground_friction * Bones.Timer.delta_time * Bones.Timer.timescale) {
							this.y_vel = 0; // player_ground_friction;
						} else {
							this.y_vel -= this.ground_friction * Bones.Timer.delta_time * Bones.Timer.timescale;
						}
					}
					if (this.y_vel < 0) {
						if (this.y_vel >= -this.ground_friction * Bones.Timer.delta_time * Bones.Timer.timescale) {
							this.y_vel = 0; // -player_ground_friction
						} else {
							this.y_vel += this.ground_friction * Bones.Timer.delta_time * Bones.Timer.timescale;
						}
					}
				}*/


				// Maximum Velocities

				/*if (this.x_vel > this.max_x_vel) {
					this.x_vel = this.max_x_vel
				}
				if (this.x_vel < -this.max_x_vel) {
					this.x_vel = -this.max_x_vel
				}
				if (this.y_vel > this.max_x_vel) {
					this.y_vel = this.max_x_vel
				}
				if (this.y_vel < -this.max_x_vel) {
					this.y_vel = -this.max_x_vel
				}*/
				
				if(this.fire_cooldown > 0) {
					if (this.velocity > this.max_x_vel_aim) {
							this.velocity = this.max_x_vel_aim
					}
				} else {
					if (this.velocity > this.max_x_vel) {
							this.velocity = this.max_x_vel
					}
				}

				// Commit x and y Velocities

				/*this.x += this.x_vel * Bones.Timer.delta_time * Bones.Timer.timescale;
				this.y += this.y_vel * Bones.Timer.delta_time * Bones.Timer.timescale;*/
				
				if(isServer || physics || this.id == clientId){
					this.x += this.velocity * Math.cos(this.angle * 2 * Math.PI) * delta_time * Bones.Timer.timescale
					this.y += this.velocity * Math.sin(this.angle * 2 * Math.PI) * delta_time * Bones.Timer.timescale
				}
				
				//this.angle += 0.01 * Bones.Timer.delta_time * Bones.Timer.timescale


				// Movement Bounderies

				if (this.x < 0) {
					this.x = 2
					//this.velocity = 0
				}
				if (this.x > Bones.World.width - this.width) {
					this.x = Bones.World.width - this.width - 2
					//this.velocity = 0
				}
				if (this.y < 0) {
					this.y = 2
					//this.y_vel = 0 - this.y_vel
					//this.velocity = 0
				}
				if (this.y > Bones.World.height - this.height) {
					this.y = Bones.World.height - this.height - 2
					//this.velocity = 0
				}
				
				for (let i = 0; i < Bones.World.walls.length; i++){
					let j = 0
					while(circleBoxCollision(Bones.World.walls[i].x, Bones.World.walls[i].y, Bones.World.walls[i].width, Bones.World.walls[i].height, this.old_x + this.width / 2, this.y + this.height / 2, this.width / 2)) {
						if(circleBoxCollision(Bones.World.walls[i].x, Bones.World.walls[i].y, Bones.World.walls[i].width, 1, this.old_x + this.width / 2, this.y + this.height / 2, this.width / 2)){
							// collide top
							this.y--
							//this.velocity = 0
						}
						else if(circleBoxCollision(Bones.World.walls[i].x, Bones.World.walls[i].y + Bones.World.walls[i].height, Bones.World.walls[i].width, 1, this.old_x + this.width / 2, this.y + this.height / 2, this.width / 2)){
							// collide bottom
							this.y++
							//this.velocity = 0
						}
						if (j > 1000){
							break
						}
						j++
					}
					j = 0
					while(circleBoxCollision(Bones.World.walls[i].x, Bones.World.walls[i].y, Bones.World.walls[i].width, Bones.World.walls[i].height, this.x + this.width / 2, this.old_y + this.height / 2, this.width / 2)) {
						if(circleBoxCollision(Bones.World.walls[i].x, Bones.World.walls[i].y, 1, Bones.World.walls[i].height, this.x + this.width / 2, this.old_y + this.height / 2, this.width / 2)){
							// collide right
							this.x--
							//this.velocity = 0
						}
						else if(circleBoxCollision(Bones.World.walls[i].x + Bones.World.walls[i].width, Bones.World.walls[i].y, 1, Bones.World.walls[i].height, this.x + this.width / 2, this.old_y + this.height / 2, this.width / 2)){
							// collide left
							this.x++
							//this.velocity = 0
						}
						if (j > 1000){
							break
						}
						j++
					}
				}
				
				
				
				if (this.move_Shotgun && this.fire_cooldown <= 0 && !physics) {
					console.log('player fired')
					this.fire_cooldown = 50
					let size = 25
					let offset = 15 + size / 2
					let ttl = 40
					let speed = 25
					let damage = 10
					let angle = this.move_aim
					if (this._class == 'Mine') {
						size = 75
						offset = 30 + size / 2
						ttl = 500
						speed = 0
						damage = 100
						this.fire_cooldown = 80
					}
					
					if (this._class == 'Flamethrower') {
						size = 35
						offset = 30 + size / 2
						ttl = 20
						speed = 14
						damage = 5
						this.fire_cooldown = 2
					}
					
					if (this._class == 'Pistol') {
						size = 25
						offset = 30 + size / 2
						ttl = 40
						speed = 25
						damage = 50
						this.fire_cooldown = 60
					}
					
					if (this._class == 'Shotgun') {
						size = 20
						offset = 30 + size / 2
						ttl = 15
						speed = 20
						damage = 20
						this.fire_cooldown = 40
						let spread = 90
						if(/*(isServer || this.id == clientId) && */physics == false){
							Bones.World.bullets.push(new Bones.World.Bullet(this.x_interp_calc + this.width / 2 + Math.cos(this.move_aim * 2 * Math.PI) * (this.width / 2 + offset) - size / 2, this.y_interp_calc + this.height / 2 + Math.sin(this.move_aim * 2 * Math.PI) * (this.height / 2 + offset) - size / 2, speed - 4, this.move_aim - 0.05, ttl, size, damage, this.id, Bones.World.getBulletId(), this._class))
							Bones.World.bullets.push(new Bones.World.Bullet(this.x_interp_calc + this.width / 2 + Math.cos(this.move_aim * 2 * Math.PI) * (this.width / 2 + offset) - size / 2, this.y_interp_calc + this.height / 2 + Math.sin(this.move_aim * 2 * Math.PI) * (this.height / 2 + offset) - size / 2, speed - 1, this.move_aim - 0.025, ttl, size, damage, this.id, Bones.World.getBulletId(), this._class))
							Bones.World.bullets.push(new Bones.World.Bullet(this.x_interp_calc + this.width / 2 + Math.cos(this.move_aim * 2 * Math.PI) * (this.width / 2 + offset) - size / 2, this.y_interp_calc + this.height / 2 + Math.sin(this.move_aim * 2 * Math.PI) * (this.height / 2 + offset) - size / 2, speed, this.move_aim, ttl, size, damage, this.id, Bones.World.getBulletId(), this._class))
							Bones.World.bullets.push(new Bones.World.Bullet(this.x_interp_calc + this.width / 2 + Math.cos(this.move_aim * 2 * Math.PI) * (this.width / 2 + offset) - size / 2, this.y_interp_calc + this.height / 2 + Math.sin(this.move_aim * 2 * Math.PI) * (this.height / 2 + offset) - size / 2, speed - 1, this.move_aim + 0.025, ttl, size, damage, this.id, Bones.World.getBulletId(), this._class))
							Bones.World.bullets.push(new Bones.World.Bullet(this.x_interp_calc + this.width / 2 + Math.cos(this.move_aim * 2 * Math.PI) * (this.width / 2 + offset) - size / 2, this.y_interp_calc + this.height / 2 + Math.sin(this.move_aim * 2 * Math.PI) * (this.height / 2 + offset) - size / 2, speed - 4, this.move_aim + 0.05, ttl, size, damage, this.id, Bones.World.getBulletId(), this._class))
						}
					}
					if(/*(isServer || this.id == clientId) && */physics == false){
						angle = this.move_aim
						//new_vec = addVelocity(angle, speed, this.angle * Math.PI / 180, this.velocity)
						//angle = new_vec[0]
						//speed = new_vec[1]
						Bones.World.bullets.push(new Bones.World.Bullet(this.x_interp_calc + this.width / 2 + Math.cos(this.move_aim * 2 * Math.PI) * (this.width / 2 + offset) - size / 2, this.y_interp_calc + this.height / 2 + Math.sin(this.move_aim * 2 * Math.PI) * (this.height / 2 + offset) - size / 2, speed, angle, ttl, size, damage, this.id, Bones.World.getBulletId(), this._class))
					}
				}
				if(!physics){
					this.fire_cooldown -= 1 * delta_time * Bones.Timer.timescale
				}
				if (this.fire_cooldown < 0) {
					this.fire_cooldown = 0;
				}
			} // ENDIF RESPAWNING
			
			this.respawn_timer -= 1 * delta_time * Bones.Timer.timescale
			if (this.respawn_timer <= 0) {
				this.respawn_timer = 0;
				if (this.respawning == true) {
					if(isServer){
						this.respawning = false;
						this.health = 100;
						this.respawn()
					}
					this.just_respawned = true;
				}
			}
			
			if (this.x == this.old_x && this.y == this.old_y) {
				let x = delta_time
				if(x == 0) {
					x = 1
					//console.log('delta time corrected from 0 to 1')
				}
				this.afk_timer += delta_time / 1000
				//console.log(this.afk_timer)
			} else {
				this.afk_timer = 0
			}
        }
		calc_interp(){
			this.x_interp.push(this.x)
			this.y_interp.push(this.y)
			this.x_interp = this.x_interp.slice(0-1000)
			this.y_interp = this.y_interp.slice(0-1000)
			this.x_interp_calc = this.x
			this.y_interp_calc = this.y
			this.interp_strength = 10
			let x = 1
			if(!isServer){
				x = Math.ceil((200 /*+ ping*/) / Bones.Timer.delta_time)
				if (x == Infinity) {
					x = 1000
				}
			}
			for (let i = 0; i < x; i++) {
				if(i > this.x_interp.length) {
					console.log('interp time larger than buffer')
					break
				}
				this.x_interp_calc = this.x_interp_calc + this.x_interp[this.x_interp.length-1-i]
				this.y_interp_calc = this.y_interp_calc + this.y_interp[this.y_interp.length-1-i]
			}
			this.x_interp_calc = this.x_interp_calc / (x+1)
			this.y_interp_calc = this.y_interp_calc / (x+1)
			//Bones.Renderer.context.drawImage(Bones.Assets.gfx_player, this.x_interp_calc - Bones.Renderer.camera_x, this.y_interp_calc - Bones.Renderer.camera_y, this.width, this.height)
			//let aim = (this.move_aim - 90) / 360
			
			this.move_aim_interp.push(this.move_aim)
			this.move_aim_interp = this.move_aim_interp.slice(0-1000)
			this.aim_interp_calc = this.move_aim
			for (let i = 0; i < x; i++) {
				if(i > this.move_aim_interp.length) {
					console.log('interp time larger than buffer')
					break
				}
				if (this.move_aim - this.move_aim_interp[this.move_aim_interp.length-1-i] > 0.5) {
					this.move_aim_interp[this.move_aim_interp.length-1-i] += 1
				}
				if (this.move_aim - this.move_aim_interp[this.move_aim_interp.length-1-i] < -0.5) {
					this.move_aim_interp[this.move_aim_interp.length-1-i] -= 1
				}
				this.aim_interp_calc = this.aim_interp_calc + this.move_aim_interp[this.move_aim_interp.length-1-i]
			}
			this.aim_interp_calc = this.aim_interp_calc / (x+1)
		}
        render() {
			
			if(this.respawning == false) {
				
				//
				
				if(this.id == clientId){
					Bones.Renderer.context.font = "bold 40px Monospace";
					Bones.Renderer.context.fillStyle = "#495664";
					Bones.Renderer.context.textAlign = "center";
					Bones.Renderer.context.fillText(this._class, Bones.Renderer.width / 2, Bones.Renderer.height - 80)
					
					Bones.Renderer.context.font = "bold 50px Monospace";
					Bones.Renderer.context.fillStyle = "#495664";
					Bones.Renderer.context.textAlign = "center";
					Bones.Renderer.context.fillText(Math.round(this.fire_cooldown), Bones.Renderer.width / 2, Bones.Renderer.height - 20)
				}
				
				if (this.id != clientId) {
				
				
					Bones.Renderer.context.font = "bold 24px Monospace";
					Bones.Renderer.context.fillStyle = Bones.World.colors[this.id%Bones.World.colors.length];
					Bones.Renderer.context.textAlign = "center";
					Bones.Renderer.context.fillText(this.health, this.x_interp_calc + this.width / 2 - Bones.Renderer.camera_x, this.y_interp_calc - Bones.Renderer.camera_y - 40)
					
					Bones.Renderer.context.font = "bold 24px Monospace";
					//Bones.Renderer.context.fillStyle = "#495664";
					Bones.Renderer.context.textAlign = "center";
					Bones.Renderer.context.fillText("Player " + (this.id + 1), this.x_interp_calc + this.width / 2 - Bones.Renderer.camera_x, this.y_interp_calc - Bones.Renderer.camera_y - 65)
						
					Bones.Renderer.context.beginPath();
					Bones.Renderer.context.strokeStyle = Bones.World.colors[this.id%Bones.World.colors.length];
					Bones.Renderer.context.lineWidth = 4;
					Bones.Renderer.context.arc(this.x_interp_calc + this.width / 2 - Bones.Renderer.camera_x, this.y_interp_calc + this.height / 2 - Bones.Renderer.camera_y, this.height / 2, 0, 2 * Math.PI);
					Bones.Renderer.context.stroke();
					
					
					//reticle
					Bones.Renderer.context.beginPath();
					//Bones.Renderer.context.strokeStyle = "#495664";
					Bones.Renderer.context.lineWidth = 4;
					let reticle_width = 15
					Bones.Renderer.context.arc(this.x_interp_calc + this.width / 2 + Math.cos(this.aim_interp_calc * 2 * Math.PI) * (this.height / 2 + reticle_width) - Bones.Renderer.camera_x, this.y_interp_calc + this.height / 2 + Math.sin(this.aim_interp_calc * 2 * Math.PI) * (this.height / 2 + reticle_width) - Bones.Renderer.camera_y, reticle_width, 0, 2 * Math.PI);
					Bones.Renderer.context.stroke();
				} else {
					Bones.Renderer.context.font = "bold 24px Monospace";
					Bones.Renderer.context.fillStyle = Bones.World.colors[this.id%Bones.World.colors.length];
					Bones.Renderer.context.textAlign = "center";
					Bones.Renderer.context.fillText(this.health, this.x_interp_calc + this.width / 2 - Bones.Renderer.camera_x, this.y_interp_calc - Bones.Renderer.camera_y - 40)
					
					Bones.Renderer.context.font = "bold 24px Monospace";
					//Bones.Renderer.context.fillStyle = "#495664";
					Bones.Renderer.context.textAlign = "center";
					Bones.Renderer.context.fillText("Player " + (this.id + 1), this.x_interp_calc+ this.width / 2 - Bones.Renderer.camera_x, this.y_interp_calc - Bones.Renderer.camera_y - 65)
						
					Bones.Renderer.context.beginPath();
					Bones.Renderer.context.strokeStyle = Bones.World.colors[this.id%Bones.World.colors.length];
					Bones.Renderer.context.lineWidth = 4;
					Bones.Renderer.context.arc(this.x_interp_calc + this.width / 2 - Bones.Renderer.camera_x, this.y_interp_calc + this.height / 2 - Bones.Renderer.camera_y, this.height / 2, 0, 2 * Math.PI);
					Bones.Renderer.context.stroke();
				
				
					//reticle
					Bones.Renderer.context.beginPath();
					//Bones.Renderer.context.strokeStyle = "#495664";
					Bones.Renderer.context.lineWidth = 4;
					let reticle_width = 15
					Bones.Renderer.context.arc(this.x_interp_calc + this.width / 2 + Math.cos(this.move_aim * 2 * Math.PI) * (this.height / 2 + reticle_width) - Bones.Renderer.camera_x, this.y_interp_calc + this.height / 2 + Math.sin(this.move_aim * 2 * Math.PI) * (this.height / 2 + reticle_width) - Bones.Renderer.camera_y, reticle_width, 0, 2 * Math.PI);
					Bones.Renderer.context.stroke();
				}
			} else {
				if(this.id == clientId){
					Bones.Renderer.context.font = "bold 24px Monospace";
					Bones.Renderer.context.fillStyle = "#495664";
					Bones.Renderer.context.textAlign = "center";
					Bones.Renderer.context.fillText("You died! Respawning in " + Math.round(this.respawn_timer), Bones.Renderer.width / 2, Bones.Renderer.height / 2 - 20)
				}
			}
		}
		serialize() {
			return JSON.stringify([
					this.movement_speed, 
					this.x, 
					this.y, 
					this.x_vel, 
					this.y_vel, 
					this.max_x_vel, 
					this.max_y_vel, 
					this.x_acc, 
					this.y_acc, 
					this.ground_friction, 
					this.air_friction, 
					this.gravity, 
					this.facing_right, 
					this.move_left, 
					this.move_right, 
					this.move_up, 
					this.move_down, 
					this.move_aim, 
					this.move_Shotgun, 
					this.move_jump, 
					this.on_ground, 
					this.jump_lock, 
					this._class, 
					this.fire_cooldown,
					this._select,
					this.active,
					this.health,
					this.respawn_timer,
					this.respawning,
					this.score,
					this.angle,
					this.velocity,
					this.just_respawned,
				])
		}
		deserialize(dumps) {
			const state = JSON.parse(dumps);
			
            this.movement_speed = state[0];
            this.x = state[1];
            this.y = state[2];
            //this.x_vel = state[3];
            //this.y_vel = state[4];
            this.max_x_vel = state[5]
            this.max_y_vel = state[6]
            this.x_acc = state[7]
            this.y_acc = state[8] // Todo: Pistol acceleration, Pistol max vel, run speed, bunny hopping
            this.ground_friction = state[9]
            this.air_friction = state[10]
            this.air_friction = state[10]
            this.gravity = state[11]
            this.facing_right = state[12]

            this.move_left = state[13];
            this.move_right = state[14];
            this.move_up = state[15];
            this.move_down = state[16];
			if(this.id != clientId){
				this.move_aim = state[17];
				this.move_Shotgun = state[18];
				//this.fire_cooldown = state[23]
			}
            this.move_jump = state[19];

            this.on_ground = state[20]
            this.jump_lock = state[21]
            this._class = state[22]
			
            this._select = state[24]
            this.active = state[25]
            this.health = state[26]
			this.respawn_timer = state[27];
			this.respawning = state[28]
			this.score = state[29]
			this.angle = state[30]
			this.velocity = state[31]
			this.just_respawned = state[32]
			if(!isServer && this.id == clientId){
				this.process_history = true
			}
		}
    }, // END CLASS Player
} // END OBJECT Bones.World
Bones.World.init()
