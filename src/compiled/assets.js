/// <reference path="../pixi/pixi.js.d.ts" />
var texture_bunny;
var texture_forest_fill;
var texture_forest_edges;
var raw_terrain;
var init_assets_failed = false;
var arr;
function init_assets(callback) {
    load_tex("assets/bunny.png", function (tex) { texture_bunny = tex; });
    load_tex("assets/forest_fill.png", function (tex) { texture_forest_fill = tex; });
    load_tex("assets/forest_edges.png", function (tex) { texture_forest_edges = tex; });
    load_raw("assets/terrain4.txt", function (raw) { raw_terrain = raw; });
    PIXI.loader.load(function (loader, resources) {
        callback();
    });
}
function load_tex(url, callback) {
    PIXI.loader.add(url, url, undefined, function () {
        var obj = PIXI.loader.resources[url];
        if (obj.error) {
            console.log("error occurred while loading resources: " + obj.error);
            init_assets_failed = true;
        }
        callback(obj.texture);
    });
}
function load_raw(url, callback) {
    PIXI.loader.add(url, url, undefined, function () {
        var obj = PIXI.loader.resources[url];
        if (obj.error) {
            console.log("error occurred while loading resources: " + obj.error);
            init_assets_failed = true;
        }
        callback(obj.data);
    });
}
