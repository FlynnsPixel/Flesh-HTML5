/// <reference path="../pixi/pixi.js.d.ts" />
var Square = (function () {
    function Square() {
    }
    return Square;
})();
;
var TerrainGeometryType;
(function (TerrainGeometryType) {
    TerrainGeometryType[TerrainGeometryType["FILL"] = 0] = "FILL";
    TerrainGeometryType[TerrainGeometryType["EDGES"] = 1] = "EDGES";
})(TerrainGeometryType || (TerrainGeometryType = {}));
;
var TerrainMesh = (function () {
    function TerrainMesh(json_obj, geometry_type) {
        this.type = geometry_type;
        var fill_indices = json_obj.fill_indices;
        var edge_indices = json_obj.edge_indices;
        var vertices = new Float32Array(json_obj.vertex_data.length);
        for (var n = 0; n < vertices.length; ++n) {
            vertices[n] = json_obj.vertex_data[n];
            //flip all y vertices because of renderer coord system
            if (n % 2 == 1)
                vertices[n] = -vertices[n];
        }
        var indices = new Uint16Array(fill_indices[1]);
        var p = fill_indices[0];
        for (var n = fill_indices[0]; n < fill_indices[1]; ++n) {
            indices[p] = json_obj.indices[n];
            ++p;
        }
        var indices_arr = [];
        p = 0;
        for (var n = 0; n < indices.length; ++n) {
            indices_arr[p] = indices[n];
            if (vertices[indices_arr[p] * 2] >= 10 && vertices[(indices_arr[p] * 2) + 1] >= -8 &&
                vertices[indices_arr[p] * 2] <= 24 && vertices[(indices_arr[p] * 2) + 1] <= 8) {
                p -= n % 3;
                --p;
                n += 2 - (n % 3);
            }
            ++p;
        }
        indices = new Uint16Array(indices_arr);
        var uvs = new Float32Array(json_obj.uvs.length);
        for (var n = 0; n < uvs.length; ++n) {
            uvs[n] = json_obj.uvs[n];
            if (n % 2 == 1)
                uvs[n] = -uvs[n];
        }
        var mesh_fill = new PIXI.mesh.Mesh(forest_fill, vertices, uvs, indices, PIXI.mesh.Mesh.DRAW_MODES.TRIANGLES);
        mesh_fill.scale.set(15.0, 15.0);
        mesh_fill.x = (json_obj.pos[0] * mesh_fill.scale.x) + 0;
        mesh_fill.y = (-json_obj.pos[1] * mesh_fill.scale.y) + 400;
        stage.addChild(mesh_fill);
    }
    return TerrainMesh;
})();
;
var Terrain = (function () {
    function Terrain(json_obj) {
        this.fill_mesh = new TerrainMesh(json_obj, TerrainGeometryType.FILL);
        this.edges_mesh = new TerrainMesh(json_obj, TerrainGeometryType.EDGES);
    }
    return Terrain;
})();
;
var forest_fill;
var forest_edges;
var TerrainContainer = (function () {
    function TerrainContainer(complete_json_data) {
        this.terrain_list = [];
        for (var i = 0; i < complete_json_data.length; ++i) {
            var terrain_obj = complete_json_data[i];
            console.log(terrain_obj);
            var terrain = new Terrain(terrain_obj);
            this.terrain_list.push(terrain);
        }
    }
    return TerrainContainer;
})();
;
var stage;
var renderer;
var padding = 15;
var squares = [];
var square_tex;
var container;
var is_adding;
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
        square.base = new PIXI.Sprite(square_tex);
        square.base.x = Math.random() * renderer.width;
        square.base.y = Math.random() * renderer.height;
        square.angle = Math.random() * Math.PI * 2.0;
        stage.addChild(square.base);
        squares.push(square);
    }
}
window.onload = function () {
    // create a renderer instance
    renderer = PIXI.autoDetectRenderer(400, 300, { antialias: true }, false);
    renderer.backgroundColor = 0x99ff77;
    document.body.appendChild(renderer.view);
    if (renderer instanceof PIXI.CanvasRenderer) {
        console.log("using canvas renderer");
    }
    else {
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
    PIXI.loader.load(function (loader, resources) {
        square_tex = resources.bunny.texture;
        forest_fill = resources.forest_fill.texture;
        forest_edges = resources.forest_edges.texture;
        console.log(resources["bunny"]);
        if (resources.terrain.error)
            console.log("error occurred while loading resources: " + resources.terrain.error);
        var terrain_arr = JSON.parse(resources.terrain.data).terrain;
        var terrain_container = new TerrainContainer(terrain_arr);
    });
};
function mouse_down() {
    is_adding = true;
}
function mouse_up() {
    is_adding = false;
}
setInterval(function () {
    //console.log("fps: " + fps.getFPS() + ", squares: " + squares.length);
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
    setTimeout(game_loop, 1000.0 / 60.0);
    fps.getFPS();
    if (is_adding)
        spawn_square(100);
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
