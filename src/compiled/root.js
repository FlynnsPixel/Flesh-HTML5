/// <reference path="../lib-ts/pixi.js.d.ts" />
/// <reference path="../lib-ts/box2d.ts.d.ts"/>
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
var container;
var is_adding;
var dest_scale = 1;
var game_layer;
var ui_layer;
var world;
var bunny;
var ground_body;
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
        square.base = new PIXI.Sprite(texture_bunny);
        square.base.x = Math.random() * renderer.width;
        square.base.y = Math.random() * renderer.height;
        square.angle = Math.random() * Math.PI * 2.0;
        container.addChild(square.base);
        squares.push(square);
    }
}
window.onload = function () {
    renderer = new PIXI.WebGLRenderer(400, 300, { antialias: false });
    renderer.backgroundColor = 0x99ff77;
    document.body.appendChild(renderer.view);
    stage = new PIXI.Container();
    game_layer = new PIXI.Container();
    ui_layer = new PIXI.Container();
    stage.addChild(game_layer);
    stage.addChild(ui_layer);
    resize_canvas();
    container = new PIXI.ParticleContainer(100000, [false, true, false, false, false]);
    game_layer.addChild(container);
    console.log("initialising assets...");
    init_assets(function () {
        console.log("assets initialised");
        var terrain_arr = JSON.parse(raw_terrain).terrain;
        var terrain_container = new TerrainContainer(terrain_arr);
        game_layer.addChild(terrain_container.container);
        game_layer.x = renderer.width / 2.0;
        game_layer.y = renderer.height / 2.0;
        game_layer.pivot.x = game_layer.width / 2.0;
        game_layer.pivot.y = game_layer.height / 2.0;
        document.ontouchstart = mouse_down;
        document.ontouchend = mouse_up;
        document.onmousedown = mouse_down;
        document.onmouseup = mouse_up;
        document.onkeydown = key_down;
        bunny = new PIXI.Sprite(texture_bunny);
        stage.addChild(bunny);
        world = new box2d.b2World(new box2d.b2Vec2(0.0, 960.0));
        var body_def = new box2d.b2BodyDef();
        body_def.position.SetXY(0.0, 400.0);
        var body = world.CreateBody(body_def);
        var box_shape = new box2d.b2PolygonShape();
        box_shape.SetAsBox(50.0, 10.0);
        var fixture = new box2d.b2FixtureDef();
        fixture.shape = box_shape;
        body.CreateFixture(fixture);
        var ground_body_def = new box2d.b2BodyDef();
        ground_body_def.type = box2d.b2BodyType.b2_dynamicBody;
        ground_body_def.position.SetXY(0, 4);
        ground_body = world.CreateBody(ground_body_def);
        var ground_box_shape = new box2d.b2PolygonShape();
        ground_box_shape.SetAsBox(1, 1);
        var ground_fixture = new box2d.b2FixtureDef();
        ground_fixture.shape = ground_box_shape;
        ground_body.m_mass = 1000;
        ground_body.CreateFixture(ground_fixture);
        spawn_square(1);
        game_loop();
        var graphics = new PIXI.Graphics();
        graphics.beginFill(0xff0000);
        var arr = [];
        for (var n = 0; n < box_shape.m_vertices.length; ++n) {
            arr[n] = new PIXI.Point();
            arr[n].x = box_shape.m_vertices[n].x;
            arr[n].y = box_shape.m_vertices[n].y;
        }
        graphics.drawPolygon(arr);
        graphics.endFill();
        stage.addChild(graphics);
    });
};
function key_down(e) {
    e = e || window.event;
    if (e.keyCode == 187) {
        dest_scale += .1;
    }
    else if (e.keyCode == 189) {
        dest_scale -= .1;
    }
    dest_scale = (dest_scale < .5) ? .5 : dest_scale;
    dest_scale = (dest_scale > 2) ? 2 : dest_scale;
}
function mouse_down() {
    is_adding = true;
}
function mouse_up() {
    is_adding = false;
}
setInterval(function () {
    console.log("fps: " + fps.getFPS() + ", squares: " + squares.length);
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
    var time_step = 1.0 / 60.0;
    var vel_iterations = 6;
    var pos_iterations = 2;
    world.Step(time_step, vel_iterations, pos_iterations);
    var pos = ground_body.GetPosition();
    var angle = ground_body.GetAngleRadians();
    bunny.position.x = pos.x;
    bunny.position.y = pos.y;
    game_layer.scale.x -= (game_layer.scale.x - dest_scale) / 4.0;
    game_layer.scale.y -= (game_layer.scale.y - dest_scale) / 4.0;
    setTimeout(game_loop, 1000.0 / 60.0);
    fps.getFPS();
    if (is_adding) {
        spawn_square(100);
    }
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
