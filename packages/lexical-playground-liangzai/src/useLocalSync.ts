import { editorStateFromSerializedDocument, serializedDocumentFromEditorState } from "@lexical/file";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { throttle } from "lodash-es";
import { useEffect } from "react";

const syncSerializedDocumentToLocalStorage = (editor: any) => {
  const doc = serializedDocumentFromEditorState(editor.getEditorState(), {
    source: 'rich-text.adebibi.com',
  })
  localStorage.setItem('lexical-document', JSON.stringify(doc));
}

const throttledSyncSerializedDocumentToLocalStorage = throttle(syncSerializedDocumentToLocalStorage, 5000)

export const useLocalSync = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor) return
    const text = localStorage.getItem('lexical-document') || ''
    if (!text || !text.trim()) {
      return
    }
    const editorState = editorStateFromSerializedDocument(editor, text);
    editor.setEditorState(editorState);
  }, [editor])

  useEffect(() => {
    if (!editor) return
    const unregisterListener = editor.registerUpdateListener(({ editorState }) => {
      throttledSyncSerializedDocumentToLocalStorage(editor);
    });
    return () => {
      unregisterListener();
    }
  }, [editor]);
}