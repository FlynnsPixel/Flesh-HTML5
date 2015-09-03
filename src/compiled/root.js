var Square = (function () {
    function Square() {
    }
    return Square;
})();
;
var stage;
var renderer;
var padding = 15;
var squares = [];
var square_tex;
var container;
var is_adding;
window.onresize = function () {
    resize_canvas();
};
function resize_canvas() {
    var w = window.innerWidth - padding;
    var h = window.innerHeight - padding;
    renderer.view.style.width = w + "px";
    renderer.view.style.height = h + "px";
    renderer.resize(w, h);
    console.log("resize: " + renderer.width + "x" + renderer.height);
}
function spawn_square(amount) {
    for (var n = 0; n < amount; ++n) {
        var square = new Square();
        square.base = new PIXI.Sprite(square_tex);
        square.base.x = Math.random() * renderer.width;
        square.base.y = Math.random() * renderer.height;
        square.angle = Math.random() * Math.PI * 2.0;
        stage.addChild(square.base);
        squares.push(square);
    }
}
window.onload = function () {
    renderer = PIXI.autoDetectRenderer(400, 300, { antialias: true }, false);
    renderer.backgroundColor = 0x99ff77;
    document.body.appendChild(renderer.view);
    if (renderer instanceof PIXI.CanvasRenderer) {
        console.log("using canvas renderer");
    }
    else {
        console.log("using webgl");
    }
    stage = new PIXI.Container();
    resize_canvas();
    container = new PIXI.ParticleContainer(100000, [false, true, false, false, false]);
    stage.addChild(container);
    console.log("initialising assets...");
    init_assets(function () {
        console.log(raw_terrain);
        console.log("assets initialised");
        var terrain_arr = JSON.parse(raw_terrain.data).terrain;
        var terrain_container = new TerrainContainer(terrain_arr);
        stage.addChild(terrain_container.container);
        spawn_square(1);
        game_loop();
        document.ontouchstart = mouse_down;
        document.ontouchend = mouse_up;
        document.onmousedown = mouse_down;
        document.onmouseup = mouse_up;
    });
};
function mouse_down() {
    is_adding = true;
}
function mouse_up() {
    is_adding = false;
}
setInterval(function () {
}, 1000);
var fps = {
    startTime: 0,
    frameNumber: 0,
    getFPS: function () {
        this.frameNumber++;
        var d = new Date().getTime(), currentTime = (d - this.startTime) / 1000, result = Math.floor((this.frameNumber / currentTime));
        if (currentTime > 1) {
            this.startTime = new Date().getTime();
            this.frameNumber = 0;
        }
        return result;
    }
};
function game_loop() {
    setTimeout(game_loop, 1000.0 / 60.0);
    fps.getFPS();
    if (is_adding)
        spawn_square(100);
    for (var n = 0; n < squares.length; ++n) {
        var square = squares[n];
        if (square.base.position.x < 0 || square.base.position.x > renderer.width - square.base.width) {
            square.angle = -square.angle + Math.PI;
        }
        if (square.base.position.y < 0 || square.base.position.y > renderer.height - square.base.height) {
            square.angle = -square.angle;
        }
        square.base.position.x += Math.cos(square.angle) * 4.0;
        square.base.position.y += Math.sin(square.angle) * 4.0;
    }
    renderer.render(stage);
}
