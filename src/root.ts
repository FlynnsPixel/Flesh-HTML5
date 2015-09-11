/// <reference path="../lib-ts/pixi.js.d.ts" />

var stage: PIXI.Container;
var renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer;
const padding = 15;
var container: PIXI.ParticleContainer;
var is_adding: boolean;
var dest_scale: number = 1;
var game_layer: PIXI.Container;
var debug_layer: PIXI.Container;
var ui_layer: PIXI.Container;
var terrain_container: TerrainContainer;

var ground: PhysicsObject;
var box1: PhysicsObject;
var box2: PhysicsObject;

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

window.onload = function() {
	// create a renderer instance
	renderer = new PIXI.WebGLRenderer(400, 300, {antialias: false});
	renderer.backgroundColor = 0x99ff77;
	document.body.appendChild(renderer.view);

	stage = new PIXI.Container();
	game_layer = new PIXI.Container();
	debug_layer = new PIXI.Container();
	ui_layer = new PIXI.Container();
	stage.addChild(game_layer);
	stage.addChild(debug_layer);
	stage.addChild(ui_layer);

	resize_canvas();

	container = new PIXI.ParticleContainer(100000, [false, true, false, false, false]);
	game_layer.addChild(container);

	init_assets(function() {
		init_physics();
		init_input();

		create_player();

		var terrain_arr = JSON.parse(raw_terrain).terrain;
		terrain_container = new TerrainContainer(terrain_arr);
		game_layer.addChild(terrain_container.container);
		game_layer.x = renderer.width / 2.0;
		game_layer.y = renderer.height / 2.0;
		game_layer.pivot.x = (game_layer.width / 2.0);
		game_layer.pivot.y = (game_layer.height / 2.0);
		debug_layer.x = game_layer.x;
		debug_layer.y = game_layer.y;
		debug_layer.pivot.x = game_layer.pivot.x;
		debug_layer.pivot.y = game_layer.pivot.y;

		ground = new PhysicsObject();
		//ground.create_box(100, 400);
		ground.set_pos(0 + game_layer.pivot.x - game_layer.x, 400 + game_layer.pivot.y - game_layer.y);
		ground.body.SetAngle(-55 / (180 / Math.PI));

		box1 = new PhysicsObject(PhysicsBodyType.DYNAMIC);
		box1.create_circle(16);
		box1.body.ResetMassData();
		box1.body.SetFixedRotation(true);
		box1.set_pos(400 + game_layer.pivot.x - game_layer.x, 200 + game_layer.pivot.y - game_layer.y);

		box2 = new PhysicsObject(PhysicsBodyType.DYNAMIC);
		box2.create_box(32, 32);
		box2.fixture.SetDensity(.5);
		box2.fixture.SetFriction(.5);
		box2.fixture.SetRestitution(.4);
		box2.body.ResetMassData();
		box2.set_pos(250 + game_layer.pivot.x - game_layer.x, game_layer.pivot.y - game_layer.y);

		game_loop();
	});
}

function remove_circle_chunk_mesh(x: number, y: number, radius: number, mesh: TerrainMesh) {
	var verts = mesh.dynamic_vertices;
	var indices = mesh.dynamic_indices;

	for (var n = 0; n < indices.length; ++n) {
		var c_x = (verts[indices[n] * 2] + mesh.parent.pos.x) * mesh.parent.parent.get_scale();
		var c_y = (verts[(indices[n] * 2) + 1] + mesh.parent.pos.y) * mesh.parent.parent.get_scale();
		var dist = Math.sqrt(Math.pow(c_x - x, 2) + Math.pow(c_y - y, 2));
		if (dist < radius) {
			indices.splice(n - (n % 3), 3);
			n -= (n % 3) + 1;
		}
	}

	mesh.update_indices();
}

function remove_circle_chunk(x: number, y: number, radius: number) {
	for (var i = 0; i < terrain_container.terrain_list.length; ++i) {
		remove_circle_chunk_mesh(x, y, radius, terrain_container.terrain_list[i].fill_mesh);
		remove_circle_chunk_mesh(x, y, radius, terrain_container.terrain_list[i].edges_mesh);
		terrain_container.terrain_list[i].recalc_collider_points();
	}
}

var fps = 0;
var fps_accum = 0;
var ms_accum = 0;
var frame_count = 0;
var dt = 0;
var time_step = 1.0 / 60.0;
var time_since_startup = 0;
setInterval(function() {
	console.log("fps: " + Math.round(fps_accum / frame_count) + ", ms: " + Math.round(ms_accum / frame_count));
	fps_accum = 0;
	ms_accum = 0;
	frame_count = 0;
}, 1000);

setInterval(function() {
	var x = box1.body.GetPosition().x / B2_METERS;
	var y = box1.body.GetPosition().y / B2_METERS;
	var radius = 70;
	remove_circle_chunk(x, y, radius);
}, 2000);

function game_loop() {
	var start_time = new Date().getTime();
	//terrain_container.debug_draw_all();

	if (is_key_down(KeyCode.EQUALS)) {
		dest_scale += .1;
	}else if (is_key_down(KeyCode.DASH)) {
		dest_scale -= .1;
	}
	if (mouse_wheel_moving) {
		dest_scale += (mouse_wheel_delta_y / Math.abs(mouse_wheel_delta_y)) * .1;
	}

	dest_scale = (dest_scale < .1 ) ? .1 : dest_scale;
	dest_scale = (dest_scale > 2) ? 2 : dest_scale;

	game_layer.scale.x -= (game_layer.scale.x - dest_scale) / 4.0;
	game_layer.scale.y -= (game_layer.scale.y - dest_scale) / 4.0;
	debug_layer.scale = game_layer.scale;

	renderer.render(stage);

	dt = new Date().getTime() - start_time;
	fps = 60;
	if (dt >= time_step * 1000.0) fps = 1000.0 / dt;
	fps_accum += fps;
	ms_accum += dt;
	++frame_count;
	time_since_startup += dt;
	if (dt >= time_step * 1000.0) {
		setTimeout(game_loop, 0);
	}else {
		setTimeout(game_loop, (time_step * 1000.0) - dt);
	}

	update_physics();
	update_entities();
	update_input();
}
