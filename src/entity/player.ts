
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

  init() {
    this.display = <PlayerDisplayComponent>this.parent.get(ComponentType.DISPLAY);
  }

  update() {
    if (is_key_pressed(KeyCode.UP_ARROW)) {
      var v = box1.body.GetLinearVelocity();
      v.y = -4;
      box1.body.SetLinearVelocity(v);
    }

    var v = box1.body.GetLinearVelocity();
    var av = box1.body.GetAngularVelocity();
    var inputting = false;
    box1.fixture.SetFriction(120.0);
    if (is_key_down(KeyCode.LEFT_ARROW)) {
      v.x = -2;
      inputting = true;
      box1.fixture.SetFriction(.1);
    }else if (is_key_down(KeyCode.RIGHT_ARROW)) {
      v.x = 2;
      inputting = true;
      box1.fixture.SetFriction(.1);
    }
    box1.body.ResetMassData();

    v.x = Math.max(v.x, -10) * .9;
    v.x = Math.min(v.x, 10) * .9;
    v.y = Math.max(v.y, -10) * .99;
    v.y = Math.min(v.y, 10) * .99;

    box1.set_sprite_pos(this.display.base, false);
  }
};

function create_player(): Entity {
  var player = new Entity();
  player.add(new PlayerDisplayComponent());
  player.add(new PlayerMotionComponent());
  player.init_new_components();
  return player;
};
