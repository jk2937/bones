dependencies = {
    "box.js": {
        "depends_on": [],
        "required_by": ["world.js", "player.js", "main.js"]
    },
    "player.js": {
        "depends_on": ["box.js", "physics_prop.js", "bones_assets.js"],
        "required_by": ["world.js", "main.js"]
    },
    "menu_item.js": {
        "depends_on": [],
        "required_by": ["world.js", "main.js"]
    },
    "npc.js": {
        "depends_on": [],
        "required_by": ["world.js", "main.js"]
    },
    "world.js": {
            "depends_on": [
            "box.js",
            "player.js",
            "menu_item.js",
            "npc.js",
            "physics_prop.js",
            "bones_renderer.js",
            "bones_assets.js",
            "debug_display.js"
        ],
        "required_by": ["main.js"]
    },
    "bones.js": {
        "depends_on": [],
        "required_by": [
            "physics_prop.js",
            "bones_renderer.js",
            "bones_assets.js",
            "bones_timer.js",
            "bones_input.js",
            "bones_func.js",
            "debug_display.js",
            "main.js"
        ]
    },
    "physics_prop.js": {
        "depends_on": ["bones.js"],
        "required_by": ["main.js", "player.js", "world.js"]
    },
    "bones_renderer.js": {
        "depends_on": ["bones.js"],
        "required_by": [
            "world.js", 
            "bones_input.js", 
            "bones_func.js", 
            "bones_renderer.js"
        ]
    },
    "bones_assets.js": {
        "depends_on": ["bones.js"],
        "required_by": ["player.js", "world.js", "bones_func.js", "main.js"]
    },
    "bones_timer.js": {
        "depends_on": ["bones.js"],
        "required_by": ["bones_func.js", "main.js"]
    },
    "bones_input.js": {
        "depends_on": ["bones.js", "bones_renderer.js"],
        "required_by": ["bones_func.js"]
    },
    "bones_func.js": {
        "depends_on": [
            "bones.js",
            "bones_renderer.js",
            "bones_assets.js",
            "bones_timer.js",
            "bones_input.js",
            "debug_display.js"
        ],
        "required_by": ["main.js"]
    },
    "debug_display.js": {
        "depends_on": ["bones.js"],
        "required_by": ["world.js", "bones_func.js", "main.js"]
    },
    "main.js": {
        "depends_on": [
            "box.js",
            "player.js",
            "menu_item.js",
            "npc.js",
            "world.js",
            "bones.js",
            "physics_prop.js",
            "bones_renderer.js",
            "bones_assets.js",
            "bones_timer.js",
            "bones_func.js",
            "debug_display.js"
        ],
        "required_by": []
    }
}
