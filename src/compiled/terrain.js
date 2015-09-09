/// <reference path="../pixi/pixi.js.d.ts" />
var forest_fill;
var forest_edges;
var TerrainGeometryType;
(function (TerrainGeometryType) {
    TerrainGeometryType[TerrainGeometryType["FILL"] = 0] = "FILL";
    TerrainGeometryType[TerrainGeometryType["EDGES"] = 1] = "EDGES";
})(TerrainGeometryType || (TerrainGeometryType = {}));
;
var EdgeNode = (function () {
    function EdgeNode() {
    }
    return EdgeNode;
})();
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
        if (this.type == TerrainGeometryType.EDGES)
            indices_size = 1;
        var min_i = 10000;
        var max_i = -10000;
        for (var n = 0; n < indices_size; ++n) {
            var i = json_obj.indices[indices_start + n];
            min_i = i < min_i ? i : min_i;
            max_i = i > max_i ? i : max_i;
        }
        this.static_vertices = new Float32Array(((max_i - min_i) * 2) + 2);
        var vertices = this.static_vertices;
        for (var n = 0; n < vertices.length; ++n) {
            vertices[n] = json_obj.vertex_data[(min_i * 2) + n];
            if (n % 2 == 1)
                vertices[n] = -vertices[n];
            this.dynamic_vertices[n] = vertices[n];
        }
        this.static_indices = new Uint16Array(indices_size);
        var indices = this.static_indices;
        for (var n = 0; n < indices_size; ++n) {
            indices[n] = json_obj.indices[indices_start + n] - min_i;
            this.dynamic_indices[n] = indices[n];
        }
        this.static_uvs = new Float32Array(((max_i - min_i) * 2) + 2);
        var uvs = this.static_uvs;
        for (var n = 0; n < uvs.length; ++n) {
            uvs[n] = json_obj.uvs[(min_i * 2) + n];
            if (n % 2 == 1)
                uvs[n] = -uvs[n];
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
    TerrainMesh.prototype.recalc_collider_points = function () {
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
                if (i == n)
                    continue;
                var i1 = this.dynamic_indices[i];
                var i2 = this.dynamic_indices[i + 1];
                var i3 = this.dynamic_indices[i + 2];
                if ((p1 == i1 || p1 == i2 || p1 == i3) && (p3 == i1 || p3 == i2 || p3 == i3)) {
                    p3_ol = true;
                }
                else if ((p2 == i1 || p2 == i2 || p2 == i3) && (p3 == i1 || p3 == i2 || p3 == i3)) {
                    p2_ol = true;
                }
                else if ((p1 == i1 || p1 == i2 || p1 == i3) && (p2 == i1 || p2 == i2 || p2 == i3)) {
                    p1_ol = true;
                }
            }
            if (!p1_ol || !p2_ol || !p3_ol) {
                if (!p1_ol)
                    this.add_collider_points(p1, p2);
                if (!p2_ol)
                    this.add_collider_points(p2, p3);
                if (!p3_ol)
                    this.add_collider_points(p1, p3);
            }
        }
        this.parent.collider_points.length = this.collider_index;
    };
    TerrainMesh.prototype.add_collider_points = function (i1, i2) {
        this.parent.collider_points[this.collider_index] = this.dynamic_vertices[i1 * 2];
        this.parent.collider_points[this.collider_index + 1] = this.dynamic_vertices[(i1 * 2) + 1];
        this.parent.collider_points[this.collider_index + 2] = this.dynamic_vertices[i2 * 2];
        this.parent.collider_points[this.collider_index + 3] = this.dynamic_vertices[(i2 * 2) + 1];
        this.collider_index += 4;
    };
    TerrainMesh.prototype.update_geometry = function () {
        delete this.static_indices;
        this.static_indices = new Uint16Array(this.dynamic_indices);
        this.mesh.indices = this.static_indices;
    };
    TerrainMesh.prototype.debug_draw = function () {
        var vertices = this.static_vertices;
        var indices = this.static_indices;
        var s = this.parent.parent.get_scale();
        for (var n = 0; n < indices.length; ++n) {
            var i = Number(indices[n]) * 2;
            var x = (Number(vertices[i]) + this.parent.pos.x) * s;
            var y = (Number(vertices[i + 1]) + this.parent.pos.y) * s;
            if (n % 3 == 0) {
                this.parent.graphics.moveTo(x, y);
            }
            else {
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
    };
    TerrainMesh.prototype.get_tex = function () { return this.tex; };
    TerrainMesh.prototype.get_static_vertices = function () { return this.static_vertices; };
    TerrainMesh.prototype.get_static_indices = function () { return this.static_indices; };
    TerrainMesh.prototype.get_static_uvs = function () { return this.static_uvs; };
    return TerrainMesh;
})();
;
var Terrain = (function () {
    function Terrain(parent_obj, json_obj) {
        this.collider_points = [];
        this.pos = new PIXI.Point(0, 0);
        this.graphics = new PIXI.Graphics();
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
    Terrain.prototype.recalc_collider_points = function () {
        this.fill_mesh.recalc_collider_points();
        this.edge_physics.destroy_all_fixtures();
        this.edge_physics.create_edges(this.collider_points, this.parent.get_scale(), this.pos);
    };
    Terrain.prototype.debug_draw = function () {
        this.graphics.clear();
        this.graphics.lineStyle(1, 0x0000ff, 1);
        this.fill_mesh.debug_draw();
        this.edges_mesh.debug_draw();
    };
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
    TerrainContainer.prototype.debug_draw_all = function () {
        for (var n = 0; n < this.terrain_list.length; ++n) {
            this.terrain_list[n].debug_draw();
        }
    };
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
