/// <reference path="../pixi/pixi.js.d.ts" />

var forest_fill: PIXI.Texture;
var forest_edges: PIXI.Texture;

enum TerrainGeometryType {
	FILL,
	EDGES
};

class EdgeNode {

	id: number;
	x: number;
	y: number;
};

/**
* terrain mesh handles a geometric part of a
* terrain object (either fill or edges).
* it contains vertices, indices, uvs and a texture
* which can all be modified.
* a terrain mesh is generally only part of a terrain object
**/
class TerrainMesh {

	mesh: PIXI.mesh.Mesh;
	type: TerrainGeometryType;
	parent: Terrain;

	dynamic_vertices: number[] = [];
	dynamic_indices: number[] = [];
	dynamic_uvs: number[] = [];

	private static_vertices: Float32Array;
	private static_indices: Uint16Array;
	private static_uvs: Float32Array;

	private tex: PIXI.Texture;

	private collider_index: number;

	/**
	* constructs the geometry of the passed in vertices, indices, uvs, ect
	* which is specified with a json object (go to terrain container for more information)
	**/
	constructor(parent_obj: Terrain, json_obj, geometry_type: TerrainGeometryType) {
		this.parent = parent_obj;
		this.type = geometry_type;

		var indices_arr;
		switch (this.type) {
			case TerrainGeometryType.FILL:
				indices_arr = json_obj.fill_indices;
				this.tex = texture_forest_fill;
				break;
			case TerrainGeometryType.EDGES:
				indices_arr = json_obj.edge_indices;
				this.tex = texture_forest_edges;
				break;
		}
		var indices_start = indices_arr[0];
		var indices_size = indices_arr[1];

		if (this.type == TerrainGeometryType.EDGES) indices_size = 1;

		//calculates the min and max indices.
		//the maximum index is the maximum vertex value referenced, whereas
		//minimum is the minimum vertex value referenced.
		//therefore, we only need a vertex and uv array within these bounds (max - min)
		var min_i = 10000;
		var max_i = -10000;
		for (var n: number = 0; n < indices_size; ++n) {
			var i = json_obj.indices[indices_start + n];
			min_i = i < min_i ? i : min_i;
			max_i = i > max_i ? i : max_i;
		}

		this.static_vertices = new Float32Array(((max_i - min_i) * 2) + 2);
		var vertices = this.static_vertices;
		for (var n = 0; n < vertices.length; ++n) {
		  vertices[n] = json_obj.vertex_data[(min_i * 2) + n];
			//flip all y vertices because of renderer coord system
			if (n % 2 == 1) vertices[n] = -vertices[n];
			this.dynamic_vertices[n] = vertices[n];
		}

		this.static_indices = new Uint16Array(indices_size);
		var indices = this.static_indices;
		for (var n: number = 0; n < indices_size; ++n) {
			indices[n] = json_obj.indices[indices_start + n] - min_i;
			this.dynamic_indices[n] = indices[n];
		}

		this.static_uvs = new Float32Array(((max_i - min_i) * 2) + 2);
		var uvs = this.static_uvs;
		for (var n = 0; n < uvs.length; ++n) {
			uvs[n] = json_obj.uvs[(min_i * 2) + n];
			//flip all y uvs because of renderer coord system
			if (n % 2 == 1) uvs[n] = -uvs[n];
			this.dynamic_uvs[n] = uvs[n];
		}

		if (this.type == TerrainGeometryType.FILL) {
			this.recalc_collider_points();
		}

		this.mesh = new PIXI.mesh.Mesh(this.tex, vertices, uvs, indices, PIXI.mesh.Mesh.DRAW_MODES.TRIANGLES);
		this.mesh.x = this.parent.pos.x;
		this.mesh.y = this.parent.pos.y;
		this.parent.container.addChild(this.mesh);
	}

	recalc_collider_points() {
		this.collider_index = 0;
		for (var n = 0; n < this.dynamic_indices.length; n += 3) {
			var p1 = this.dynamic_indices[n];
			var p2 = this.dynamic_indices[n + 1];
			var p3 = this.dynamic_indices[n + 2];
			var p1_ol = false;
			var p2_ol = false;
			var p3_ol = false;
			var overlapping = false;
			for (var i = 0; i < this.dynamic_indices.length; i += 3) {
				if (i == n) continue;
				var i1 = this.dynamic_indices[i];
				var i2 = this.dynamic_indices[i + 1];
				var i3 = this.dynamic_indices[i + 2];
				if ((p1 == i1 || p1 == i2 || p1 == i3) && (p3 == i1 || p3 == i2 || p3 == i3)) {
					p3_ol = true;
				}else if ((p2 == i1 || p2 == i2 || p2 == i3) && (p3 == i1 || p3 == i2 || p3 == i3)) {
					p2_ol = true;
				}else if ((p1 == i1 || p1 == i2 || p1 == i3) && (p2 == i1 || p2 == i2 || p2 == i3)) {
					p1_ol = true;
				}
			}
			if (!p1_ol || !p2_ol || !p3_ol) {
				if (!p1_ol) this.add_collider_points(p1, p2);
				if (!p2_ol) this.add_collider_points(p2, p3);
				if (!p3_ol) this.add_collider_points(p1, p3);
			}
		}
		this.parent.collider_points.length = this.collider_index;
	}

	private add_collider_points(i1, i2) {
		this.parent.collider_points[this.collider_index] = this.dynamic_vertices[i1 * 2];
		this.parent.collider_points[this.collider_index + 1] = this.dynamic_vertices[(i1 * 2) + 1];
		this.parent.collider_points[this.collider_index + 2] = this.dynamic_vertices[i2 * 2];
		this.parent.collider_points[this.collider_index + 3] = this.dynamic_vertices[(i2 * 2) + 1];
		this.collider_index += 4;
	}

	update_geometry() {
		delete this.static_indices;
		this.static_indices = new Uint16Array(this.dynamic_indices);
		this.mesh.indices = this.static_indices;
	}

	/**
	* draws this mesh in the debug layer, line by line
	* warning: is really slow, should be used carefully
	**/
	debug_draw() {
		var vertices = this.static_vertices;
		var indices = this.static_indices;
		var s = this.parent.parent.get_scale();
		for (var n = 0; n < indices.length; ++n) {
			var i = Number(indices[n]) * 2;
			var x = (Number(vertices[i]) + this.parent.pos.x) * s;
			var y = (Number(vertices[i + 1]) + this.parent.pos.y) * s;
			if (n % 3 == 0) {
				this.parent.graphics.moveTo(x, y);
			}else {
				this.parent.graphics.lineTo(x, y);
			}
			if (n % 3 == 2) {
				i = Number(indices[n - 2]) * 2;
				x = (Number(vertices[i]) + this.parent.pos.x) * s;
				y = (Number(vertices[i + 1]) + this.parent.pos.y) * s;
				this.parent.graphics.lineTo(x, y);
			}
		}
		this.parent.graphics.endFill();
	}

	get_tex(): PIXI.Texture { return this.tex; }
	get_static_vertices(): Float32Array { return this.static_vertices; }
	get_static_indices(): Uint16Array { return this.static_indices; }
	get_static_uvs(): Float32Array { return this.static_uvs; }
};

/**
* terrain class that holds data about a terrain chunk.
* this data includes the fill mesh, edges, collider points
* and the position of the terrain.
* a terrain object is generally only part of a terrain group
**/
class Terrain {

	fill_mesh: TerrainMesh;
	edges_mesh: TerrainMesh;
	container: PIXI.Container;
	parent: TerrainContainer;
	collider_points: number[] = [];
	pos: PIXI.Point = new PIXI.Point(0, 0);
	graphics: PIXI.Graphics = new PIXI.Graphics();
	edge_physics: PhysicsObject;

	/**
	* constructs a terrain object with the specified json object
	* attributes. (go to terrain container for more information)
	**/
	public constructor(parent_obj: TerrainContainer, json_obj) {
		this.parent = parent_obj;
		this.container = new PIXI.Container();
		this.pos.x = json_obj.pos[0];
		this.pos.y = -json_obj.pos[1];

		this.fill_mesh = new TerrainMesh(this, json_obj, TerrainGeometryType.FILL);
		this.edges_mesh = new TerrainMesh(this, json_obj, TerrainGeometryType.EDGES);

		this.edge_physics = new PhysicsObject(PhysicsBodyType.STATIC);
		this.edge_physics.create_edges(this.collider_points, this.parent.get_scale(), this.pos);

		debug_layer.addChild(this.graphics);
	}

	recalc_collider_points() {
		this.fill_mesh.recalc_collider_points();

		this.edge_physics.destroy_all_fixtures();
		this.edge_physics.create_edges(this.collider_points, this.parent.get_scale(), this.pos);
	}

	/**
	* draws the fill mesh and edge mesh of this terrain object in the debug layer
	* warning: is really slow, should be used carefully
	**/
	debug_draw() {
		this.graphics.clear();
		this.graphics.lineStyle(1, 0x0000ff, 1);

		this.fill_mesh.debug_draw();
		this.edges_mesh.debug_draw();
	}
};

/**
* a terrain container holds all terrain objects as well as
* the global terrain properties such as scale
**/
class TerrainContainer {

	terrain_list: Terrain[] = [];
	container: PIXI.Container;
	private scale: number = 20.0;

	/**
	* takes in a json object that contains all data for terrain objects
	* this data is generally exported using a unity ferr2d export script
	**/
	constructor(complete_json_data) {
		this.container = new PIXI.Container();

		//loops through json array and creates a terrain object
		//for each element
		for (var i = 0; i < complete_json_data.length; ++i) {
			var terrain_obj = complete_json_data[i];
			var terrain = new Terrain(this, terrain_obj);
			this.container.addChild(terrain.container);
			this.terrain_list.push(terrain);
		}

		this.container.scale.x *= this.scale;
		this.container.scale.y *= this.scale;
		var bounds = this.container.getBounds();
		bounds.x *= this.scale; bounds.y *= this.scale;
		bounds.width *= this.scale; bounds.height *= this.scale;
	}

	/**
	* draws all terrain object meshes to the debug layer
	* warning: is really slow, should be used carefully
	**/
	debug_draw_all() {
		for (var n = 0; n < this.terrain_list.length; ++n) {
			this.terrain_list[n].debug_draw();
		}
	}

	get_scale(): number { return this.scale; }
};

function calculate_min_max_rect(b1: PIXI.Rectangle, b2: PIXI.Rectangle): PIXI.Rectangle {
	b1.x = (b2.x < b1.x) ? b2.x : b1.x;
	b1.y = (b2.y < b1.y) ? b2.y : b1.y;
	b1.width = (b2.width > b1.width) ? b2.width : b1.width;
	b1.height = (b2.height > b1.height) ? b2.height : b1.height;
	return b1;
}
