
class Square {

	base: PIXI.Sprite;
	angle: number;
};

var stage: PIXI.Container;
var renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer;
const padding = 15;
var squares: Square[] = [];
var container: PIXI.ParticleContainer;
var is_adding: boolean;
var render_sprite;

window.onresize = function() {
	resize_canvas();
}
function resize_canvas() {
	var w = window.innerWidth - padding;
	var h = window.innerHeight - padding;
	renderer.view.style.width = w + "px";
	renderer.view.style.height = h + "px";
	renderer.resize(w, h);
	console.log("resize: " + renderer.width + "x" + renderer.height);
}

function spawn_square(amount: number) {
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

window.onload = function() {
	// create a renderer instance
	renderer = new PIXI.WebGLRenderer(400, 300, {antialias: false});
	renderer.backgroundColor = 0x99ff77;
	document.body.appendChild(renderer.view);

	stage = new PIXI.Container();

	resize_canvas();

	container = new PIXI.ParticleContainer(100000, [false, true, false, false, false]);
	stage.addChild(container);

	console.log("initialising assets...");
	init_assets(function() {
		console.log("assets initialised");

		var terrain_arr = JSON.parse(raw_terrain).terrain;
		var terrain_container = new TerrainContainer(terrain_arr);

		var render_tex: PIXI.RenderTexture;
		render_tex = new PIXI.RenderTexture(renderer, terrain_container.width, terrain_container.height);
		var c = new PIXI.Container();
		var bg = new PIXI.Sprite(texture_forest_fill);
		bg.scale.x = 80;
		bg.scale.y = 80;
		c.addChild(bg);
		c.addChild(terrain_container.container);
		render_tex.render(c, null, true);
		render_sprite = new PIXI.Sprite(render_tex);
		stage.addChild(render_sprite);
		render_sprite.pivot.x = terrain_container.width / 2.0;
		render_sprite.pivot.y = terrain_container.height / 2.0;
		render_sprite.position.x = renderer.width / 2.0;
		render_sprite.position.y = renderer.height / 2.0;

		spawn_square(1);
		game_loop();

		document.ontouchstart = mouse_down;
		document.ontouchend = mouse_up;
		document.onmousedown = mouse_down;
		document.onmouseup = mouse_up;
	});
}

function mouse_down() {
	is_adding = true;
}

function mouse_up() {
	is_adding = false;
}

setInterval(function() {
	console.log("fps: " + fps.getFPS() + ", squares: " + squares.length);
}, 1000);

var fps = {
	startTime : 0,
	frameNumber : 0,
	getFPS : function(){
		this.frameNumber++;
		var d = new Date().getTime(),
			currentTime = ( d - this.startTime ) / 1000,
			result = Math.floor( ( this.frameNumber / currentTime ) );

		if( currentTime > 1 ){
			this.startTime = new Date().getTime();
			this.frameNumber = 0;
		}
		return result;

	}
};

function game_loop() {
	setTimeout(game_loop, 1000.0 / 60.0);

	fps.getFPS();
	if (is_adding) {
		//spawn_square(100);
		render_sprite.scale.x -= .01;
		render_sprite.scale.y -= .01;
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
