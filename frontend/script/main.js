/*
 * Copyright 2024 Jonathan Kaschak
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
//function WorldRefresh() {
	
	// BEGIN engine.tick()
	/* touch event debugging:
    for (let i = 0; i < touch_events_history.length; i++) {
        let event_ = touch_events_history[i]
        for (let j = 0; j < event_.touches.length; j++) {
            let touch = event_.touches[j]
            let canvas_position = canvas.getBoundingClientRect();
            let touch_x = touch.clientX - canvas_position.left;
            let touch_y = touch.clientY - canvas_position.top;
            ctx.fillText(event_.type + "\n" + touch.identifier, touch_x, touch_y)
        }
    } */
	// END engine.tick()
// } // END WorldRefresh
// BEGIN MOVE TO engine.js
window.onload = function() {
    Engine.start()
}
