/// <reference path="../pixi/pixi.js.d.ts" />
var texture_bunny;
var texture_forest_fill;
var texture_forest_edges;
var raw_terrain;
function init_assets(callback) {
    load_image(texture_bunny, "assets/bunny.png");
    load_image(texture_forest_fill, "assets/forest_fill.png");
    load_image(texture_forest_edges, "assets/forest_edges.png");
    load_raw(raw_terrain, "assets/terrain.txt");
    PIXI.loader.load(function (loader, resources) {
        callback();
        if (resources.terrain.error)
            console.log("error occurred while loading resources: " + resources.terrain.error);
        var terrain_arr = JSON.parse(resources.terrain.data).terrain;
        var terrain_container = new TerrainContainer(terrain_arr);
        stage.addChild(terrain_container.container);
    });
}
function load_image(resource, url) {
    var obj = PIXI.loader.add(url, url, undefined, function () {
        resource = PIXI.loader.resources[url].texture;
    });
}
function load_raw(resource, url) {
    var obj = PIXI.loader.add(url, url, undefined, function () {
        resource = PIXI.loader.resources[url].data;
    });
}
