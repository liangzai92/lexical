import { throttle } from 'lodash-es';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useRef, useState } from 'react';
import MyScroll from '../../dom/scroll'
import Rect from '../../dom/rect'
const containerRect = new Rect()

const scrollContainer = document.documentElement

// 获取当前视口内的最上面的heading 从 startNode 开始 从下往上
const getTopHeadingInViewport = (editor: any, startNode: any, nodeList: any[] = []) => {
  let targetNode = startNode;

  let hasFind = false // 已经发现过处于当前视口内的heading了 从上往下的时候，从第一次发现开始，只需要再发现符合在视口内的就行了 避免遍历全部浪费性能
  for (let i = startNode.index - 1; i >= 0; i--) {
    const currentNode = nodeList[i];
    const currentElement = editor.getElementByKey(currentNode.key);
    if (!currentElement) {
      break
    }
    const clientRect = currentElement?.getClientRects()[0]
    if (containerRect.isIntersect(clientRect)) {
      targetNode = currentNode;
      hasFind = true
    } else {
      if (hasFind) {
        // targetNode = currentNode; // 从下往上找的时候 上一个heading标签虽然不在范围内，但section在。
        // const prevRect = editor.getElementByKey(targetNode.key)?.getClientRects?.()?.[0]
        // console.log('prevRect', prevRect)
        // if (prevRect?.top > 100) {
        //   targetNode = currentNode;
        // }
        break
      }
    }
  }
  return targetNode
}

// 获取当前视口最下面的heading 从 startNode 开始 从上往下
const getBottomHeadingInViewport = (editor: any, startNode: any, nodeList: any[] = []) => {
  let targetNode = startNode;

  let hasFind = false // 已经发现过处于当前视口内的heading了 从上往下的时候，从第一次发现开始，只需要再发现符合在视口内的就行了 避免遍历全部浪费性能
  for (let i = startNode.index + 1; i < nodeList.length; i++) {
    const currentNode: any = nodeList[i];
    const currentElement = editor.getElementByKey(currentNode.key);
    if (!currentElement) {
      break
    }
    const clientRect = currentElement?.getClientRects()[0]
    if (containerRect.isIntersect(clientRect)) {
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

function useConnectContentAndHeadingWhenScroll({
  contentHeadingList,
}: {
  contentHeadingList: Array<any>;
}) {
  const [editor] = useLexicalComposerContext();
  const [selectedNode, setSelectedNode] = useState<any>(contentHeadingList[0]);
  const lock = useRef(false);

  const scrollCallback = (e?: any) => {
    if (lock.current) {
      return
    }
    const scrollDirection = e?.direction || 'up';
    const getTargetNode = (currentHeadingNode: any, nodeList: any[]) => {
      let targetNode = currentHeadingNode;
      if (!currentHeadingNode) {
        targetNode = nodeList[0];
      }
      const currentHeadingElement = editor.getElementByKey(targetNode.key);
      if (!currentHeadingElement) {
        return
      }
      if (scrollDirection === 'down') {
        const topHeading: any = getTopHeadingInViewport(editor, targetNode, nodeList);
        targetNode = topHeading;
      } else {
        const bottomHeading: any = getBottomHeadingInViewport(editor, targetNode, nodeList);
        targetNode = bottomHeading;
      }
      return targetNode
    }

    const targetNode = getTargetNode(selectedNode, contentHeadingList)
    if (targetNode) {
      setSelectedNode(targetNode);
    }
  }

  useEffect(() => {
    if (!selectedNode && contentHeadingList[0]) {
      setSelectedNode(contentHeadingList[0])
      scrollCallback() // 初始化的时候，需要触发一次 根据当前content 定位右边
    }
  }, [contentHeadingList])

  useEffect(() => {
    if (!selectedNode) {
      return
    }

    const myScroll = new MyScroll()
    const throttledScrollCallback = throttle(scrollCallback, 60);
    myScroll.on('scroll', throttledScrollCallback);
    return () => {
      myScroll.destroy()
    }
  }, [contentHeadingList, editor, selectedNode]);

  const scrollToNode = (node: any) => {
    editor.getEditorState().read(() => {
      const domElement = editor.getElementByKey(node.key);
      if (!domElement) {
        return
      }
      setSelectedNode(node)
      domElement.scrollIntoView(); // 换成scroll scrollTo
      const style = window.getComputedStyle(domElement);
      const headingTopGap = (30 + parseFloat(style.marginTop))
      scrollContainer.scrollBy(0, -headingTopGap); // 由于scrollIntoView不支持offset，所以这里用scrollBy来模拟
      lock.current = true
      setTimeout(() => {
        lock.current = false
      }, 200)
    });
  }

  return { selectedNode, scrollToNode };
}

export default useConnectContentAndHeadingWhenScroll;
