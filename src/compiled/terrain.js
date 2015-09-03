/// <reference path="../pixi/pixi.js.d.ts" />
var TerrainGeometryType;
(function (TerrainGeometryType) {
    TerrainGeometryType[TerrainGeometryType["FILL"] = 0] = "FILL";
    TerrainGeometryType[TerrainGeometryType["EDGES"] = 1] = "EDGES";
})(TerrainGeometryType || (TerrainGeometryType = {}));
;
var TerrainMesh = (function () {
    function TerrainMesh(parent_obj, json_obj, geometry_type) {
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
        var vertices = new Float32Array(json_obj.vertex_data.length);
        for (var n = 0; n < vertices.length; ++n) {
            var v = vertices[n];
            v = json_obj.vertex_data[n];
            if (n % 2 == 1) {
                v = -v;
                this.parent.min.y = (v < this.parent.min.y) ? v : this.parent.min.y;
                this.parent.max.y = (v > this.parent.max.y) ? v : this.parent.max.y;
            }
            this.parent.min.x = (v < this.parent.min.x) ? v : this.parent.min.x;
            this.parent.max.x = (v > this.parent.max.x) ? v : this.parent.max.x;
            vertices[n] = v;
        }
        var indices = new Uint16Array(indices_size);
        for (var n = 0; n < indices_size; ++n) {
            indices[n] = json_obj.indices[indices_start + n];
        }
        var uvs = new Float32Array(json_obj.uvs.length);
        for (var n = 0; n < uvs.length; ++n) {
            uvs[n] = json_obj.uvs[n];
            if (n % 2 == 1)
                uvs[n] = -uvs[n];
        }
        this.mesh = new PIXI.mesh.Mesh(this.tex, vertices, uvs, indices, PIXI.mesh.Mesh.DRAW_MODES.TRIANGLES);
        this.mesh.scale.set(this.parent.scale, this.parent.scale);
        this.mesh.x = json_obj.pos[0] * this.parent.scale;
        this.mesh.y = -json_obj.pos[1] * this.parent.scale;
        this.parent.container.addChild(this.mesh);
        console.log(this.parent.min.x + ", " + this.parent.min.y + " | " + this.parent.max.x + ", " + this.parent.max.y);
    }
    TerrainMesh.prototype.get_tex = function () { return this.tex; };
    TerrainMesh.prototype.get_static_vertices = function () { return this.static_vertices; };
    TerrainMesh.prototype.get_static_indices = function () { return this.static_indices; };
    TerrainMesh.prototype.get_static_uvs = function () { return this.static_uvs; };
    return TerrainMesh;
})();
;
var Terrain = (function () {
    function Terrain(parent_obj, json_obj) {
        this.min = new PIXI.Point(10000, 10000);
        this.max = new PIXI.Point(-10000, -10000);
        this.scale = 15.0;
        this.parent = parent_obj;
        this.container = new PIXI.Container();
        this.parent.container.addChild(this.container);
        this.fill_mesh = new TerrainMesh(this, json_obj, TerrainGeometryType.FILL);
        this.edges_mesh = new TerrainMesh(this, json_obj, TerrainGeometryType.EDGES);
        this.min.x *= this.scale;
        this.min.y *= this.scale;
        this.max.x *= this.scale;
        this.max.y *= this.scale;
    }
    return Terrain;
})();
;
var forest_fill;
var forest_edges;
var TerrainContainer = (function () {
    function TerrainContainer(complete_json_data) {
        this.terrain_list = [];
        this.min = new PIXI.Point(10000, 10000);
        this.max = new PIXI.Point(-10000, -10000);
        this.container = new PIXI.Container();
        for (var i = 0; i < complete_json_data.length; ++i) {
            var terrain_obj = complete_json_data[i];
            var terrain = new Terrain(this, terrain_obj);
            this.terrain_list.push(terrain);
            this.min.x = (terrain.min.x < this.min.x) ? terrain.min.x : this.min.x;
            this.min.y = (terrain.min.y < this.min.y) ? terrain.min.y : this.min.y;
            this.max.x = (terrain.max.x > this.max.x) ? terrain.max.x : this.max.x;
            this.max.y = (terrain.max.y > this.max.y) ? terrain.max.y : this.max.y;
        }
        this.width = this.max.x - this.min.x;
        this.height = this.max.y - this.min.y;
        console.log(this.width + ",  " + this.height);
    }
    return TerrainContainer;
})();
;
