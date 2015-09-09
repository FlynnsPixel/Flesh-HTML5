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
        this.fixture_list = [];
        this.is_debug_drawing = true;
        this.physics_origin = new b2Math.b2Vec2(0, 0);
        this.origin = new b2Math.b2Vec2(0, 0);
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
    PhysicsObject.prototype.create_box = function (width, height, origin) {
        var box_shape = new b2Shapes.b2PolygonShape();
        var w = (width * B2_METERS) / 2.0;
        var h = (height * B2_METERS) / 2.0;
        if (!origin) {
            origin = new b2Math.b2Vec2(0, 0);
            this.physics_origin = origin;
            this.origin = new b2Math.b2Vec2(width / 2.0, height / 2.0);
        }
        else {
            this.origin = origin.Copy();
            origin.x *= B2_METERS;
            origin.y *= B2_METERS;
            this.physics_origin.x = (w - origin.x) * 2.0;
            this.physics_origin.y = (h - origin.y) * 2.0;
            origin.x = w - origin.x;
            origin.y = h - origin.y;
        }
        box_shape.SetAsOrientedBox(w, h, origin, 0);
        var fixture_def = new b2Dynamics.b2FixtureDef();
        fixture_def.shape = box_shape;
        this.shape = box_shape;
        this.body.CreateFixture(fixture_def);
        this.fixture = this.body.GetFixtureList();
        this.calculate_aabb();
    };
    PhysicsObject.prototype.create_edges = function (points, scale, pos_offset) {
        if (!scale)
            scale = 1;
        if (!pos_offset)
            pos_offset = new PIXI.Point(0, 0);
        for (var n = 0; n < points.length; n += 2) {
            if (n + 3 >= points.length)
                break;
            var edge_shape = new b2Shapes.b2PolygonShape();
            edge_shape.SetAsEdge(new b2Math.b2Vec2(((points[n] + pos_offset.x) * scale) * B2_METERS, (((points[n + 1] + pos_offset.y) * scale) * B2_METERS)), new b2Math.b2Vec2(((points[n + 2] + pos_offset.x) * scale) * B2_METERS, (((points[n + 3] + pos_offset.y) * scale) * B2_METERS)));
            var fixture_def = new b2Dynamics.b2FixtureDef();
            fixture_def.shape = edge_shape;
            if (n == 0)
                this.shape = edge_shape;
            this.fixture_list.push(this.body.CreateFixture(fixture_def));
        }
        this.fixture = this.body.GetFixtureList();
        this.calculate_aabb();
    };
    PhysicsObject.prototype.create_circle = function (radius) {
        var circle_shape = new b2Shapes.b2CircleShape(radius * B2_METERS);
        var fixture_def = new b2Dynamics.b2FixtureDef();
        fixture_def.shape = circle_shape;
        this.shape = circle_shape;
        this.body.CreateFixture(fixture_def);
        this.fixture = this.body.GetFixtureList();
        this.origin.x = radius;
        this.origin.y = radius;
        this.calculate_aabb();
    };
    PhysicsObject.prototype.update_edge_at = function (index, point, scale, pos_offset) {
        if (!scale)
            scale = 1;
        if (!pos_offset)
            pos_offset = new PIXI.Point(0, 0);
        var fixture = this.body.GetFixtureList();
        var i = 0;
        while (fixture) {
            if (i == index) {
                var shape = fixture.GetShape();
                var edge_shape = new b2Shapes.b2PolygonShape();
                edge_shape.SetAsEdge(new b2Math.b2Vec2(((point.x + pos_offset.x) * scale) * B2_METERS, (((point.y + pos_offset.y) * scale) * B2_METERS)), shape.GetVertices()[1]);
                var fixture_def = new b2Dynamics.b2FixtureDef();
                fixture_def.shape = edge_shape;
                this.body.DestroyFixture(fixture);
                break;
            }
            fixture = fixture.GetNext();
            ++i;
        }
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
        if (this.is_debug_drawing && is_physics_debug_drawing) {
            this.debug.parent = this;
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
    PhysicsObject.prototype.set_sprite_pos = function (sprite, enable_rotation) {
        sprite.x = (this.body.GetPosition().x / B2_METERS);
        sprite.y = (this.body.GetPosition().y / B2_METERS);
        if (enable_rotation == undefined || enable_rotation)
            sprite.rotation = this.body.GetAngle();
        sprite.anchor.x = this.origin.x / sprite.width;
        sprite.anchor.y = this.origin.y / sprite.height;
    };
    PhysicsObject.prototype.get_physics_origin = function () { return this.physics_origin; };
    PhysicsObject.prototype.get_origin = function () { return this.origin; };
    PhysicsObject.prototype.remove = function () {
    };
    return PhysicsObject;
})();
;
var PhysicsDebugDrawType;
(function (PhysicsDebugDrawType) {
    PhysicsDebugDrawType[PhysicsDebugDrawType["UNKNOWN"] = 0] = "UNKNOWN";
    PhysicsDebugDrawType[PhysicsDebugDrawType["POLY_BOX"] = 1] = "POLY_BOX";
    PhysicsDebugDrawType[PhysicsDebugDrawType["POLY_EDGE"] = 2] = "POLY_EDGE";
    PhysicsDebugDrawType[PhysicsDebugDrawType["CIRCLE"] = 3] = "CIRCLE";
})(PhysicsDebugDrawType || (PhysicsDebugDrawType = {}));
;
var PhysicsShapeType;
(function (PhysicsShapeType) {
    PhysicsShapeType[PhysicsShapeType["CIRCLE"] = 0] = "CIRCLE";
    PhysicsShapeType[PhysicsShapeType["POLYGON"] = 1] = "POLYGON";
})(PhysicsShapeType || (PhysicsShapeType = {}));
;
var PhysicsDebug = (function () {
    function PhysicsDebug(parent) {
        this.draw;
        this.parent = parent;
        this.graphics = new PIXI.Graphics();
        debug_layer.addChild(this.graphics);
    }
    PhysicsDebug.prototype.draw = function () {
        this.graphics.clear();
        var pos = this.parent.body.GetPosition();
        var angle = this.parent.body.GetAngle();
        var fixture = this.parent.body.GetFixtureList();
        while (fixture) {
            var draw_type = PhysicsDebugDrawType.UNKNOWN;
            var shape_type = fixture.GetType();
            if (shape_type == PhysicsShapeType.POLYGON) {
                var verts = fixture.GetShape().GetVertices();
                if (verts.length == 2)
                    draw_type = PhysicsDebugDrawType.POLY_EDGE;
                else if (verts.length == 4)
                    draw_type = PhysicsDebugDrawType.POLY_BOX;
            }
            else if (shape_type == PhysicsShapeType.CIRCLE) {
                draw_type = PhysicsDebugDrawType.CIRCLE;
            }
            else {
                console.log("error in physics debug draw - unknown shape type " + shape_type);
            }
            switch (draw_type) {
                case PhysicsDebugDrawType.POLY_BOX:
                    this.graphics.beginFill(0x00ff00);
                    this.graphics.fillAlpha = .4;
                    this.graphics.lineStyle(1, 0x000000, .4);
                    var c = Math.cos(angle), s = Math.sin(angle);
                    var origin_x = this.parent.get_physics_origin().x / B2_METERS;
                    for (var n = 0; n < verts.length; ++n) {
                        var vx = verts[n].x / B2_METERS;
                        var vy = verts[n].y / B2_METERS;
                        var x = (pos.x / B2_METERS) - (c * (vx - origin_x) + s * vy);
                        var y = (pos.y / B2_METERS) + (-s * (vx - origin_x) + c * vy);
                        if (n == 0)
                            this.graphics.moveTo(x, y);
                        else
                            this.graphics.lineTo(x, y);
                    }
                    break;
                case PhysicsDebugDrawType.POLY_EDGE:
                    var c = Math.cos(angle), s = Math.sin(angle);
                    var origin_x = 0;
                    for (var n = 0; n < verts.length; ++n) {
                        this.graphics.lineStyle(4, 0x000000, 1);
                        var vx = verts[n].x / B2_METERS;
                        var vy = verts[n].y / B2_METERS;
                        var x = (pos.x / B2_METERS) + (c * (vx - origin_x) + s * vy);
                        var y = (pos.y / B2_METERS) + (-s * (vx - origin_x) + c * vy);
                        if (n == 0) {
                            this.graphics.moveTo(x, y);
                        }
                        else if (n == 1) {
                            this.graphics.lineTo(x, y);
                        }
                        if (n % 2 == 1) {
                            this.graphics.beginFill(0xff0000);
                            this.graphics.lineStyle(0, 0x000000, 0);
                            this.graphics.drawCircle(x, y, 2);
                            this.graphics.endFill();
                        }
                    }
                    break;
                case PhysicsDebugDrawType.CIRCLE:
                    var circle_shape = fixture.GetShape();
                    this.graphics.beginFill(0x00ff00);
                    this.graphics.fillAlpha = .4;
                    this.graphics.lineStyle(1, 0x000000, .4);
                    this.graphics.drawCircle(pos.x / B2_METERS, pos.y / B2_METERS, circle_shape.GetRadius() / B2_METERS);
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
var is_physics_debug_drawing = false;
var vel_iterations = 6;
var pos_iterations = 2;
function init_physics() {
    world = new b2Dynamics.b2World(new b2Math.b2Vec2(0.0, 9.8), false);
}
function update_physics() {
    if (is_key_down(KeyCode.CTRL) && is_key_pressed(KeyCode.Q)) {
        is_physics_debug_drawing = !is_physics_debug_drawing;
        if (!is_physics_debug_drawing) {
            for (var n = 0; n < physics_objects.length; ++n) {
                physics_objects[n].debug.graphics.clear();
            }
        }
    }
    world.Step(time_step, vel_iterations, pos_iterations);
    for (var n = 0; n < physics_objects.length; ++n) {
        physics_objects[n].update();
    }
}
