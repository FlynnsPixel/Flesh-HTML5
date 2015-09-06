/// <reference path="../lib-ts/box2d-web.d.ts"/>
var b2Common = Box2D.Common;
var b2Math = Box2D.Common.Math;
var b2Collision = Box2D.Collision;
var b2Shapes = Box2D.Collision.Shapes;
var b2Dynamics = Box2D.Dynamics;
var b2Contacts = Box2D.Dynamics.Contacts;
var b2Controllers = Box2D.Dynamics.Controllers;
var b2Joints = Box2D.Dynamics.Joints;
var PhysicsBodyType;
(function (PhysicsBodyType) {
    PhysicsBodyType[PhysicsBodyType["STATIC"] = 0] = "STATIC";
    PhysicsBodyType[PhysicsBodyType["KINETIC"] = 1] = "KINETIC";
    PhysicsBodyType[PhysicsBodyType["DYNAMIC"] = 2] = "DYNAMIC";
})(PhysicsBodyType || (PhysicsBodyType = {}));
;
var PhysicsObject = (function () {
    function PhysicsObject(type) {
        this.is_debug_drawing = true;
        if (type)
            this.body_type = type;
        else
            this.body_type = PhysicsBodyType.STATIC;
        this.body_def = new b2Dynamics.b2BodyDef();
        this.body_def.type = this.body_type;
        this.body = world.CreateBody(this.body_def);
        this.aabb = new b2Collision.b2AABB();
        this.debug = new PhysicsDebug(this);
        physics_objects.push(this);
    }
    PhysicsObject.prototype.create_box = function (width, height) {
        var box_shape = new b2Shapes.b2PolygonShape();
        var w = (width * B2_METERS) / 2.0;
        var h = (height * B2_METERS) / 2.0;
        box_shape.SetAsOrientedBox(w, h, new b2Math.b2Vec2(w, h), 0);
        var fixture_def = new b2Dynamics.b2FixtureDef();
        fixture_def.shape = box_shape;
        this.shape = box_shape;
        this.body.CreateFixture(fixture_def);
        this.fixture = this.body.GetFixtureList();
        this.calculate_aabb();
    };
    PhysicsObject.prototype.create_edges = function (points) {
        var scale = 20.0;
        this.is_debug_drawing = true;
        var count = 0;
        for (var n = 0; n < points.length; n += 2) {
            if (n + 3 >= points.length)
                break;
            var edge_shape = new b2Shapes.b2PolygonShape();
            edge_shape.SetAsEdge(new b2Math.b2Vec2((points[n] * scale) * B2_METERS, (points[n + 1] * scale * B2_METERS)), new b2Math.b2Vec2((points[n + 2] * scale) * B2_METERS, (points[n + 3] * scale * B2_METERS)));
            var fixture_def = new b2Dynamics.b2FixtureDef();
            fixture_def.shape = edge_shape;
            if (n == 0)
                this.shape = edge_shape;
            this.body.CreateFixture(fixture_def);
            ++count;
        }
        console.log("generated " + count + " edge polys");
        this.fixture = this.body.GetFixtureList();
        this.calculate_aabb();
    };
    PhysicsObject.prototype.calculate_aabb = function () {
        this.aabb.lowerBound = new b2Math.b2Vec2(10000, 10000);
        this.aabb.upperBound = new b2Math.b2Vec2(-10000, -10000);
        var fixture = this.body.GetFixtureList();
        while (fixture) {
            this.aabb.Combine(this.aabb, fixture.GetAABB());
            fixture = fixture.GetNext();
        }
    };
    PhysicsObject.prototype.update = function () {
        if (this.is_debug_drawing) {
            this.debug.draw();
        }
    };
    PhysicsObject.prototype.set_pos = function (x, y) {
        var v = this.body.GetPosition();
        v.x = x * B2_METERS;
        v.y = y * B2_METERS;
        this.body.SetPosition(v);
    };
    PhysicsObject.prototype.set_x = function (x) {
        this.set_pos(x, this.body.GetPosition().y);
    };
    PhysicsObject.prototype.set_y = function (y) {
        this.set_pos(this.body.GetPosition().x, y);
    };
    PhysicsObject.prototype.remove = function () {
    };
    return PhysicsObject;
})();
;
var PhysicsDebugDrawType;
(function (PhysicsDebugDrawType) {
    PhysicsDebugDrawType[PhysicsDebugDrawType["UNKNOWN"] = 0] = "UNKNOWN";
    PhysicsDebugDrawType[PhysicsDebugDrawType["BOX"] = 1] = "BOX";
    PhysicsDebugDrawType[PhysicsDebugDrawType["EDGE"] = 2] = "EDGE";
})(PhysicsDebugDrawType || (PhysicsDebugDrawType = {}));
;
var PhysicsDebug = (function () {
    function PhysicsDebug(parent) {
        this.parent = parent;
        this.graphics = new PIXI.Graphics();
        game_layer.addChild(this.graphics);
    }
    PhysicsDebug.prototype.draw = function () {
        this.graphics.clear();
        this.graphics.beginFill(0x00ff00);
        this.graphics.fillAlpha = .4;
        this.graphics.lineStyle(1, 0x000000, .4);
        var pos = this.parent.body.GetPosition();
        var angle = this.parent.body.GetAngle();
        var fixture = this.parent.body.GetFixtureList();
        while (fixture) {
            var shape = fixture.GetShape();
            var verts = shape.GetVertices();
            var draw_type = PhysicsDebugDrawType.UNKNOWN;
            if (verts.length == 2) {
                draw_type = PhysicsDebugDrawType.EDGE;
                this.graphics.lineStyle(10, 0x000000, 1);
            }
            else if (verts.length == 4) {
                draw_type = PhysicsDebugDrawType.BOX;
                this.graphics.beginFill(0x00ff00);
                this.graphics.fillAlpha = .4;
                this.graphics.lineStyle(1, 0x000000, .4);
            }
            switch (draw_type) {
                case PhysicsDebugDrawType.BOX:
                    var c = Math.cos(angle), s = Math.sin(angle);
                    var x = pos.x / B2_METERS, y = pos.y / B2_METERS;
                    var w = this.parent.aabb.upperBound.x / B2_METERS;
                    var h = this.parent.aabb.upperBound.y / B2_METERS;
                    this.graphics.moveTo(x, y);
                    this.graphics.lineTo(x + (c * w), y + (s * w));
                    this.graphics.lineTo(x + ((c * w) - (s * h)), y + ((s * w) + (c * h)));
                    this.graphics.lineTo(x - (s * h), y + (c * h));
                    break;
                case PhysicsDebugDrawType.EDGE:
                    for (var n = 0; n < verts.length; ++n) {
                        var x = (verts[n].x + pos.x) / B2_METERS;
                        var y = (verts[n].y + pos.y) / B2_METERS;
                        if (n == 0) {
                            this.graphics.moveTo(x, y);
                        }
                        else if (n == 1) {
                            this.graphics.lineTo(x, y);
                        }
                    }
                    break;
            }
            this.graphics.endFill();
            fixture = fixture.GetNext();
        }
    };
    return PhysicsDebug;
})();
;
var world;
var B2_METERS = .01;
var physics_objects = [];
var vel_iterations = 6;
var pos_iterations = 2;
function init_physics() {
    world = new b2Dynamics.b2World(new b2Math.b2Vec2(0.0, 9.8), false);
}
function update_physics() {
    world.Step(1 / 120.0, vel_iterations, pos_iterations);
    for (var n = 0; n < physics_objects.length; ++n) {
        physics_objects[n].update();
    }
}
