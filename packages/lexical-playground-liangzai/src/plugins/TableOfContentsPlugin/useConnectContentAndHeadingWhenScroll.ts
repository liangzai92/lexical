import { throttle } from 'lodash-es';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const TOP_VIEWPORT_GAP = 33;
const BOTTOM_VIEWPORT_GAP = 33;

function useConnectContentAndHeadingWhenScroll({
  contentHeadingList,
}: {
  contentHeadingList: Array<any>;
}) {
  const [editor] = useLexicalComposerContext();
  const [selectedNode, setSelectedNode] = useState<any>(contentHeadingList[0]);

  useEffect(() => {
    if (!selectedNode && contentHeadingList[0]) {
      setSelectedNode(contentHeadingList[0])
    }
  }, [contentHeadingList])

  useEffect(() => {
    if (!selectedNode) {
      return
    }
    const scrollCallback = () => {
      // 获取当前视口内的最上面的heading 从 startNode 开始 从下往上
      const getTopHeadingInViewport = (startNode: any, nodeList: any[] = []) => {
        let targetNode = startNode;

        let hasFind = false // 已经发现过处于当前视口内的heading了 从上往下的时候，从第一次发现开始，只需要再发现符合在视口内的就行了 避免遍历全部浪费性能
        for (let i = startNode.index - 1; i > 0; i--) {
          const currentNode = nodeList[i];
          const currentElement = editor.getElementByKey(currentNode.key);
          if (!currentElement) {
            break
          }
          const rect = currentElement?.getClientRects()[0]
          const isInViewport = rect.bottom > BOTTOM_VIEWPORT_GAP && rect.bottom < (window.innerHeight - TOP_VIEWPORT_GAP)
          if (isInViewport) {
            targetNode = currentNode;
            hasFind = true
          } else {
            if (hasFind) {
              break
            }
          }
        }
        return targetNode
      }

      // 获取当前视口最下面的heading 从 startNode 开始 从上往下
      const getBottomHeadingInViewport = (startNode: any, nodeList: any[] = []) => {
        let targetNode = startNode;

        let hasFind = false // 已经发现过处于当前视口内的heading了 从上往下的时候，从第一次发现开始，只需要再发现符合在视口内的就行了 避免遍历全部浪费性能
        for (let i = startNode.index + 1; i < nodeList.length; i++) {
          const currentNode: any = nodeList[i];
          const currentElement = editor.getElementByKey(currentNode.key);
          if (!currentElement) {
            break
          }
          const rect = currentElement?.getClientRects()[0]
          const isInViewport = rect.top < (window.innerHeight - BOTTOM_VIEWPORT_GAP) && rect.top > TOP_VIEWPORT_GAP
          if (isInViewport) {
            targetNode = currentNode;
            hasFind = true
          } else {
            if (hasFind) {
              break
            }
          }
        }
        return targetNode;
      }

      const getTargetNode = (currentHeadingNode: any, nodeList: any[]) => {
        let targetNode = currentHeadingNode;
        if (!currentHeadingNode) {
          targetNode = nodeList[0];
        }
        const currentHeadingElement = editor.getElementByKey(targetNode.key);
        if (!currentHeadingElement) {
          return
        }

        const rect: any = currentHeadingElement?.getClientRects()[0]
        // 当前的这个还在视口内 或者在视口上方，说明正在【往下翻看靠下面的内容】，这个时候从上往下找目标node
        if (rect.top < (window.innerHeight - BOTTOM_VIEWPORT_GAP)) {
          const bottomHeading: any = getBottomHeadingInViewport(targetNode, nodeList);
          targetNode = bottomHeading;
        } else {
          // 当前的这个 已经不在视口内了，而且还是到了视口下方，说明正在【往上翻看靠上面的内容】，这个时候从下上找目标node
          const topHeading: any = getTopHeadingInViewport(targetNode, nodeList);
          const bottomHeading: any = getBottomHeadingInViewport(topHeading, nodeList);
          targetNode = bottomHeading;
        }
        return targetNode
      }

      const targetNode = getTargetNode(selectedNode, contentHeadingList)
      if (targetNode) {
        setSelectedNode(targetNode);
      }
    }
    const throttledScrollCallback = throttle(scrollCallback, 60);

    document.addEventListener('scroll', throttledScrollCallback);
    return () => {
      document.removeEventListener('scroll', throttledScrollCallback);
    }
  }, [contentHeadingList, editor, selectedNode]);

  const scrollToNode = (node: any) => {
    editor.getEditorState().read(() => {
      const domElement = editor.getElementByKey(node.key);
      if (!domElement) {
        return
      }
      setSelectedNode(node)
      domElement.scrollIntoView();
    });
  }

  return { selectedNode, scrollToNode };
}

export default useConnectContentAndHeadingWhenScroll;
