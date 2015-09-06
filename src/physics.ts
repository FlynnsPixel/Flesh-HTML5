/// <reference path="../lib-ts/box2d-web.d.ts"/>

import b2Common = Box2D.Common;
import b2Math = Box2D.Common.Math;
import b2Collision = Box2D.Collision;
import b2Shapes = Box2D.Collision.Shapes;
import b2Dynamics = Box2D.Dynamics;
import b2Contacts = Box2D.Dynamics.Contacts;
import b2Controllers = Box2D.Dynamics.Controllers;
import b2Joints = Box2D.Dynamics.Joints;

enum PhysicsBodyType {
  STATIC,
  KINETIC,
  DYNAMIC
};

class PhysicsObject {

  body_def: b2Dynamics.b2BodyDef;
  body: b2Dynamics.b2Body;
  fixture: b2Dynamics.b2Fixture;
  shape: b2Shapes.b2Shape;

  body_type: PhysicsBodyType;
  aabb: b2Collision.b2AABB;
  debug: PhysicsDebug;
  is_debug_drawing: boolean = true;

  constructor(type?: PhysicsBodyType) {
    if (type) this.body_type = type;
    else this.body_type = PhysicsBodyType.STATIC;

    this.body_def = new b2Dynamics.b2BodyDef();
		this.body_def.type = this.body_type;

		this.body = world.CreateBody(this.body_def);

    this.aabb = new b2Collision.b2AABB();
    this.debug = new PhysicsDebug(this);
    physics_objects.push(this);
  }

  create_box(width: number, height: number) {
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
  }

  calculate_aabb() {
    this.aabb.lowerBound = new b2Math.b2Vec2(10000, 10000);
    this.aabb.upperBound = new b2Math.b2Vec2(-10000, -10000);
    var fixture = this.body.GetFixtureList();
    while (fixture) {
      this.aabb.Combine(this.aabb, fixture.GetAABB());
      fixture = fixture.GetNext();
    }
  }

  update() {
    if (this.is_debug_drawing) {
      this.debug.draw();
    }
  }

  set_pos(x: number, y: number) {
    var v = this.body.GetPosition();
    v.x = x * B2_METERS;
    v.y = y * B2_METERS;
    this.body.SetPosition(v);
  }

  set_x(x: number) {
    this.set_pos(x, this.body.GetPosition().y);
  }

  set_y(y: number) {
    this.set_pos(this.body.GetPosition().x, y);
  }

  remove() {

  }
};

class PhysicsDebug {

  graphics: PIXI.Graphics;
  parent: PhysicsObject;

  constructor(parent: PhysicsObject) {
    this.parent = parent;

    this.graphics = new PIXI.Graphics();
    ui_layer.addChild(this.graphics);
  }

  draw() {
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
  }
};

var world: b2Dynamics.b2World;
var B2_METERS = .01;
var physics_objects: PhysicsObject[] = [];

//only for collision, the higher the value, the better collision
//accuracy at the cost of performance
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
