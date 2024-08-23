import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { FlashMessageContext } from './context/FlashMessageContext';
import { SettingsContext, useSettings } from './context/SettingsContext';
import { SharedAutocompleteContext } from './context/SharedAutocompleteContext';
import { SharedHistoryContext } from './context/SharedHistoryContext';
import Editor from './Editor';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import PasteLogPlugin from './plugins/PasteLogPlugin';
import { TableContext } from './plugins/TablePlugin';
import TypingPerfPlugin from './plugins/TypingPerfPlugin';
import Settings from './Settings';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import $prepopulatedRichText from './prepopulatedRichText';
import { editorStateFromSerializedDocument } from '@lexical/file';
import ArticleAuthor from './components/ArticleAuthor';
import { useEffect, useState } from 'react';

function App(): JSX.Element {
  const {
    settings: { measureTypingPerf, isCollab },
  } = useSettings();

  const getInitialConfig = async () => {
    const initialConfig: any = {
      namespace: 'editor.adebibi.com',
      editorState: undefined,
      nodes: [...PlaygroundNodes],
      onError: (error: Error) => {
        throw error;
      },
      theme: PlaygroundEditorTheme,
    };
    if (isCollab) {
      initialConfig.editorState = null // 
    } else {
      initialConfig.editorState = $prepopulatedRichText;
      // 这个参数可以是个回调，里面异步与否就随便搞了
      // initialConfig.editorState = (editor: any) => {
      //   // 从localStorage中获取文档
      //   const jsonString = localStorage.getItem('lexical-document') || ''
      //   if (jsonString || jsonString.trim()) {
      //     const editorState = editorStateFromSerializedDocument(editor, jsonString);
      //     editor.setEditorState(editorState);
      //   }
      // };
      // fetchRemoteDoc()
    }
    return initialConfig;
  }

  const [pageStatus, setPageStatus] = useState('pending');
  const [initialConfig, setInitialConfig] = useState<any>(null);
  const init = async () => {
    const initialConfig = await getInitialConfig(); // 只有初始化的时候 非响应式 因为只在mounted的时候初始化执行一次 具体可以看LexicalComposer组件的实现
    setInitialConfig(initialConfig);
    setPageStatus('resolve')
  }
  
  useEffect(() => {
    init()
  }, [])

  if (pageStatus === 'pending') {
    return <div>loading...</div>
  }

  if (pageStatus === 'reject') {
    return <div>error</div>
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <TableContext>
          <SharedAutocompleteContext>
            <div className='editor-page'>
              <div className='page-header'>
                <ArticleAuthor />
              </div>
              <Editor />
              <div className='page-footer'></div>
              <div>
                <Settings />
                <PasteLogPlugin />
                <TypingPerfPlugin />
              </div>
            </div>
          </SharedAutocompleteContext>
        </TableContext>
      </SharedHistoryContext>
    </LexicalComposer>
  );
}

export default function AppWrapper(): JSX.Element {
  return (
    <SettingsContext>
      <FlashMessageContext>
        <App />
      </FlashMessageContext>
    </SettingsContext>
  );
}
