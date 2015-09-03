/// <reference path="../pixi/pixi.js.d.ts" />

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
