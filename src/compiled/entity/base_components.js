var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ComponentType;
(function (ComponentType) {
    ComponentType[ComponentType["UNKNOWN"] = 0] = "UNKNOWN";
    ComponentType[ComponentType["DISPLAY"] = 1] = "DISPLAY";
    ComponentType[ComponentType["MOTION"] = 2] = "MOTION";
})(ComponentType || (ComponentType = {}));
;
var BaseComponent = (function () {
    function BaseComponent() {
        this.type = ComponentType.UNKNOWN;
        this.inited = false;
    }
    return BaseComponent;
})();
;
var DisplayComponent = (function (_super) {
    __extends(DisplayComponent, _super);
    function DisplayComponent() {
        _super.call(this);
        this.visibility = false;
        this.type = ComponentType.DISPLAY;
    }
    return DisplayComponent;
})(BaseComponent);
;
var MotionComponent = (function (_super) {
    __extends(MotionComponent, _super);
    function MotionComponent() {
        _super.call(this);
        this.type = ComponentType.MOTION;
    }
    return MotionComponent;
})(BaseComponent);
;
