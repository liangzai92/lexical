import chroma from 'chroma-js';

function getRandomHighSaturationColor() {
  const color = chroma.random();
  const [h, s, l, a] = chroma(color).hsl();
  if (l < 0.3 || l > 0.7 || s < 0.7) {
    return getRandomHighSaturationColor();
  }
  return color.hex();
}

function setThemeCssVars(theme: 'dark' | 'light' | 'contrast') {
  const color__primary = getRandomHighSaturationColor();
  const [h, s, l, a] = chroma(color__primary).hsl();
  let color__bg = chroma(color__primary).tint(0.9999).desaturate(0.8);
  let color_text = chroma(color__primary).shade(0.9999).desaturate(0.8);

  let color__bg__hover = chroma(color__primary).tint(0.75)
  let color__bg__active = chroma(color__primary).tint(0.5);
  let color__bg__tint__1 = chroma(color__bg).tint(0.75);

  let color__hover = chroma(color__primary).tint(0.75);
  let color__focus = chroma(color__primary).tint(0.5);
  let color__active = color__primary

  let color__border = chroma(color__primary).tint(0.9)
  let color_divider__border = chroma(color__primary).tint(0.95)

  let color_blockquote__bg = chroma(color__primary).tint(0.965);

  let color_collapsible__bg = chroma(color__primary).tint(0.95);
  let color_collapsible__border = chroma(color_collapsible__bg).shade(0.06)

  let color_toc__bg__selected = chroma(color__primary).tint(0.95);

  let color_code__bg = chroma(color__primary).tint(0.95);

  let color_text__mix_with_bg__1 = chroma(color_text).tint(0.1)
  let color_text__mix_with_bg__8 = chroma(color_text).tint(0.8)
  let color_text__link = chroma(color__primary).shade(0.1)
  let color_text__decoration__strikethrough = chroma(color_text).shade(1)
  let color_textCode__bg = chroma(color__primary).tint(0.9)

  let color_popover__text = color_text;
  let color_popover__bg = chroma(color__primary).tint(1)
  let color_popover__bg__hover = chroma(color__primary).tint(0.8)

  let color_listItem_border = chroma(color__primary).tint(0.9)
  let color_draggable_control__hover = color__hover
  if (theme === 'dark') {
    color__bg = chroma(color__primary).desaturate(1).darken(1).shade(0.98);
    color_text = chroma(color__primary).desaturate(1).brighten(1).tint(0.6);

    color__bg__hover = chroma(color__bg).tint(0.03)
    color__bg__active = chroma(color__bg).tint(0.15)
    color__hover = chroma(color__bg).tint(0.75)
    color__focus = chroma(color__bg).tint(0.75)
    color__active = chroma(color__primary).tint(0.75)

    color__border = chroma(color__bg).tint(0.01)
    color_divider__border = chroma(color__bg).tint(0.01)

    color_blockquote__bg = chroma(color__bg).tint(0.01)

    color_collapsible__bg = chroma(color__bg).tint(0.003)
    color_collapsible__border = chroma(color_collapsible__bg).tint(0.01)

    color_toc__bg__selected = chroma(color__bg).tint(0.003)
    color_code__bg = chroma(color__bg).tint(0.003)

    color_text__link = chroma(color__primary).tint(0.1)
    color_text__mix_with_bg__8 = chroma(color_text).mix(color__bg, 0.8)
    color_text__mix_with_bg__1 = chroma(color_text).mix(color__bg, 0.6)
    color_text__decoration__strikethrough = chroma(color_text).shade(1)
    color_textCode__bg = chroma(color__bg).tint(0.02)

    color_popover__text = color_text
    color_popover__bg = chroma(color__bg).tint(0.03)
    color_popover__bg__hover = chroma(color_popover__bg).tint(0.03)

    color_draggable_control__hover = color__bg__active
  } else if (theme === 'contrast') {
    color__bg = chroma(color__primary).shade(0.999);
    color_text = chroma(color__primary).tint(0.8);

    color__bg__hover = chroma(color__bg).tint(0.03)
    color__bg__active = chroma(color__bg).tint(0.15)
    color__hover = chroma(color__primary).tint(0.75)
    color__focus = chroma(color__primary).tint(0.75)
    color__active = color__primary

    color__border = chroma(color__primary).tint(0.003)
    color_divider__border = chroma(color__primary).tint(0.05)

    color_blockquote__bg = chroma(color__bg).tint(0.003)

    color_collapsible__bg = chroma(color__bg).tint(0.01)
    color_collapsible__border = chroma(color_collapsible__bg).tint(0.01)

    color_toc__bg__selected = chroma(color__bg).tint(0.005)
    color_code__bg = chroma(color__bg).tint(0.003)

    color_text__link = chroma(color__primary).tint(0.1)
    color_text__mix_with_bg__1 = chroma(color_text).shade(0.6)
    color_text__mix_with_bg__8 = chroma(color_text).shade(0.8)
    color_text__decoration__strikethrough = chroma(color_text).shade(1)
    color_textCode__bg = chroma(color__bg).tint(0.02)

    color_popover__text = color_text
    color_popover__bg = chroma(color__bg).tint(0.03)
    color_popover__bg__hover = chroma(color__bg).tint(0.075)
  }

  const vars = {
    color__primary,
    color__bg,
    color__hover,
    color__focus,
    color__active,
    color__bg__hover,
    color__bg__active,
    color__border,
    color_blockquote__bg,
    color_collapsible__bg,
    color_collapsible__border,
    color_toc__bg__selected,
    color_divider__border,
    color_text,
    color_text__mix_with_bg__8,
    color_text__mix_with_bg__1,
    color_text__decoration__strikethrough,
    color_textCode__bg,
    color_code__bg,
    color_popover__bg, color_popover__text,
    color_popover__bg__hover,
    color_text__link
  }
  const styleString = Object.entries(vars).map(([key, val]) => {
    return `--lz-${key}:${val}`
  }).join(';')

  const style = document.createElement('style');
  style.innerHTML = `
    :root {${styleString};
      background-color: ${color__bg};
      color: var(--lz-color_text);
    }
  `;
  document.head.appendChild(style);
}

export function setTheme(theme: 'dark' | 'light' | 'contrast') {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  setThemeCssVars(theme);
}