import chroma from 'chroma-js';

/**
 * 主题不只有非常偏白和黑两种，还有带有一定色彩的主题，当色彩相对明显之后要改策略
 */

const adjustColor = (color: string, lightness: number, saturation: number) => {
  return chroma(color).set('hsl.s', saturation).set('hsl.l', lightness).hex();
};

function setThemeCssVars(theme: 'dark' | 'light') {
  let color__primary = chroma.random();
  let color__bg = chroma(color__primary).tint(0.98);
  let color_text = chroma(color__primary).shade(0.9);
  if (theme === 'dark') {
    color__bg = chroma(color__primary).shade(0.9);
    color_text = chroma(color__primary).tint(0.9);
  }
  const [h, s, l, a] = chroma(color__primary).hsl();

  const color__bg__hover = theme === 'dark' ? chroma(color__primary).tint(0.75) : chroma(color__primary).tint(0.75)
  const color__bg__active = theme === 'dark' ? chroma(color__primary).tint(0.75) : chroma(color__primary).tint(0.5);

  const color__hover = theme === 'dark' ? chroma(color__primary).tint(0.75) : chroma(color__primary).tint(0.75);
  const color__focus = theme === 'dark' ? chroma(color__primary).tint(0.75) : chroma(color__primary).tint(0.5);
  const color__active = theme === 'dark' ? chroma(color__primary).tint(0.75) : chroma(color__primary).tint(0.5);

  const color__border = theme === 'dark' ? chroma(color__primary).tint(0.75) : chroma(color__primary).tint(0.9)

  const color_blockquote__bg = theme === 'dark' ? chroma(color__bg).tint(0.01) : chroma(color__primary).tint(0.95);

  const color_collapsible__bg = theme === 'dark' ? chroma(color__bg).tint(0.01) : chroma(color__primary).tint(0.98);
  const color_collapsible__border = theme === 'dark' ? chroma(color__primary).tint(0.95) : chroma(color__primary).tint(0.95)

  const color_toc__bg__selected = theme === 'dark' ? chroma(color__primary).tint(0.05) : chroma(color__primary).tint(0.95);
  const color_divider__border = theme === 'dark' ? chroma(color__primary).tint(0.95) : chroma(color__primary).tint(0.95)
  const color_code__bg = theme === 'dark' ? chroma(color__bg).tint(0.01) : chroma(color__primary).tint(0.95);

  const color_text__l1 = chroma(color_text).tint(0.1)
  const color_text__decoration__strikethrough = theme === 'dark' ? chroma(color_text).shade(1) : chroma(color_text).shade(1)
  const color_textCode__bg = theme === 'dark' ? chroma(color__primary).tint(0.75) : chroma(color__primary).tint(0.9)
  const color_popover__font = theme === 'dark' ? color_text : color_text;
  const popoverBgColor = theme === 'dark' ? chroma(color__primary).tint(0.75) : chroma(color__primary).tint(1)

  // 创建并插入 <style> 标签
  const style = document.createElement('style');
  style.innerHTML = `
    :root {
      --lz-color__bg: ${color__bg};
      --lz-color__primary: ${color__primary};
      --lz-color__hover: ${color__hover};
      --lz-color__focus: ${color__focus};
      --lz-color__active: ${color__active};
      --lz-color__bg__hover: ${color__bg__hover};
      --lz-color__bg__active: ${color__bg__active};
      --lz-color__border: ${color__border};
      --lz-color_blockquote__bg: ${color_blockquote__bg};
      --lz-color_collapsible__bg: ${color_collapsible__bg};
      --lz-color_collapsible__border: ${color_collapsible__border};
      --lz-color_toc__bg__selected: ${color_toc__bg__selected};
      --lz-color_divider__border: ${color_divider__border};
      --lz-color_text: ${color_text};
      --lz-color_text__l1: ${color_text__l1};
      --lz-color_text__decoration__strikethrough: ${color_text__decoration__strikethrough};
      --lz-color_textCode__bg: ${color_textCode__bg};
      --lz-color_code__bg: ${color_code__bg};
      --lz-color_popover__bg: ${popoverBgColor};
      --lz-color_popover__font: ${color_popover__font};
      background-color: ${color__bg};
      color: var(--lz-color_text);
    }
  `;
  document.head.appendChild(style);
}

export function setTheme(theme: 'dark' | 'light') {
  setThemeCssVars(theme);
  const root = document.documentElement;
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
}