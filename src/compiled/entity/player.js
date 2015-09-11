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
        this.physics = new PhysicsObject(PhysicsBodyType.DYNAMIC);
        this.physics.create_circle(16);
        this.physics.body.ResetMassData();
        this.physics.body.SetFixedRotation(true);
        this.physics.set_pos(400 + game_layer.pivot.x - game_layer.x, 200 + game_layer.pivot.y - game_layer.y);
        var p = this.physics;
        setInterval(function () {
            var x = p.body.GetPosition().x / B2_METERS;
            var y = p.body.GetPosition().y / B2_METERS;
            var radius = 70;
            terrain_container.remove_circle_chunk(x, y, radius);
        }, 1000);
    };
    PlayerMotionComponent.prototype.update = function () {
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
        }
        else if (is_key_down(KeyCode.RIGHT_ARROW)) {
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
