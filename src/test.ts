/// <reference path="../pixi/pixi.js.d.ts" />

class Square {
	
	base: PIXI.Sprite;
	angle: number;
};

enum TerrainGeometryType {
	FILL, 
	EDGES
};

class TerrainMesh {
	
	mesh: PIXI.mesh.Mesh;
	type: TerrainGeometryType;
	parent: Terrain;
	
	dynamic_vertices: number[];
	dynamic_indices: number[];
	dynamic_uvs: number[];
	
	private static_vertices: Float32Array[];
	private static_indices: Uint16Array[];
	private static_uvs: Float32Array[];
	
	private tex: PIXI.Texture;
	
	constructor(parent_obj: Terrain, json_obj, geometry_type: TerrainGeometryType) {
		this.parent = parent_obj;
		this.type = geometry_type;
		
		var indices_arr;
		switch (this.type) {
			case TerrainGeometryType.FILL:
				indices_arr = json_obj.fill_indices;
				this.tex = forest_fill;
				break;
			case TerrainGeometryType.EDGES:
				indices_arr = json_obj.edge_indices;
				this.tex = forest_edges;
				break;
		}
		var indices_start = indices_arr[0];
		var indices_size = indices_arr[1];
		
		var vertices = new Float32Array(json_obj.vertex_data.length);
		for (var n = 0; n < vertices.length; ++n) {
			vertices[n] = json_obj.vertex_data[n];
			//flip all y vertices because of renderer coord system
			if (n % 2 == 1) vertices[n] = -vertices[n];
		}
		var indices = new Uint16Array(indices_size);
		for (var n: number = 0; n < indices_size; ++n) {
			indices[n] = json_obj.indices[indices_start + n];
		}
		
		var uvs = new Float32Array(json_obj.uvs.length);
		for (var n = 0; n < uvs.length; ++n) {
			uvs[n] = json_obj.uvs[n];
			//flip all y uvs because of renderer coord system
			if (n % 2 == 1) uvs[n] = -uvs[n];
		}
		this.mesh = new PIXI.mesh.Mesh(this.tex, vertices, uvs, indices, PIXI.mesh.Mesh.DRAW_MODES.TRIANGLES);
		this.mesh.scale.set(15.0, 15.0);
		this.mesh.x = (json_obj.pos[0] * this.mesh.scale.x) + 0;
		this.mesh.y = (-json_obj.pos[1] * this.mesh.scale.y) + 400;
		this.parent.container.addChild(this.mesh);
	}
	
	get_tex(): PIXI.Texture { return this.tex; }
	get_static_vertices(): Float32Array[] { return this.static_vertices; }
	get_static_indices(): Uint16Array[] { return this.static_indices; }
	get_static_uvs(): Float32Array[] { return this.static_uvs; }
};

class Terrain {
	
	fill_mesh: TerrainMesh;
	edges_mesh: TerrainMesh;
	container: PIXI.Container;
	parent: TerrainContainer;
	
	public constructor(parent_obj: TerrainContainer, json_obj) {
		this.parent = parent_obj;
		this.container = new PIXI.Container();
		this.parent.container.addChild(this.container);
		
		this.fill_mesh = new TerrainMesh(this, json_obj, TerrainGeometryType.FILL);
		this.edges_mesh = new TerrainMesh(this, json_obj, TerrainGeometryType.EDGES);
	}
};

var forest_fill: PIXI.Texture;
var forest_edges: PIXI.Texture;

class TerrainContainer {
	
	terrain_list: Terrain[] = [];
	container: PIXI.Container;
	
	constructor(complete_json_data) {
		this.container = new PIXI.Container();
		
		for (var i = 0; i < complete_json_data.length; ++i) {
			var terrain_obj = complete_json_data[i];
			console.log(terrain_obj);
			var terrain = new Terrain(this, terrain_obj);
			this.terrain_list.push(terrain);
		}
	}
};

var stage: PIXI.Container;
var renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer;
const padding = 15;
var squares: Square[] = [];
var square_tex: PIXI.Texture;
var container: PIXI.ParticleContainer;
var is_adding: boolean;

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
		square.base = new PIXI.Sprite(square_tex);
		
		square.base.x = Math.random() * renderer.width;
		square.base.y = Math.random() * renderer.height;
		
		square.angle = Math.random() * Math.PI * 2.0;
		
		stage.addChild(square.base);
		squares.push(square);
	}
}

window.onload = function() {
	// create a renderer instance
	renderer = PIXI.autoDetectRenderer(400, 300, {antialias: true}, false);
	renderer.backgroundColor = 0x99ff77;
	document.body.appendChild(renderer.view);
	
	if (renderer instanceof PIXI.CanvasRenderer) {
		console.log("using canvas renderer");
	}else {
		console.log("using webgl");
	}
	
	stage = new PIXI.Container();
	container = new PIXI.ParticleContainer(100000, [false, true, false, false, false]);
	stage.addChild(container);
	
	PIXI.loader.add("bunny", "assets/bunny.png");
	
	spawn_square(1);
	resize_canvas();
	game_loop();
	
	document.ontouchstart = mouse_down;
	document.ontouchend = mouse_up;
	document.onmousedown = mouse_down;
	document.onmouseup = mouse_up;
	
	PIXI.loader.add("forest_fill", "assets/forest_fill.png");
	PIXI.loader.add("forest_edges", "assets/forest_edges.png");
	
	PIXI.loader.add("terrain", "assets/terrain.txt");
	PIXI.loader.load(function(loader, resources) {
		square_tex = resources.bunny.texture;
		forest_fill = resources.forest_fill.texture;
		forest_edges = resources.forest_edges.texture;
		console.log(resources["bunny"]);
		
		if (resources.terrain.error) console.log("error occurred while loading resources: " + resources.terrain.error);
		
		var terrain_arr = JSON.parse(resources.terrain.data).terrain;
		var terrain_container = new TerrainContainer(terrain_arr);
		stage.addChild(terrain_container.container);
	});
}

function mouse_down() {	
	is_adding = true;
}

function mouse_up() {
	is_adding = false;
}

setInterval(function() {
	//console.log("fps: " + fps.getFPS() + ", squares: " + squares.length);
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
	if (is_adding) spawn_square(100);
	
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