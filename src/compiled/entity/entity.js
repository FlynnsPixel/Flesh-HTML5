var Entity = (function () {
    function Entity() {
        this.id = 0;
        this.components = [];
        ++Entity.id_inc;
        this.id = Entity.id_inc;
    }
    Entity.prototype.add = function (component) {
        this.components.push(component);
    };
    Entity.prototype.get = function (type) {
        var component = null;
        for (var n = 0; n < this.components.length; ++n) {
        }
        if (!component) {
            console.log("error: component " + type + " was not found");
        }
        return component;
    };
    Entity.prototype.init_new_components = function () {
        for (var n = 0; n < this.components.length; ++n) {
            if (this.components[n].has_init()) {
                this.components[n].init();
            }
        }
    };
    Entity.id_inc = 0;
    return Entity;
})();
;
