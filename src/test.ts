/// <reference path="../phaser/phaser.d.ts" />
/// <reference path="../phaser/phaser.d.ts" />

window.onload = function() {
	
	var padding = 15;
	var game = new Phaser.Game(window.innerWidth - padding, window.innerHeight - padding, Phaser.CANVAS, null, { preload: preload, create: create, update:update });
	var logo: Phaser.Sprite;
	var arr: Array<Phaser.Sprite> = [];
	
	function preload() {
		game.add.plugin(Phaser.Plugin.Debug);
		
		game.load.image("logo", "assets/phaser.png");
	}
	
	function create() {
		for (var n = 0; n < 20; ++n) {
			var sprite = game.add.sprite(0, 0, "logo");
			sprite.anchor.setTo(0.0, 0.0);
			arr[n] = sprite;
		}
		
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		game.input.mouse.capture = true;
		
		// if (game.renderer instanceof PIXI.CanvasRenderer) { }
	}
	
	function update() {
		if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
			logo.position.x += .5;	
		}
		if (game.input.activePointer.isDown) {
			game.input.activePointer.position.copyTo(logo.position);
		}
	}
};
