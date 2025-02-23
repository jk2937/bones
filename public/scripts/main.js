if(isServer == false) {
	window.onload = function() {
		Bones.start()
		netplay_init()
	}
} else {
	Bones.start()
}
