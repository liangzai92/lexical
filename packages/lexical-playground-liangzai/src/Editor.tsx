import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CharacterLimitPlugin } from '@lexical/react/LexicalCharacterLimitPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { useEffect, useState } from 'react';
import { CAN_USE_DOM } from 'shared/canUseDOM';

import { createWebsocketProvider } from './collaboration';
import { useSettings } from './context/SettingsContext';
import { useSharedHistoryContext } from './context/SharedHistoryContext';
import ActionsPlugin from './plugins/ActionsPlugin';
import AutocompletePlugin from './plugins/AutocompletePlugin';
import AutoEmbedPlugin from './plugins/AutoEmbedPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import CodeActionMenuPlugin from './plugins/CodeActionMenuPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import CollapsiblePlugin from './plugins/CollapsiblePlugin';
import CommentPlugin from './plugins/CommentPlugin';
import ComponentPickerPlugin from './plugins/ComponentPickerPlugin';
import ContextMenuPlugin from './plugins/ContextMenuPlugin';
import DragDropPaste from './plugins/DragDropPastePlugin';
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin';
import EmojiPickerPlugin from './plugins/EmojiPickerPlugin';
import EmojisPlugin from './plugins/EmojisPlugin';
import EquationsPlugin from './plugins/EquationsPlugin';
import ExcalidrawPlugin from './plugins/ExcalidrawPlugin';
import FigmaPlugin from './plugins/FigmaPlugin';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin';
import ImagesPlugin from './plugins/ImagesPlugin';
import InlineImagePlugin from './plugins/InlineImagePlugin';
import KeywordsPlugin from './plugins/KeywordsPlugin';
import { LayoutPlugin } from './plugins/LayoutPlugin/LayoutPlugin';
import LinkPlugin from './plugins/LinkPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import MarkdownShortcutPlugin from './plugins/MarkdownShortcutPlugin';
import { MaxLengthPlugin } from './plugins/MaxLengthPlugin';
import MentionsPlugin from './plugins/MentionsPlugin';
import PageBreakPlugin from './plugins/PageBreakPlugin';
import PollPlugin from './plugins/PollPlugin';
import SpeechToTextPlugin from './plugins/SpeechToTextPlugin';
import TabFocusPlugin from './plugins/TabFocusPlugin';
import TableCellActionMenuPlugin from './plugins/TableActionMenuPlugin';
import TableCellResizer from './plugins/TableCellResizer';
import TableHoverActionsPlugin from './plugins/TableHoverActionsPlugin';
import TableOfContentsPlugin from './plugins/TableOfContentsPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import TwitterPlugin from './plugins/TwitterPlugin';
import YouTubePlugin from './plugins/YouTubePlugin';
import ContentEditable from './ui/ContentEditable';
import { useTextContentSize } from './useTextContentSize';
import { useHotkeys } from './useHotkeys';
import { useSmallWidthViewport } from './useSmallWidthViewport';
import { MenuUnfoldOutlined } from '@ant-design/icons';

export default function Editor(): JSX.Element {
  const { historyState } = useSharedHistoryContext();
  const {
    settings: {
      isCollab,
      isAutocomplete,
      isMaxLength,
      isCharLimit,
      isCharLimitUtf8,
      showTableOfContents,
      shouldUseLexicalContextMenu,
      tableCellMerge,
      tableCellBackgroundColor,
    },
  } = useSettings();
  const isEditable = useLexicalEditable();
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const isSmallWidthViewport = useSmallWidthViewport();
  const { textContentSize } = useTextContentSize()
  useHotkeys()

  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const [leftShow, setLeftShow] = useState(false)

  const placeholder = isCollab ? '请开始你的协作输入' : '请开始你的输入'
  return (
    <>
      <div className="editor-shell">
        {leftShow && <div className='left-col'>
          <div className='file-list'>
            文件目录树结构
            <div>我的文档列表</div>
          </div>
        </div>}
        <div className='middle-col'>
          {isEditable && <div className='top-row'>
            <div className='max-container'>
              <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
            </div>
          </div>}
          <div className='main-row'>
            <div className="content-wrapper">
              {isMaxLength && <MaxLengthPlugin maxLength={100000} />}
              <DragDropPaste />
              <AutoFocusPlugin />
              <ClearEditorPlugin />
              <ComponentPickerPlugin />
              <EmojiPickerPlugin />
              <AutoEmbedPlugin />

              <MentionsPlugin />
              <EmojisPlugin />
              <HashtagPlugin />
              <KeywordsPlugin />
              <SpeechToTextPlugin />
              <AutoLinkPlugin />
              <CommentPlugin
                providerFactory={isCollab ? createWebsocketProvider : undefined}
              />
              <>
                {isCollab ? (
                  <CollaborationPlugin
                    id="main"
                    providerFactory={createWebsocketProvider}
                    shouldBootstrap={false}
                  />
                ) : (
                  <HistoryPlugin externalHistoryState={historyState} />
                )}
                <RichTextPlugin
                  contentEditable={
                    <div className="editor" ref={onRef}>
                      <ContentEditable placeholder={placeholder} />
                    </div>
                  }
                  ErrorBoundary={LexicalErrorBoundary}
                />
                <MarkdownShortcutPlugin />
                <CodeHighlightPlugin />
                <ListPlugin />
                <CheckListPlugin />
                <ListMaxIndentLevelPlugin maxDepth={7} />
                <TablePlugin
                  hasCellMerge={tableCellMerge}
                  hasCellBackgroundColor={tableCellBackgroundColor}
                />
                <TableCellResizer />
                <TableHoverActionsPlugin />
                <ImagesPlugin />
                <InlineImagePlugin />
                <LinkPlugin />
                <PollPlugin />
                <TwitterPlugin />
                <YouTubePlugin />
                <FigmaPlugin />
                <ClickableLinkPlugin disabled={isEditable} />
                <HorizontalRulePlugin />
                <EquationsPlugin />
                <ExcalidrawPlugin />
                <TabFocusPlugin />
                <TabIndentationPlugin />
                <CollapsiblePlugin />
                <PageBreakPlugin />
                <LayoutPlugin />
                {floatingAnchorElem && !isSmallWidthViewport && (
                  <>
                    <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                    <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                    <FloatingLinkEditorPlugin
                      anchorElem={floatingAnchorElem}
                      isLinkEditMode={isLinkEditMode}
                      setIsLinkEditMode={setIsLinkEditMode}
                    />
                    <TableCellActionMenuPlugin
                      anchorElem={floatingAnchorElem}
                      cellMerge={true}
                    />
                    <FloatingTextFormatToolbarPlugin
                      anchorElem={floatingAnchorElem}
                      setIsLinkEditMode={setIsLinkEditMode}
                    />
                  </>
                )}
              </>
              {(isCharLimit || isCharLimitUtf8) && (
                <CharacterLimitPlugin
                  charset={isCharLimit ? 'UTF-16' : 'UTF-8'}
                  maxLength={5}
                />
              )}
              {isAutocomplete && <AutocompletePlugin />}
              {shouldUseLexicalContextMenu && <ContextMenuPlugin />}
            </div>
          </div>
          <div className='bottom-row'>
            <div className='max-container'>
              <div className='more-action-row'>
                <ActionsPlugin />
                <div className='text-count'>
                  Text：{textContentSize}
                </div>
              </div>
            </div>
          </div>
        </div>
        {showTableOfContents && <div className='right-col'>
          <TableOfContentsPlugin />
        </div>}
      </div>
      <button className='left-toggle-btn' onClick={() => {
        setLeftShow((prev) => !prev)
      }}>
        <MenuUnfoldOutlined />
      </button>
    </>
  );
}
