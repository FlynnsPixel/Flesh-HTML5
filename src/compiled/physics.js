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
var PhysicsDebug = (function () {
    function PhysicsDebug(parent) {
        this.parent = parent;
        this.graphics = new PIXI.Graphics();
        ui_layer.addChild(this.graphics);
    }
    PhysicsDebug.prototype.draw = function () {
        this.graphics.clear();
        this.graphics.beginFill(0x00ff00);
        this.graphics.fillAlpha = .4;
        this.graphics.lineStyle(1, 0x000000, .4);
        var pos = this.parent.body.GetPosition();
        var angle = this.parent.body.GetAngle();
        var origin_x = 0;
        var origin_y = 0;
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var x = pos.x / B2_METERS;
        var y = pos.y / B2_METERS;
        var w = this.parent.aabb.upperBound.x / B2_METERS;
        var h = this.parent.aabb.upperBound.y / B2_METERS;
        this.graphics.moveTo(x, y);
        this.graphics.lineTo(x + (c * w), y + (s * w));
        this.graphics.lineTo(x + ((c * w) - (s * h)), y + ((s * w) + (c * h)));
        this.graphics.lineTo(x - (s * h), y + (c * h));
        this.graphics.endFill();
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
