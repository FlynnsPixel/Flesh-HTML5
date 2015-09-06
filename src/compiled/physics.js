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
        this.fixture_def = new b2Dynamics.b2FixtureDef();
        this.body.CreateFixture(this.fixture_def);
        this.aabb = new b2Collision.b2AABB();
        this.debug = new PhysicsDebug(this);
        physics_objects.push(this);
    }
    PhysicsObject.prototype.create_box = function (width, height) {
        var box_shape = new b2Shapes.b2PolygonShape();
        var w = (width * B2_METERS) / 2.0;
        var h = (height * B2_METERS) / 2.0;
        box_shape.SetAsOrientedBox(w, h, new b2Math.b2Vec2(w, h), 0);
        this.fixture_def.shape = box_shape;
        this.shape = box_shape;
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
    PhysicsObject.prototype.remove = function () {
    };
    return PhysicsObject;
})();
;
var PhysicsDebug = (function () {
    function PhysicsDebug(parent) {
        this.parent = parent;
        this.graphics.beginFill(0x00ff00);
        this.graphics.fillAlpha = .4;
        this.graphics.lineStyle(1, 0x000000, .4);
    }
    PhysicsDebug.prototype.draw = function () {
        this.graphics.clear();
        var pos = this.parent.body.GetPosition();
        var angle = this.parent.body.GetAngle();
        var origin_x = 0;
        var origin_y = 0;
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var x = pos.x / B2_METERS;
        var y = pos.y / B2_METERS;
        var w = this.parent.aabb.lowerBound;
        var h = this.parent.aabb.upperBound;
        this.graphics.moveTo(x + ((c * origin_x) - (s * origin_y)), y + ((s * origin_x) + (c * origin_y)));
        this.graphics.lineTo(x + ((c * w) - (s * origin_y)), y + ((s * w) + (c * origin_y)));
        this.graphics.lineTo(x + ((c * w) - (s * h)), y + ((s * w) + (c * h)));
        this.graphics.lineTo(x + ((c * origin_x) - (s * h)), y + ((s * origin_x) + (c * h)));
    };
    return PhysicsDebug;
})();
;
var world;
var B2_METERS = .01;
var physics_objects = [];
function init_physics() {
    world = new b2Dynamics.b2World(new b2Math.b2Vec2(0.0, 9.8), false);
}
