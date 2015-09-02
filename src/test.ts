/// <reference path="../phaser/phaser.comments.d.ts" />

class Square {
	
	base: Phaser.Sprite;
	angle: number;
};

window.onload = function() {
	
	var padding = 15;
	var game = new Phaser.Game(window.innerWidth - padding, window.innerHeight - padding, Phaser.CANVAS, null, { preload: preload, create: create, update: update });
	var button: Phaser.Button;
	var debug_text: Phaser.BitmapText;
	var game_layer: Phaser.Group;
	var ui_layer: Phaser.Group;
	var batch: Phaser.SpriteBatch;
	var cat: Phaser.Sprite;
	var dest_scale: number = 1;
	
	window.onresize = function() {
		resize_game();
	}
	function resize_game() {
		game.scale.setGameSize(window.innerWidth - padding, window.innerHeight - padding);
		game.paused = false;
		game.world.setBounds(-game.width * 2.0, -game.height * 2.0, game.width * 4.0, game.height * 4.0);
	}
	
	function preload() {
		game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
		game.scale.forceOrientation(true, false);
		game.scale.refresh();
		
		resize_game();
		
		//game.add.plugin(Phaser.Plugin.Debug);
		
		game.load.image("cat_base", "assets/chars/cat_base.png");
		game.load.spritesheet("fullscreen_button", "assets/button_sprite_sheet.png", 193, 71);
		game.load.bitmapFont("nokia", "assets/fonts/nokia16.png", "assets/fonts/nokia16.xml");
	}
	
	function create() {
		batch = game.add.spriteBatch(null, "batch", true);
		game_layer = game.add.group();
		game_layer.z = 0;
		ui_layer = game.add.group();
		ui_layer.z = 1;
		
		button = new Phaser.Button(game, 0, 0, "fullscreen_button", function() {
			game.scale.isFullScreen ? game.scale.stopFullScreen() : game.scale.startFullScreen();
		}, this, 2, 1, 0);
		ui_layer.add(button);
		
		debug_text = new Phaser.BitmapText(game, 0, 70, "nokia", "n/a");
		ui_layer.add(debug_text);
		game.time.advancedTiming = true;
		
		//game.physics.startSystem(Phaser.Physics.ARCADE);
		
		cat = new Phaser.Sprite(game, 200, 400, "cat_base");
		game_layer.add(cat);
		
		//game.physics.startSystem(Phaser.Physics.P2JS);
    	//game.physics.p2.enable(cat);
		
		game_layer.pivot.x = game.width * .5;
		game_layer.pivot.y = game.height * .5;
		game_layer.x = game.width * .5;
		game_layer.y = game.height * .5;
	}
	
	function update() {
		debug_text.text = "fps: " + game.time.fps;
		debug_text.update();
		
		if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
			//game.world.camera.position.x += 1;
			cat.body.velocity.x = 400;
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.UNDERSCORE)) {
			dest_scale -= .04;
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.EQUALS)) {
			dest_scale += .04;
		}
		dest_scale = Phaser.Math.clamp(dest_scale, .2, 4.0);
		game_layer.scale.x -= (game_layer.scale.x - dest_scale) / 4.0;
		game_layer.scale.y -= (game_layer.scale.y - dest_scale) / 4.0;
	}
};
