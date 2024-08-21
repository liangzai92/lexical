class EventEmitter {
  _events = Object.create(null);

  constructor() {
    this._events = Object.create(null);
  }

  on = (type, handler) => {
    (this._events[type] || (this._events[type] = [])).push(handler);
  };

  off = (type, handler) => {
    if (this._events[type]) {
      this._events[type].splice(this._events[type].indexOf(handler) >>> 0, 1);
    }
  };

  once = (type, handler) => {
    let fired = false;

    function magic(...args) {
      this.off(type, magic);

      if (!fired) {
        fired = true;
        handler(...args);
      }
    }

    this.on(type, magic);
  };

  emit = (type, ...args) => {
    const handlers = this._events[type] || [];
    for (let i = 0; i < handlers.length; i++) {
      const handler = this._events[type][i];
      handler(...args);
    }
  };
}

export default EventEmitter;
