var PhysicsBodyType;
(function (PhysicsBodyType) {
    PhysicsBodyType[PhysicsBodyType["STATIC"] = 0] = "STATIC";
    PhysicsBodyType[PhysicsBodyType["KINETIC"] = 1] = "KINETIC";
    PhysicsBodyType[PhysicsBodyType["DYNAMIC"] = 2] = "DYNAMIC";
})(PhysicsBodyType || (PhysicsBodyType = {}));
;
var PhysicsObject = (function () {
    function PhysicsObject() {
        this.bounds = new PIXI.Rectangle(0, 0, 0, 0);
    }
    PhysicsObject.prototype.create = function (type) {
        if (type)
            this.body_type = type;
        else
            this.body_type = PhysicsBodyType.STATIC;
        this.body_def = new b2Dynamics.b2BodyDef();
        this.body_def.type = this.body_type;
        this.body = world.CreateBody(this.body_def);
        this.fixture_def = new b2Dynamics.b2FixtureDef();
        body.CreateFixture(this.fixture_def);
    };
    PhysicsObject.prototype.create_box = function (width, height) {
        var box_shape = new b2Shapes.b2PolygonShape();
        var w = (width * B2_METERS) / 2.0;
        var h = (height * B2_METERS) / 2.0;
        box_shape.SetAsOrientedBox(w, h, new b2Math.b2Vec2(w, h), 0);
        this.fixture_def.shape = box_shape;
        this.shape = box_shape;
        this.bounds.x = 0;
        this.bounds.y = 0;
        this.bounds.width = width;
        this.bounds.height = height;
    };
    PhysicsObject.prototype.remove = function () {
    };
    return PhysicsObject;
})();
;
var world;
function init_physics() {
    world = new b2Dynamics.b2World(new b2Math.b2Vec2(0.0, 9.8), false);
}
