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

  create_edges(points: number[]) {
    var scale = 20.0;
    this.is_debug_drawing = true;
    var count = 0;
    for (var n = 0; n < points.length; n += 2) {
      if (n + 3 >= points.length) break;
      var edge_shape = new b2Shapes.b2PolygonShape();
      edge_shape.SetAsEdge(new b2Math.b2Vec2((points[n] * scale) * B2_METERS, (points[n + 1] * scale * B2_METERS)),
                           new b2Math.b2Vec2((points[n + 2] * scale) * B2_METERS, (points[n + 3] * scale * B2_METERS)));
      var fixture_def = new b2Dynamics.b2FixtureDef();
      fixture_def.shape = edge_shape;
      if (n == 0) this.shape = edge_shape;
      this.body.CreateFixture(fixture_def);
      ++count;
    }
    console.log("generated " + count + " edge polys");
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

enum PhysicsDebugDrawType {

  UNKNOWN,
  BOX,
  EDGE
};

class PhysicsDebug {

  graphics: PIXI.Graphics;
  parent: PhysicsObject;

  constructor(parent: PhysicsObject) {
    this.parent = parent;

    this.graphics = new PIXI.Graphics();
    game_layer.addChild(this.graphics);
  }

  draw() {
    this.graphics.clear();
    this.graphics.beginFill(0x00ff00);
  	this.graphics.fillAlpha = .4;
  	this.graphics.lineStyle(1, 0x000000, .4);

    var pos = this.parent.body.GetPosition();
    var angle = this.parent.body.GetAngle();

    var fixture = this.parent.body.GetFixtureList();
    while (fixture) {
      var shape = <b2Shapes.b2PolygonShape>fixture.GetShape();
      var verts: b2Math.b2Vec2[] = shape.GetVertices();
      var draw_type = PhysicsDebugDrawType.UNKNOWN;
      if (verts.length == 2) {
        draw_type = PhysicsDebugDrawType.EDGE;

        this.graphics.lineStyle(10, 0x000000, 1);
      }else if (verts.length == 4) {
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
          }else if (n == 1) {
            this.graphics.lineTo(x, y);
          }
        }
        break;
      }
      this.graphics.endFill();
      fixture = fixture.GetNext();
    }

    /*
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
    */
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
