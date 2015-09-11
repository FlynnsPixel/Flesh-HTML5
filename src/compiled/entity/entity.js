var Entity = (function () {
    function Entity() {
        this.id = 0;
        this.components = [];
        ++Entity.id_inc;
        this.id = Entity.id_inc;
        entity_list.push(this);
    }
    Entity.prototype.update = function () {
        for (var n = 0; n < this.components.length; ++n) {
            this.components[n].update();
        }
    };
    Entity.prototype.add = function (component) {
        this.components.push(component);
    };
    Entity.prototype.get = function (type) {
        for (var n = 0; n < this.components.length; ++n) {
            if (this.components[n].type == type) {
                return this.components[n];
            }
        }
        console.log("error: component " + type + " was not found");
        return null;
    };
    Entity.prototype.init_new_components = function () {
        for (var n = 0; n < this.components.length; ++n) {
            if (!this.components[n].inited) {
                this.components[n].parent = this;
                this.components[n].init();
                this.components[n].inited = true;
            }
        }
    };
    Entity.id_inc = 0;
    return Entity;
})();
;
var entity_list = [];
function update_entities() {
    entity_list.forEach(function (e) {
        e.update();
    });
}
