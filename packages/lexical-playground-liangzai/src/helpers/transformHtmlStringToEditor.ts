import { $getRoot } from "lexical";
import { $generateNodesFromDOM } from "@lexical/html";

export const transformHtmlStringToEditor = (editor: any, htmlString: string) => {
  editor.update(() => {
    const root = $getRoot();
    root.clear();
    const parser = new DOMParser();
    const dom = parser.parseFromString(htmlString, 'text/html');
    const nodes = $generateNodesFromDOM(editor, dom);
    nodes.forEach(node => {
      root.append(node);
    });
  })
}