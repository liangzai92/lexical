import classNames from 'classnames'
import { TableOfContentsPlugin as LexicalTableOfContentsPlugin } from '@lexical/react/LexicalTableOfContentsPlugin';
import useConnectContentAndHeadingWhenScroll from './useConnectContentAndHeadingWhenScroll';
import { useEffect, useMemo, useRef } from 'react';
import './index.css';

export function TableOfContentsList({
  contentHeadingList,
}: {
  contentHeadingList: Array<any>;
}): JSX.Element {
  const { selectedNode, scrollToNode } = useConnectContentAndHeadingWhenScroll({ contentHeadingList: contentHeadingList });
  const itemsRef = useRef<HTMLLIElement[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | any>(null);

  useEffect(() => {
    if (!selectedNode) {
      return
    }
    const el = itemsRef.current[selectedNode.index];
    if (!el) {
      return
    }
    const elementRect = el.getBoundingClientRect();
    const containerRect = scrollContainerRef.current.getBoundingClientRect();
    if ((elementRect.top > containerRect.top) && elementRect.top < (containerRect.top + containerRect.height)) {
      // console.log('in view')
    } else if (elementRect.top > (containerRect.top + containerRect.height)) {
      // 在容器 下外面
      const delta = elementRect.top - (containerRect.top + containerRect.height)
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollTop + delta + elementRect.height;
    } else {
      // 在容器 上外面
      const delta = containerRect.top - elementRect.top
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollTop - delta;
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
              onClick={() => scrollToNode(node)}
            >
              {node.text}
            </div>
          </li>
        );
      })}
    </ul>
  }

  return (
    <div className="table-of-contents" ref={scrollContainerRef}>
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
