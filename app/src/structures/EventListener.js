module.exports = class {
    constructor(self, options = {}) {
        this.self = self;
      
        this.once = false;
        this.listenerName = null;
      
        for (const prop in options) {
            if (this.hasOwnProperty(prop)) {
                this[prop] = options[prop];
            }
        }
    }
};