
class PlayerDisplayComponent extends DisplayComponent {

  init() {
    this.base = new PIXI.Sprite(texture_bunny);
    game_layer.addChild(this.base);
  }

  update() {

  }
};

class PlayerMotionComponent extends MotionComponent {

  display: PlayerDisplayComponent;
  physics: PhysicsObject;

  init() {
    this.display = <PlayerDisplayComponent>this.parent.get(ComponentType.DISPLAY);

    this.physics = new PhysicsObject(PhysicsBodyType.DYNAMIC);
		this.physics.create_circle(16);
		this.physics.body.ResetMassData();
		this.physics.body.SetFixedRotation(true);
		this.physics.set_pos(400 + game_layer.pivot.x - game_layer.x, 200 + game_layer.pivot.y - game_layer.y);

    var p = this.physics;
    setInterval(function() {
      var x = p.body.GetPosition().x / B2_METERS;
    	var y = p.body.GetPosition().y / B2_METERS;
    	var radius = 70;
    	remove_circle_chunk(x, y, radius);
    }, 1000);
  }

  update() {
    if (is_key_pressed(KeyCode.UP_ARROW)) {
      var v = this.physics.body.GetLinearVelocity();
      v.y = -4;
      this.physics.body.SetLinearVelocity(v);
    }

    var v = this.physics.body.GetLinearVelocity();
    var av = this.physics.body.GetAngularVelocity();
    var inputting = false;
    this.physics.fixture.SetFriction(120.0);
    if (is_key_down(KeyCode.LEFT_ARROW)) {
      v.x = -2;
      inputting = true;
      this.physics.fixture.SetFriction(.1);
    }else if (is_key_down(KeyCode.RIGHT_ARROW)) {
      v.x = 2;
      inputting = true;
      this.physics.fixture.SetFriction(.1);
    }
    this.physics.body.ResetMassData();

    v.x = Math.max(v.x, -10) * .9;
    v.x = Math.min(v.x, 10) * .9;
    v.y = Math.max(v.y, -10) * .99;
    v.y = Math.min(v.y, 10) * .99;

    this.physics.set_sprite_pos(this.display.base, false);
  }
};

function create_player(): Entity {
  var player = new Entity();
  player.add(new PlayerDisplayComponent());
  player.add(new PlayerMotionComponent());
  player.init_new_components();
  return player;
};
