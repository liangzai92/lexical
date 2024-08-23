import classNames from 'classnames'
import { TableOfContentsPlugin as LexicalTableOfContentsPlugin } from '@lexical/react/LexicalTableOfContentsPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useRef, useState } from 'react';
import { scrollElementIntoView, scrollElementIntoView2 } from '../../dom/scrollElementIntoView';
import useContentScroll from './useContentScroll';
import './index.css';

export function TableOfContentsList({
  contentHeadingList,
}: {
  contentHeadingList: Array<any>;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const itemsRef = useRef<HTMLLIElement[]>([]);
  const instanceProps = useRef({
    lockSyncTarget: false,
    isPointerEnter: false,
  })

  const scrollNodeIntoView = (node: any) => {
    editor.getEditorState().read(() => {
      const domElement = editor.getElementByKey(node.key);
      if (!domElement) {
        return
      }
      setSelectedNode(node)
      scrollElementIntoView2(domElement, 30) // 这个30后面要改成动态的
      instanceProps.current.lockSyncTarget = true
      setTimeout(() => {
        instanceProps.current.lockSyncTarget = false
      }, 200)
    });
  }

  useContentScroll({
    contentHeadingList: contentHeadingList,
    selectedNode,
    onTargetNodeChange: (targetNode) => {
      if (instanceProps.current.lockSyncTarget) {
        return
      }
      setSelectedNode(targetNode)
      if (instanceProps.current.isPointerEnter) {
        // 如果鼠标在目录上，不自动滚动
        return
      }
      if (!targetNode) {
        return
      }
      const el = itemsRef.current[targetNode.index];
      if (el) {
        scrollElementIntoView(el);
      }
    },
  });

  const List = () => {
    if (!contentHeadingList?.length) {
      return null
    }

    return <ul className="heading-list">
      {contentHeadingList.map((node, index) => {
        return (
          <li
            key={node.key}
            className={classNames('heading-item', {
              'selected': selectedNode?.key === node.key,
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
                scrollNodeIntoView(node)
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
    <div className="table-of-contents"
      onPointerEnter={() => {
        instanceProps.current.isPointerEnter = true
      }}
      onPointerLeave={() => {
        instanceProps.current.isPointerEnter = false
      }}
    >
      <List />
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