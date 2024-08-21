import type { TextNode } from 'lexical';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalTextEntity } from '@lexical/react/useLexicalTextEntity';
import { useCallback, useEffect } from 'react';

import { $createKeywordNode, KeywordNode } from '../../nodes/KeywordNode/KeywordNode';

const KEYWORDS_REGEX = /(^|$|[^A-Za-z])(congrats|todo|失败|成功|重点|警告|危险|注意|梁仔)(^|$|[^A-Za-z])/i;

export default function KeywordsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([KeywordNode])) {
      throw new Error('KeywordsPlugin: KeywordNode not registered on editor');
    }
  }, [editor]);

  const $createKeywordNode_ = useCallback((textNode: TextNode): KeywordNode => {
    return $createKeywordNode(textNode.getTextContent());
  }, []);

  const getKeywordMatch = useCallback((text: string) => {
    const matchArr = KEYWORDS_REGEX.exec(text);

    if (matchArr === null) {
      return null;
    }

    const hashtagLength = matchArr[2].length;
    const startOffset = matchArr.index + matchArr[1].length;
    const endOffset = startOffset + hashtagLength;
    return {
      end: endOffset,
      start: startOffset,
    };
  }, []);

  useLexicalTextEntity<KeywordNode>(
    getKeywordMatch,
    KeywordNode,
    $createKeywordNode_,
  );

  return null;
}
