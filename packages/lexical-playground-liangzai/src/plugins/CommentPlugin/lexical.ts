import type { LexicalCommand, NodeKey } from 'lexical';
import { createCommand } from 'lexical';

export const INSERT_INLINE_COMMAND: LexicalCommand<void> = createCommand(
  'INSERT_INLINE_COMMAND',
);