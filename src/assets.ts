/// <reference path="../pixi/pixi.js.d.ts" />

//textures
var texture_bunny: PIXI.Texture;
var texture_forest_fill: PIXI.Texture;
var texture_forest_edges: PIXI.Texture;

var raw_terrain: string;

function init_assets(callback) {
	load_image(texture_bunny, "assets/bunny.png");
	load_image(texture_forest_fill, "assets/forest_fill.png");
	load_image(texture_forest_edges, "assets/forest_edges.png");

	load_raw(raw_terrain, "assets/terrain.txt");

	PIXI.loader.load(function(loader, resources) {
		callback();
		
		if (resources.terrain.error) console.log("error occurred while loading resources: " + resources.terrain.error);

		var terrain_arr = JSON.parse(resources.terrain.data).terrain;
		var terrain_container = new TerrainContainer(terrain_arr);
		stage.addChild(terrain_container.container);
	});
}

function load_image(resource: PIXI.Texture, url: string) {
	var obj = PIXI.loader.add(url, url, undefined, function() {
		resource = PIXI.loader.resources[url].texture;
	});
}

function load_raw(resource:string, url: string) {
	var obj = PIXI.loader.add(url, url, undefined, function() {
		resource = PIXI.loader.resources[url].data;
	});
}
