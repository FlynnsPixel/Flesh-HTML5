/// <reference path="../phaser/phaser.d.ts" />
/// <reference path="../phaser/phaser.d.ts" />
window.onload = function () {
    var padding = 15;
    var game = new Phaser.Game(window.innerWidth - padding, window.innerHeight - padding, Phaser.CANVAS, null, { preload: preload, create: create, update: update });
    var logo;
    function preload() {
        game.add.plugin(Phaser.Plugin.Debug);
        game.load.image("logo", "assets/phaser.png");
    }
    function create() {
        logo = game.add.sprite(0, 0, "logo");
        logo.anchor.setTo(0.0, 0.0);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.input.mouse.capture = true;
        if (game.renderer instanceof PIXI.CanvasRenderer) {
            logo.position.x = 40;
        }
        else {
            logo.position.x = 400;
        }
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
