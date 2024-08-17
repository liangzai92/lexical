class Rect {
  element = null;
  DOMRect = {};
  constructor(element, options) {
    this.init(element, options);
  }

  init = (element, options) => {
    this.element = element;
    if (!this.element) {
      // 默认数据是滚动window
      this.DOMRect = {
        top: 0,
        bottom: window.innerHeight,
        height: window.innerHeight,
        left: 0,
        right: 0,
        width: window.innerWidth,
      };
    }
  };

  getBoundingClientRect = () => {
    if (this.element) {
      this.DOMRect = this.element.getBoundingClientRect();
      return this.DOMRect;
    } else {
      return this.DOMRect;
    }
  };

  getScrollContainerTopCover = () => {
    return 30;
  };

  getScrollContainerBottomCover = () => {
    return 30;
  };

  _getVisibleAreaTop = () => {
    const visibleAreaTop =
      this.getBoundingClientRect().top + this.getScrollContainerTopCover();
    return visibleAreaTop;
  };

  _getVisibleAreaBottom = () => {
    const visibleAreaBottom =
      this.getBoundingClientRect().bottom -
      this.getScrollContainerBottomCover();
    return visibleAreaBottom;
  };

  isAbove = (rect: any) => {
    return rect.bottom < this._getVisibleAreaTop();
  };

  isUnder = (rect: any) => {
    return rect.top > this._getVisibleAreaBottom();
  };

  isIntersect = (rect: any) => {
    const inTheVisibleArea = !this.isAbove(rect) && !this.isUnder(rect);
    return inTheVisibleArea;
  };
}

export default Rect;
