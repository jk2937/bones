/*
 * Copyright 2024 Jonathan Kaschak
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const player = new Image();
player.src = "../assets/asset2.png"


player_movement_speed = 1;
player_x = 25;
player_y = 0;
player_x_vel = 0;
player_y_vel = 0;
player_max_x_vel = 7
player_max_y_vel = 70 
player_x_acc = 0.5
player_y_acc = 10
player_ground_friction = 0.15
player_air_friction = 0.05
player_gravity = 0.25
player_facing_right = true
player_on_ground = false
player_jump_lock = false
player_physics_object = new physics_object("square", {x:player_x, y:player_y, w:150, h:150}, anchored=true)
// player_body = Matter.Bodies.rectangle();
// Matter.World.add(world, this.body);

function control_player(control_left, control_right, control_jump) {

    if (move_left) {
        player_x_vel -= player_x_acc * delta_time * timescale;
    }
    if (move_right) {
        player_x_vel += player_x_acc * delta_time * timescale;
    }
    if (control_jump && !player_jump_lock && player_on_ground) {
        player_y_vel -= player_y_acc
        player_on_ground = false
        player_jump_lock = true
    }
    if (!control_jump) {
        player_jump_lock = false
    }

}

function move_player() {

    // Gravity

    player_y_vel += player_gravity

    // Friction

    if (!control_left && !control_right) {
        if (player_x_vel > 0) {
				if (player_on_ground == true) {	
					if (player_x_vel < player_ground_friction * delta_time * timescale) {
						player_x_vel = player_ground_friction * delta_time * timescale;
					} else {
						player_x_vel -= player_ground_friction * delta_time * timescale;
					}
				}
				if (player_on_ground == false) {
					if (player_x_vel < player_air_friction * delta_time * timescale) {
						player_x_vel = player_air_friction * delta_time * timescale;
					} else {
						player_x_vel -= player_air_friction * delta_time * timescale;
					}
				}
        }
        if (player_x_vel < 0) {
			if (player_on_ground == true) {
				if (player_x_vel > -player_ground_friction * delta_time * timescale) {
					player_x_vel = -player_ground_friction * delta_time * timescale
				} else {
					player_x_vel += player_ground_friction * delta_time * timescale
				}
			}
			if (player_on_ground == false) {
				if (player_x_vel > -player_air_friction * delta_time * timescale) {
					player_x_vel = -player_air_friction * delta_time * timescale
				} else {
					player_x_vel += player_air_friction * delta_time * timescale
				}
			}
        }
    }


    // Maximum Velocities

    if (player_x_vel > player_max_x_vel) {
        player_x_vel = player_max_x_vel
    }
    if (player_x_vel < -player_max_x_vel) {
        player_x_vel = -player_max_x_vel
    }
    if (player_y_vel > player_max_y_vel) {
        player_y_vel = player_max_y_vel
    }
    if (player_y_vel < -player_max_y_vel) {
        player_y_vel = -player_max_y_vel
    }

    // Commit x and y Velocities

    player_x += player_x_vel * delta_time * timescale;
    player_y += player_y_vel * delta_time * timescale;


    // Movement Bounderies

    if (player_x < 0) {
        player_x = 0
        player_x_vel = 0
    }
    if (player_x > canvas_width - 150) {
        player_x = canvas_width - 150
        player_x_vel = 0
    }
    if (player_y < 0) {
        player_y = 0
        player_y_vel = 0 - player_y_vel
        if (player_y_vel > 0) {
            player_y_vel = 0
        }
    }
    if (player_y > canvas_height - 150) {
        player_y = canvas_height - 150
        player_y_vel = 0
        player_on_ground = true
    }

	Matter.Body.setPosition(player_physics_object.body, {x:player_x + 150 / 2, y:player_y + 150 / 2}, updateVelocity=true)
}

function draw_player() {

    ctx.drawImage(player, player_x, player_y, 150, 150)

}
