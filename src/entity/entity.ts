
class Entity {

  static id_inc: number = 0;
  id: number = 0;
  components: BaseComponent[] = [];

  constructor() {
    ++Entity.id_inc;
    this.id = Entity.id_inc;
    entity_list.push(this);
  }

  update() {
    for (var n = 0; n < this.components.length; ++n) {
      this.components[n].update();
    }
  }

  add(component: BaseComponent) {
    this.components.push(component);
  }

  get(type: ComponentType) {
    for (var n = 0; n < this.components.length; ++n) {
      if (this.components[n].type == type) {
        return this.components[n];
      }
    }
    console.log("error: component " + type + " was not found");
    return null;
  }

  init_new_components() {
    for (var n = 0; n < this.components.length; ++n) {
      if (!this.components[n].inited) {
        this.components[n].parent = this;
        this.components[n].init();
        this.components[n].inited = true;
      }
    }
  }
};

var entity_list: Entity[] = [];

function update_entities() {
  entity_list.forEach(function (e) {
    e.update();
  });
}
