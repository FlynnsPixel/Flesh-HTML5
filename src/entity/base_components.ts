
enum ComponentType {

  UNKNOWN,
  DISPLAY,
  MOTION
};

abstract class BaseComponent {

  type: ComponentType = ComponentType.UNKNOWN;

  private inited = false;

  abstract init();
  abstract update();

  has_init() { return this.inited; }
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
