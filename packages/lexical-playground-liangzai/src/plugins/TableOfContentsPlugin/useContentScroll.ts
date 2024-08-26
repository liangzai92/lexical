import { throttle } from 'lodash-es';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import MyScroll from '../../dom/scroll'
import Rect from '../../dom/rect'
const containerRect = new Rect()

// 获取当前视口内的最上面的heading 从 startNode 开始 从下往上
const getTopHeadingInViewport = (editor: any, startNode: any, nodeList: any[] = []) => {
  let targetNode = startNode;
  let hasFind = false // 已经发现过处于当前视口内的heading了 从上往下的时候，从第一次发现开始，只需要再发现符合在视口内的就行了 避免遍历全部浪费性能
  for (let i = startNode.index - 1; i >= 0; i--) {
    const currentNode = nodeList[i];
    const currentElement = editor.getElementByKey(currentNode?.key);
    if (!currentElement) {
      break
    }
    const clientRect = currentElement?.getBoundingClientRect()
    if (containerRect.isIntersect(clientRect)) {
      targetNode = currentNode;
      hasFind = true
    } else {
      if (hasFind) {
        // targetNode = currentNode; // 从下往上找的时候 上一个heading标签虽然不在范围内，但section在。
        // const prevElement = editor.getElementByKey(targetNode.key);
        // const prevRect = prevElement.getBoundingClientRect()
        // const style = window.getComputedStyle(prevElement);
        // const offset = 30 + 30 // 理论上这些都不能写死。
        // const topThreshold = (offset + parseFloat(style.marginTop))
        // if (prevRect?.top > topThreshold) { // 说明上一个段落已经漏出来了
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
    const currentElement = editor.getElementByKey(currentNode?.key);
    if (!currentElement) {
      break
    }
    const clientRect = currentElement?.getBoundingClientRect()
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

const getTargetNode = (editor: any, startNode: any, nodeList: any[], scrollDirection: any) => {
  let targetNode = startNode;
  if (!startNode) {
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

export function useContentScroll({
  contentHeadingList,
  onTargetNodeChange,
  selectedNode,
}: {
  selectedNode: any,
  contentHeadingList: Array<any>;
  onTargetNodeChange: any
}) {
  const [editor] = useLexicalComposerContext();

  const scrollCallback = (e?: any) => {
    const scrollDirection = e?.direction || 'up';
    const targetNode = getTargetNode(editor, selectedNode, contentHeadingList, scrollDirection)
    if (targetNode) {
      onTargetNodeChange(targetNode);
    }
  }

  useEffect(() => {
    const currentFirstNode = contentHeadingList[0]
    if (!currentFirstNode) {
      return
    }
    if (!selectedNode || !editor.getElementByKey(selectedNode?.key)) {
      onTargetNodeChange(currentFirstNode)
      scrollCallback() // 初始化的时候，需要触发一次 根据当前content 定位右边
    }
  }, [contentHeadingList])

  useEffect(() => {
    if (!selectedNode) {
      return
    }

    const myScroll = new MyScroll()
    const throttledScrollCallback = throttle(scrollCallback, 60); // 这里实际上并未生效，得优化
    myScroll.on('scroll', throttledScrollCallback);
    return () => {
      myScroll.destroy()
    }
  }, [contentHeadingList, selectedNode, editor]);
}

export default useContentScroll;
