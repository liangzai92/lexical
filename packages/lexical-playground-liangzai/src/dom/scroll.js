import EventEmitter from './EventEmitter.js';
import {getBCR, getScrollTop, getScrollHeight, getWindowHeight} from './dom.js';

class MyScroll extends EventEmitter {
  static getScrollTop = getScrollTop;
  static getScrollHeight = getScrollHeight;
  static getWindowHeight = getWindowHeight;

  scrollHasEndTimerThreshold = 120;

  constructor(wrapper, options) {
    super();
    this._init(wrapper, options);
  }

  _init = (wrapper, options) => {
    this.wrapper = wrapper || document;
    this._y0 = getScrollTop();
    this._y1 = getScrollTop();
    this._dy = 0;
    this.direction = 'top';

    this.originEvent = null;
    this.scrollHasEndTimer = null;
    this.scrollHasEndTimerThreshold = 120;

    this._bindEvent();
  };

  _bindEvent = () => {
    // 基于scroll事件 再包装 添加常用的滚动相关的信息
    // 这个地方可以考虑 多个实例的时候 不要绑定多次，只绑定一次
    this.wrapper.addEventListener('scroll', this._handleOriginEvent);
  };

  _handleOriginEvent = (event) => {
    // 使用箭头函数 确保this指向不被修改.
    this.originEvent = event;
    this._handleEvent(event);
  };

  _handleEvent = (event) => {
    clearTimeout(this.scrollHasEndTimer);

    if (getScrollTop() == 0) {
      this.emit('reachTop', this);
    }

    if (getScrollTop() + getWindowHeight() == getScrollHeight()) {
      this.emit('reachBottom', this);
    }

    let percent = getScrollTop() / (getScrollHeight() - getWindowHeight());

    this._y1 = getScrollTop();
    this._dy = this._y1 - this._y0;
    this._y0 = this._y1;
    if (this._dy > 0) {
      this.direction = 'up';
      this.emit('up', this); // 往下滚动事件
    } else if (this._dy < 0) {
      this.direction = 'down';
      this.emit('down', this); // 往上滚动事件
    }

    this.emit('scroll', this);
    this.scrollHasEndTimer = setTimeout(() => {
      this.emit('end', this); // 滚动结束事件
    }, this.scrollHasEndTimerThreshold);
  };

  destroy = () => {
    this.wrapper.removeEventListener('scroll', this._handleOriginEvent);
    this._events = Object.create(null);
  };
}

export default MyScroll;
