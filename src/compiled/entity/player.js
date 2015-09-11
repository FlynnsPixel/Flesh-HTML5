var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PlayerDisplayComponent = (function (_super) {
    __extends(PlayerDisplayComponent, _super);
    function PlayerDisplayComponent() {
        _super.apply(this, arguments);
    }
    PlayerDisplayComponent.prototype.init = function () {
        this.base = new PIXI.Sprite(texture_bunny);
        game_layer.addChild(this.base);
    };
    PlayerDisplayComponent.prototype.update = function () {
    };
    return PlayerDisplayComponent;
})(DisplayComponent);
;
var PlayerMotionComponent = (function (_super) {
    __extends(PlayerMotionComponent, _super);
    function PlayerMotionComponent() {
        _super.apply(this, arguments);
    }
    PlayerMotionComponent.prototype.init = function () {
        this.display = this.parent.get(ComponentType.DISPLAY);
    };
    PlayerMotionComponent.prototype.update = function () {
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
        }
        else if (is_key_down(KeyCode.RIGHT_ARROW)) {
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
    };
    return PlayerMotionComponent;
})(MotionComponent);
;
function create_player() {
    var player = new Entity();
    player.add(new PlayerDisplayComponent());
    player.add(new PlayerMotionComponent());
    player.init_new_components();
    return player;
}
;
