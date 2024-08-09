import { $getRoot } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";

export const useTextContentSize = () => {
  const [editor] = useLexicalComposerContext();
  const [textContentSize, setTextContentSize] = useState(0);

  useEffect(() => {
    if (!editor) return
    const unregisterListener = editor.registerUpdateListener(({ editorState }) => {
      editor.getEditorState().read(() => {
        const rootNode = $getRoot();
        setTextContentSize(rootNode.getTextContentSize());
      });
    });
    return () => {
      unregisterListener();
    }
  }, [editor]);

  return {
    textContentSize
  }
}