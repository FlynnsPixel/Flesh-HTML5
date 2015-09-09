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
  fixture_list: b2Dynamics.b2Fixture[] = [];

  body_type: PhysicsBodyType;
  aabb: b2Collision.b2AABB;
  debug: PhysicsDebug;
  is_debug_drawing: boolean = true;

  private physics_origin: b2Math.b2Vec2 = new b2Math.b2Vec2(0, 0);
  private origin: b2Math.b2Vec2 = new b2Math.b2Vec2(0, 0);

  /**
  * creates a physics object of a specific body type
  * physics objects are objects of any shape that have physics
  * properties applied to them
  **/
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

  /**
  * creates a box shape with specified width, height and pos, rotation origin
  **/
  create_box(width: number, height: number, origin?: b2Math.b2Vec2) {
    var box_shape = new b2Shapes.b2PolygonShape();
    var w = (width * B2_METERS) / 2.0;
    var h = (height * B2_METERS) / 2.0;

    //box2d's origin argument is pretty messy imo, so there are a lot
    //of calculations here to correctly calculate the origin for
    //box2d and for debug drawing
    if (!origin) {
      origin = new b2Math.b2Vec2(0, 0);
      this.physics_origin = origin;
      this.origin = new b2Math.b2Vec2(width / 2.0, height / 2.0);
    }else {
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
  }

  /**
  * creates edge shapes from the points array argument
  **/
  create_edges(points: number[], scale?: number, pos_offset?: PIXI.Point) {
    if (!scale) scale = 1;
    if (!pos_offset) pos_offset = new PIXI.Point(0, 0);

    //loops through points array and creates an edge shape for every
    //2 points in the array
    for (var n = 0; n < points.length; n += 2) {
      if (n + 3 >= points.length) break;
      var edge_shape = new b2Shapes.b2PolygonShape();
      edge_shape.SetAsEdge(new b2Math.b2Vec2(((points[n] + pos_offset.x) * scale) * B2_METERS, (((points[n + 1] + pos_offset.y) * scale) * B2_METERS)),
                           new b2Math.b2Vec2(((points[n + 2] + pos_offset.x) * scale) * B2_METERS, (((points[n + 3] + pos_offset.y) * scale) * B2_METERS)));
      var fixture_def = new b2Dynamics.b2FixtureDef();
      fixture_def.shape = edge_shape;
      if (n == 0) this.shape = edge_shape;
      this.fixture_list.push(this.body.CreateFixture(fixture_def));
    }
    this.fixture = this.body.GetFixtureList();

    this.calculate_aabb();
  }

  /**
  * creates a circle shape with a specified radius
  **/
  create_circle(radius: number) {
    var circle_shape = new b2Shapes.b2CircleShape(radius * B2_METERS);
    var fixture_def = new b2Dynamics.b2FixtureDef();
    fixture_def.shape = circle_shape;
    this.shape = circle_shape;
    this.body.CreateFixture(fixture_def);
    this.fixture = this.body.GetFixtureList();

    this.origin.x = radius;
    this.origin.y = radius;

    this.calculate_aabb();
  }

  /**
  * creates edge shapes from the points array argument
  **/
  update_edge_at(index: number, point: b2Math.b2Vec2, scale?: number, pos_offset?: PIXI.Point) {
    if (!scale) scale = 1;
    if (!pos_offset) pos_offset = new PIXI.Point(0, 0);

    var fixture = this.body.GetFixtureList();
    var i = 0;
    while (fixture) {
      if (i == index) {
        var shape = <b2Shapes.b2PolygonShape>fixture.GetShape();

        var edge_shape = new b2Shapes.b2PolygonShape();
        edge_shape.SetAsEdge(new b2Math.b2Vec2(((point.x + pos_offset.x) * scale) * B2_METERS, (((point.y + pos_offset.y) * scale) * B2_METERS)),
                             shape.GetVertices()[1]);
        var fixture_def = new b2Dynamics.b2FixtureDef();
        fixture_def.shape = edge_shape;
        this.body.DestroyFixture(fixture);
        //this.body.CreateFixture(fixture_def);
        break;
      }
      fixture = fixture.GetNext();
      ++i;
    }
  }

  /**
  * calculates combined aabb of physics object
  **/
  calculate_aabb() {
    this.aabb.lowerBound = new b2Math.b2Vec2(10000, 10000);
    this.aabb.upperBound = new b2Math.b2Vec2(-10000, -10000);
    var fixture = this.body.GetFixtureList();
    while (fixture) {
      this.aabb.Combine(this.aabb, fixture.GetAABB());
      fixture = fixture.GetNext();
    }
  }

  /**
  * updates debug drawing and more
  **/
  update() {
    if (this.is_debug_drawing && is_physics_debug_drawing) {
      this.debug.parent = this;
      this.debug.draw();
    }
  }

  /**
  * sets position of this physics body
  **/
  set_pos(x: number, y: number) {
    var v = this.body.GetPosition();
    v.x = x * B2_METERS;
    v.y = y * B2_METERS;
    this.body.SetPosition(v);
  }

  /**
  * sets x position of this physics body
  **/
  set_x(x: number) {
    this.set_pos(x, this.body.GetPosition().y);
  }

  /**
  * sets y position of this physics body
  **/
  set_y(y: number) {
    this.set_pos(this.body.GetPosition().x, y);
  }

  /**
  * sets sprite pos, rotation, ect, equal to that of this physics body
  * useful for attaching sprites to physics objects
  **/
  set_sprite_pos(sprite: PIXI.Sprite, enable_rotation?: boolean) {
    sprite.x = (this.body.GetPosition().x / B2_METERS);
  	sprite.y = (this.body.GetPosition().y / B2_METERS);
    if (enable_rotation == undefined || enable_rotation) sprite.rotation = this.body.GetAngle();
    sprite.anchor.x = this.origin.x / sprite.width;
    sprite.anchor.y = this.origin.y / sprite.height;
  }

  get_physics_origin(): b2Math.b2Vec2 { return this.physics_origin; }
  get_origin(): b2Math.b2Vec2 { return this.origin; }

  remove() {

  }
};

enum PhysicsDebugDrawType {

  UNKNOWN,
  POLY_BOX,
  POLY_EDGE,
  CIRCLE
};

enum PhysicsShapeType {

  CIRCLE,
  POLYGON
};

class PhysicsDebug {

  graphics: PIXI.Graphics;
  parent: PhysicsObject;

  /**
  * constructs a physics debug object with a physics object parent
  **/
  constructor(parent: PhysicsObject) {
    this.draw
    this.parent = parent;

    this.graphics = new PIXI.Graphics();
    debug_layer.addChild(this.graphics);
  }

  /**
  * draws all fixtures from the parent physics object
  **/
  draw() {
    this.graphics.clear();

    var pos = this.parent.body.GetPosition();
    var angle = this.parent.body.GetAngle();

    //loops through all fixtures of physics object body and draws them
    var fixture = this.parent.body.GetFixtureList();
    while (fixture) {
      var draw_type = PhysicsDebugDrawType.UNKNOWN;
      var shape_type = fixture.GetType();

      //calculates draw type from the fixture shape and shape type
      if (shape_type == PhysicsShapeType.POLYGON) {
        var verts: b2Math.b2Vec2[] = (<b2Shapes.b2PolygonShape>fixture.GetShape()).GetVertices();

        if (verts.length == 2) draw_type = PhysicsDebugDrawType.POLY_EDGE;
        else if (verts.length == 4) draw_type = PhysicsDebugDrawType.POLY_BOX;
      }else if (shape_type == PhysicsShapeType.CIRCLE) {
        draw_type = PhysicsDebugDrawType.CIRCLE;
      }else {
        console.log("error in physics debug draw - unknown shape type " + shape_type);
      }

      switch (draw_type) {
      case PhysicsDebugDrawType.POLY_BOX:
        //draws a box from shape vertices and rotate it with it's origin point
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
          if (n == 0) this.graphics.moveTo(x, y);
          else this.graphics.lineTo(x, y);
        }
        break;
      case PhysicsDebugDrawType.POLY_EDGE:
        //draws edges from shape vertices by drawing a line to each point

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
          }else if (n == 1) {
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
        var circle_shape = <b2Shapes.b2CircleShape>fixture.GetShape();

        //draws edges from shape vertices by drawing a line to each point
        this.graphics.beginFill(0x00ff00);
        this.graphics.fillAlpha = .4;
        this.graphics.lineStyle(1, 0x000000, .4);

        this.graphics.drawCircle(pos.x / B2_METERS, pos.y / B2_METERS, circle_shape.GetRadius() / B2_METERS);

        break;
      }
      this.graphics.endFill();
      fixture = fixture.GetNext();
    }
  }
};

var world: b2Dynamics.b2World;
var B2_METERS = .01;
var physics_objects: PhysicsObject[] = [];
var is_physics_debug_drawing = false;

//only for collision, the higher the value, the better collision
//accuracy at the cost of performance
var vel_iterations = 6;
var pos_iterations = 2;

function init_physics() {
  world = new b2Dynamics.b2World(new b2Math.b2Vec2(0.0, 9.8), false);
}

function update_physics() {
  //toggles debug drawing and clears all physics objects
  //debug graphics when debug drawing is off
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
