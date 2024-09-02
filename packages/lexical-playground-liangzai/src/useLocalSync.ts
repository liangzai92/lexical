import { editorStateFromSerializedDocument, serializedDocumentFromEditorState } from "@lexical/file";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { throttle } from "lodash-es";
import { useEffect } from "react";
import { transformHtmlStringToEditor } from "./helpers/transformHtmlStringToEditor";

const syncSerializedDocumentToLocalStorage = (editor: any) => {
  const doc = serializedDocumentFromEditorState(editor.getEditorState(), {
    source: 'rich-text.adebibi.com',
  })
  localStorage.setItem('lexical-document', JSON.stringify(doc));
}
const throttledSyncSerializedDocumentToLocalStorage = throttle(syncSerializedDocumentToLocalStorage, 5000)

export const useLocalSync = () => {
  const [editor] = useLexicalComposerContext();

  const syncEditorStateFromLocalStorage = () => {
    const jsonString = localStorage.getItem('lexical-document') || ''
    if (!jsonString || !jsonString.trim()) {
      return
    }
    const editorState = editorStateFromSerializedDocument(editor, jsonString);
    editor.setEditorState(editorState);
  }

  useEffect(() => {
    if (!editor) return
    // fetchRemoteDoc()
    setTimeout(() => {
      // transformHtmlStringToEditor(editor, '<p>hello world</p>')
      syncEditorStateFromLocalStorage()
    }, 2000);
  }, [editor])

  // useEffect(() => {
  //   if (!editor) return
  //   const unregisterListener = editor.registerUpdateListener(({ editorState }) => {
  //     throttledSyncSerializedDocumentToLocalStorage(editor);
  //   });
  //   return () => {
  //     unregisterListener();
  //   }
  // }, [editor]);
  return {
  }
}


