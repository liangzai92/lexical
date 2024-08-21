import classNames from 'classnames'
import { TableOfContentsPlugin as LexicalTableOfContentsPlugin } from '@lexical/react/LexicalTableOfContentsPlugin';
import useConnectContentAndHeadingWhenScroll from './useConnectContentAndHeadingWhenScroll';
import { useEffect, useMemo, useRef } from 'react';
import './index.css';
import { getScrollParent } from '../../dom/getScrollParent';

export function TableOfContentsList({
  contentHeadingList,
}: {
  contentHeadingList: Array<any>;
}): JSX.Element {
  const { selectedNode, scrollToNode } = useConnectContentAndHeadingWhenScroll({ contentHeadingList: contentHeadingList });
  const itemsRef = useRef<HTMLLIElement[]>([]);

  useEffect(() => {
    if (!selectedNode) {
      return
    }
    const el = itemsRef.current[selectedNode.index];
    if (!el) {
      return
    }
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
  }, [selectedNode?.key])

  const List = () => {
    if (!contentHeadingList.length || !selectedNode) {
      return null
    }
    return <ul className="heading-list">
      {contentHeadingList.map((node, index) => {
        return (
          <li
            key={node.key}
            className={classNames('heading-item', {
              'selected': selectedNode.key === node.key,
              [`heading-${node.tag}`]: true,
            })}
            ref={(el) => {
              itemsRef.current[index] = el as HTMLLIElement;
            }}
          >
            <div
              role="button"
              className='heading-text'
              tabIndex={0}
              onClick={() => {
                scrollToNode(node)
                // 因为使用的scrollIntoView，但此方法不支持offset
              }}
            >
              {node.text}
            </div>
          </li>
        );
      })}
    </ul>
  }

  return (
    <div className="table-of-contents">
      {contentHeadingList.length > 0 && <List />}
    </div>
  );
}

export default function TableOfContentsPlugin() {
  return (
    <LexicalTableOfContentsPlugin>
      {(tableOfContents) => {
        const contentHeadingList = tableOfContents.map(([key, text, tag], index) => {
          return { key, text, tag, index }
        })
        return <TableOfContentsList contentHeadingList={contentHeadingList} />;
      }}
    </LexicalTableOfContentsPlugin>
  );
}
