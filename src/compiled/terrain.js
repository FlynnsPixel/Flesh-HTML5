/// <reference path="../pixi/pixi.js.d.ts" />
var forest_fill;
var forest_edges;
var TerrainGeometryType;
(function (TerrainGeometryType) {
    TerrainGeometryType[TerrainGeometryType["FILL"] = 0] = "FILL";
    TerrainGeometryType[TerrainGeometryType["EDGES"] = 1] = "EDGES";
})(TerrainGeometryType || (TerrainGeometryType = {}));
;
var TerrainMesh = (function () {
    function TerrainMesh(parent_obj, json_obj, geometry_type) {
        this.dynamic_vertices = [];
        this.dynamic_indices = [];
        this.dynamic_uvs = [];
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
        this.static_vertices = new Float32Array(json_obj.vertex_data.length);
        var vertices = this.static_vertices;
        for (var n = 0; n < vertices.length; ++n) {
            vertices[n] = json_obj.vertex_data[n];
            if (n % 2 == 1)
                vertices[n] = -vertices[n];
            this.dynamic_vertices[n] = vertices[n];
        }
        this.static_indices = new Uint16Array(indices_size);
        var indices = this.static_indices;
        for (var n = 0; n < indices_size; ++n) {
            indices[n] = json_obj.indices[indices_start + n];
            this.dynamic_indices[n] = indices[n];
        }
        this.static_uvs = new Float32Array(json_obj.uvs.length);
        var uvs = this.static_uvs;
        for (var n = 0; n < uvs.length; ++n) {
            uvs[n] = json_obj.uvs[n];
            if (n % 2 == 1)
                uvs[n] = -uvs[n];
            this.dynamic_uvs[n] = uvs[n];
        }
        this.mesh = new PIXI.mesh.Mesh(this.tex, vertices, uvs, indices, PIXI.mesh.Mesh.DRAW_MODES.TRIANGLES);
        this.mesh.x = this.parent.pos.x;
        this.mesh.y = this.parent.pos.y;
        this.parent.container.addChild(this.mesh);
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
        this.pos = new PIXI.Point(0, 0);
        this.parent = parent_obj;
        this.container = new PIXI.Container();
        this.pos.x = json_obj.pos[0];
        this.pos.y = -json_obj.pos[1];
        this.collider_points = json_obj.collider_points;
        for (var n = 1; n < this.collider_points.length; n += 2) {
            this.collider_points[n] = -this.collider_points[n];
        }
        this.fill_mesh = new TerrainMesh(this, json_obj, TerrainGeometryType.FILL);
        this.edges_mesh = new TerrainMesh(this, json_obj, TerrainGeometryType.EDGES);
    }
    return Terrain;
})();
;
var TerrainContainer = (function () {
    function TerrainContainer(complete_json_data) {
        this.terrain_list = [];
        this.scale = 20.0;
        this.container = new PIXI.Container();
        for (var i = 0; i < complete_json_data.length; ++i) {
            var terrain_obj = complete_json_data[i];
            var terrain = new Terrain(this, terrain_obj);
            this.container.addChild(terrain.container);
            this.terrain_list.push(terrain);
        }
        this.container.scale.x *= this.scale;
        this.container.scale.y *= this.scale;
        var bounds = this.container.getBounds();
        bounds.x *= this.scale;
        bounds.y *= this.scale;
        bounds.width *= this.scale;
        bounds.height *= this.scale;
    }
    TerrainContainer.prototype.get_scale = function () { return this.scale; };
    return TerrainContainer;
})();
;
function calculate_min_max_rect(b1, b2) {
    b1.x = (b2.x < b1.x) ? b2.x : b1.x;
    b1.y = (b2.y < b1.y) ? b2.y : b1.y;
    b1.width = (b2.width > b1.width) ? b2.width : b1.width;
    b1.height = (b2.height > b1.height) ? b2.height : b1.height;
    return b1;
}
