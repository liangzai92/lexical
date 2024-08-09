import { serializedDocumentFromEditorState } from "@lexical/file";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { throttle } from "lodash-es";
import { useEffect } from "react";
import { unwrapAllMarkNodes } from "./lexical";

const syncSerializedDocumentToLocalStorage = (editor: any) => {
  const doc = serializedDocumentFromEditorState(editor.getEditorState(), {
    source: 'rich-text.adebibi.com',
  })
  localStorage.setItem('lexical-document', JSON.stringify(doc));
}
const throttledSncSerializedDocumentToLocalStorage = throttle(syncSerializedDocumentToLocalStorage, 5000)

export const useHotkeys = () => {
  const [editor] = useLexicalComposerContext();
  // eslint-disable-next-line no-restricted-globals
  window.unwrapAllMarkNodes = () => {
    unwrapAllMarkNodes(editor)
  }

  useEffect(() => {
    const onCtrlS = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isSaveShortcut =
        (isMac && event.metaKey && event.key === 's') ||
        (!isMac && event.ctrlKey && event.key === 's');
      if (isSaveShortcut) {
        event.preventDefault(); // 阻止浏览器 ctl + s 保存网页的默认行为
        syncSerializedDocumentToLocalStorage(editor);
      }
    }
    document.addEventListener('keydown', onCtrlS);
    return () => {
      document.removeEventListener('keydown', onCtrlS);
    }
  }, [editor])
}