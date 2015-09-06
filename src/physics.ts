
enum PhysicsBodyType {
  STATIC,
  KINETIC,
  DYNAMIC
};

class PhysicsObject {

  body_def: b2Dynamics.b2BodyDef;
  body: b2Dynamics.b2Body;
  fixture_def: b2Dynamics.b2FixtureDef;
  shape: b2Shapes.b2Shape;

  body_type: PhysicsBodyType;
  bounds: PIXI.Rectangle = new PIXI.Rectangle(0, 0, 0, 0);

  create(type?: PhysicsBodyType) {
    if (type) this.body_type = type;
    else this.body_type = PhysicsBodyType.STATIC;

    this.body_def = new b2Dynamics.b2BodyDef();
		this.body_def.type = this.body_type;

		this.body = world.CreateBody(this.body_def);

		this.fixture_def = new b2Dynamics.b2FixtureDef();
		body.CreateFixture(this.fixture_def);
  }

  create_box(width: number, height: number) {
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
  }

  remove() {

  }
};

var world: b2Dynamics.b2World;

function init_physics() {
  world = new b2Dynamics.b2World(new b2Math.b2Vec2(0.0, 9.8), false);
}
