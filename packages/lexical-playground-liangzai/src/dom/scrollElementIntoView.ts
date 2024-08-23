import { getScrollParent } from "./getScrollParent";

export const scrollElementIntoView = (el: HTMLElement) => {
  const scrollContainerElement = getScrollParent(el, true);
  const scrollContainerElementRect = scrollContainerElement.getBoundingClientRect();
  const elementRect = el.getBoundingClientRect();
  if ((elementRect.top > scrollContainerElementRect.top) && elementRect.top < (scrollContainerElementRect.top + scrollContainerElementRect.height)) {
    // console.log('in view')
  } else if (elementRect.top > (scrollContainerElementRect.top + scrollContainerElementRect.height)) {
    // 在容器 下外面
    const delta = elementRect.top - (scrollContainerElementRect.top + scrollContainerElementRect.height)
    scrollContainerElement.scrollTop = scrollContainerElement.scrollTop + delta + elementRect.height;
  } else {
    // 在容器 上外面
    const delta = scrollContainerElementRect.top - elementRect.top
    scrollContainerElement.scrollTop = scrollContainerElement.scrollTop - delta;
  }
}

export const scrollElementIntoView2 = (domElement: HTMLElement, offset = 30) => {
  domElement.scrollIntoView(); // 也可以换成scroll scrollTo
  const style = window.getComputedStyle(domElement);
  const headingTopGap = (offset + parseFloat(style.marginTop))
  const scrollParent = getScrollParent(domElement, true);
  scrollParent.scrollBy(0, -headingTopGap); // 由于scrollIntoView不支持offset，所以这里用scrollBy来模拟
}