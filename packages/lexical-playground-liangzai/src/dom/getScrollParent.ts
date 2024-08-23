export function getScrollParent(
  element: HTMLElement,
  includeHidden: boolean,
): HTMLElement | HTMLBodyElement {
  let style = getComputedStyle(element);
  const excludeStaticParent = style.position === 'absolute';
  const overflowRegex = includeHidden
    ? /(auto|scroll|hidden)/
    : /(auto|scroll)/;
  if (style.position === 'fixed') {
    return document.documentElement;
  }
  for (
    let parent: HTMLElement | null = element;
    (parent = parent.parentElement);

  ) {
    style = getComputedStyle(parent);
    if (excludeStaticParent && style.position === 'static') {
      continue;
    }
    if (
      overflowRegex.test(style.overflow + style.overflowY + style.overflowX)
    ) {
      return parent;
    }
  }
  return document.documentElement;
}


export function getElementPositionRelativeToScrollContainer(element: HTMLElement | any) {
  let xPos = 0;
  let yPos = 0;
  const scrollParent = getScrollParent(element, false);

  while (element) {
    if (element === scrollParent) {
      break;
    }
    xPos += element.offsetLeft - element.scrollLeft + element.clientLeft;
    yPos += element.offsetTop - element.scrollTop + element.clientTop;
    element = element.offsetParent;
  }

  return {
    left: xPos,
    top: yPos
  };
}
