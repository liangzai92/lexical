/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const hostName = window.location.hostname;
export const isDevPlayground: boolean =
  hostName !== 'playground.lexical.dev' &&
  hostName !== 'lexical-playground.vercel.app';

export const DEFAULT_SETTINGS = {
  disableBeforeInput: false,
  emptyEditor: isDevPlayground,
  isAutocomplete: false,
  isCharLimit: false,
  isCharLimitUtf8: false,
  isCollab: false,
  isMaxLength: false,
  measureTypingPerf: false,
  shouldUseLexicalContextMenu: false,
  showTableOfContents: false,
  tableCellBackgroundColor: true,
  tableCellMerge: true,
} as const;

// These are mutated in setupEnv
export const INITIAL_SETTINGS: Record<SettingName, boolean> = {
  ...DEFAULT_SETTINGS,
};

export type SettingName = keyof typeof DEFAULT_SETTINGS;

export type Settings = typeof INITIAL_SETTINGS;
