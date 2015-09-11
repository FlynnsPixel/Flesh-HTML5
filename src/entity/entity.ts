
class Entity {

  static id_inc: number = 0;
  id: number = 0;
  components: BaseComponent[] = [];

  constructor() {
    ++Entity.id_inc;
    this.id = Entity.id_inc;
  }

  add(component: BaseComponent) {
    this.components.push(component);
  }

  get(type: ComponentType) {
    var component: BaseComponent = null;
    for (var n = 0; n < this.components.length; ++n) {

    }
    if (!component) {
      console.log("error: component " + type + " was not found");
    }
    return component;
  }

  init_new_components() {
    for (var n = 0; n < this.components.length; ++n) {
      if (this.components[n].has_init()) {
        this.components[n].init();
      }
    }
  }
};
