/// <reference path="../phaser/phaser.comments.d.ts" />
var Square = (function () {
    function Square() {
    }
    return Square;
})();
;
window.onload = function () {
    var padding = 15;
    var game = new Phaser.Game(window.innerWidth - padding, window.innerHeight - padding, Phaser.CANVAS, null, { preload: preload, create: create, update: update, render: render });
    var logo;
    var arr = [];
    var button;
    var debug_text;
    var game_layer;
    var ui_layer;
    var batch;
    var canvas;
    var context;
    window.onresize = function () {
        resize_game();
    };
    function resize_game() {
        game.scale.setGameSize(window.innerWidth - padding, window.innerHeight - padding);
        game.paused = false;
    }
    function preload() {
        game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        game.scale.forceOrientation(true, false);
        game.scale.refresh();
        resize_game();
        //game.add.plugin(Phaser.Plugin.Debug);
        game.load.image("square", "assets/square.png");
        game.load.spritesheet("fullscreen_button", "assets/button_sprite_sheet.png", 193, 71);
        game.load.bitmapFont("nokia", "assets/fonts/nokia16.png", "assets/fonts/nokia16.xml");
    }
    function create() {
        batch = game.add.spriteBatch(null, "batch", true);
        game_layer = game.add.group();
        game_layer.z = 0;
        ui_layer = game.add.group();
        ui_layer.z = 1;
        button = new Phaser.Button(game, 0, 0, "fullscreen_button", function () {
            game.scale.isFullScreen ? game.scale.stopFullScreen() : game.scale.startFullScreen();
        }, this, 2, 1, 0);
        ui_layer.add(button);
        debug_text = new Phaser.BitmapText(game, 0, 70, "nokia", "n/a");
        ui_layer.add(debug_text);
        game.time.advancedTiming = true;
        spawn_squares(1);
        //game.physics.startSystem(Phaser.Physics.ARCADE);
        game.input.mouse.capture = true;
        // if (game.renderer instanceof PIXI.CanvasRenderer) { }
        canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 64;
        context = canvas.getContext("2d");
        context.fillStyle = "#ff0000";
        context.fillRect(0, 0, 64, 64);
    }
    function spawn_squares(num) {
        for (var n = 0; n < num; ++n) {
            var square = new Square();
            square.base = game.add.sprite(Math.random() * game.width, Math.random() * game.height, "square");
            square.base.anchor.setTo(0.0, 0.0);
            //batch.add(square.base);
            game_layer.add(square.base);
            square.angle = Math.random() * Math.PI * 2.0;
            arr.push(square);
        }
    }
    function update() {
        debug_text.text = "fps: " + game.time.fps + "\nspawned: " + arr.length;
        debug_text.update();
        for (var n = 0; n < arr.length; ++n) {
            var square = arr[n];
            if (square.base.position.x < 0 || square.base.position.x > game.width - square.base.width) {
                square.angle = -square.angle + Math.PI;
            }
            if (square.base.position.y < 0 || square.base.position.y > game.height - square.base.height) {
                square.angle = -square.angle;
            }
            square.base.position.x += Math.cos(square.angle) * 4.0;
            square.base.position.y += Math.sin(square.angle) * 4.0;
        }
        //if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) { }
        if (game.input.activePointer.isDown) {
            spawn_squares(5);
        }
    }
    function render() {
        //context.drawImage(canvas, 0, 0);
        requestAnimationFrame(render);
    }
};
