/// <reference path="../pixi/pixi.js.d.ts" />
var texture_bunny;
var texture_forest_fill;
var texture_forest_edges;
var raw_terrain;
var init_assets_failed = false;
function init_assets(callback) {
    texture_bunny = load_image("assets/bunny.png");
    texture_forest_fill = load_image("assets/forest_fill.png");
    texture_forest_edges = load_image("assets/forest_edges.png");
    raw_terrain = load_raw("assets/terrain.txt");
    PIXI.loader.load(function (loader, resources) {
        //if (resources.terrain.error) console.log("error occurred while loading resources: " + resources.terrain.error);
        callback();
    });
}
function load_image(url) {
    PIXI.loader.add(url, url, undefined, function () {
        var obj = PIXI.loader.resources[url];
        if (obj.error) {
            console.log("error occurred while loading resources: " + obj.error);
            init_assets_failed = true;
        }
    });
    return PIXI.loader.resources[url].texture;
}
function load_raw(url) {
    var resource = { data: "n/a" };
    PIXI.loader.add(url, url, undefined, function () {
        var obj = PIXI.loader.resources[url];
        if (obj.error) {
            console.log("error occurred while loading resources: " + obj.error);
            init_assets_failed = true;
        }
        resource.data = obj.data;
    });
    return resource;
}
