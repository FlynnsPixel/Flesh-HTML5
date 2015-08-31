/// <reference path="../phaser/phaser.d.ts" />
/// <reference path="../phaser/phaser.d.ts" />
var Square = (function () {
    function Square() {
    }
    return Square;
})();
;
window.onload = function () {
    var padding = 15;
    var game = new Phaser.Game(window.innerWidth - padding, window.innerHeight - padding, Phaser.CANVAS, null, { preload: preload, create: create, update: update });
    var logo;
    var arr = [];
    function preload() {
        game.add.plugin(Phaser.Plugin.Debug);
        game.load.image("square", "assets/square.png");
    }
    function spawn_squares(num) {
        for (var n = 0; n < num; ++n) {
            var square = new Square();
            square.base = game.add.sprite(Math.random() * game.width, Math.random() * game.height, "square");
            square.angle = Math.random() * Math.PI * 2.0;
            square.base.anchor.setTo(0.0, 0.0);
            arr.push(square);
        }
    }
    function create() {
        spawn_squares(1);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.input.mouse.capture = true;
        // if (game.renderer instanceof PIXI.CanvasRenderer) { }
    }
    function update() {
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
};
