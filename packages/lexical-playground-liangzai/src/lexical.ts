import { $unwrapMarkNode } from '@lexical/mark';
import { $getRoot, LexicalEditor, LexicalNode } from 'lexical';

export const unwrapAllMarkNodes = (editor: LexicalEditor) => {
  const unwrapMarkNodes = (nodes: any = []) => {
    nodes.forEach((node: LexicalNode) => {
      if (node.getType() === 'mark') {
        $unwrapMarkNode(node);
      } else {
        unwrapMarkNodes(node?.getChildren?.() || []);
      }
    });
  };

  editor.update(() => {
    const root = $getRoot();
    unwrapMarkNodes(root.getChildren());
  });
};