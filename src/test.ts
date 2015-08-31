/// <reference path="../phaser/phaser.d.ts" />

window.onload = function() {
	
	var game = new Phaser.Game(800, 600, Phaser.AUTO, null, { preload: preload, create: create, update:update });
	var logo: Phaser.Sprite;
	
	function preload() {
		game.load.image("logo", "phaser.png");
	}
	
	function create() {
		logo = game.add.sprite(0, 0, "logo");
		logo.anchor.setTo(0.0, 0.0);
		
		game.physics.startSystem(Phaser.Physics.ARCADE);
	}
	
	function update() {
		logo.position.x = (Math.cos(game.time.now / 60.0) + 1) * 40.0;
	}
};
