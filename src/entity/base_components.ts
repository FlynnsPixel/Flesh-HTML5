
enum ComponentType {

  UNKNOWN,
  DISPLAY,
  MOTION
};

abstract class BaseComponent {

  parent: Entity;
  type: ComponentType = ComponentType.UNKNOWN;
  inited = false;

  abstract init();
  abstract update();
};

abstract class DisplayComponent extends BaseComponent {

  base: PIXI.Sprite;
  visibility = false;

  constructor() {
    super();
    this.type = ComponentType.DISPLAY;
  }
};


abstract class MotionComponent extends BaseComponent {

  constructor() {
    super();
    this.type = ComponentType.MOTION;
  }
};
