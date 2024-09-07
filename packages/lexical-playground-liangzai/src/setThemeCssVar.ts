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
  const color_primary = getRandomHighSaturationColor();
  const [h, s, l, a] = chroma(color_primary).hsl();
  let color_warning = '#faad14';
  let color_success = '#52c41a';
  let color_error = '#ff4d4f';
  let color_link = '#1677ff';
  let color_text__link = color_link

  let color_bg = chroma(color_primary).tint(0.9999).desaturate(0.8);
  let color_text = chroma(color_primary).shade(0.9999).desaturate(0.8);

  let color_bg__hover = chroma(color_primary).tint(0.75)
  let color_bg__active = chroma(color_primary).tint(0.5);

  let color__hover = chroma(color_primary).tint(0.75);
  let color__focus = chroma(color_primary).tint(0.5);
  let color__active = color_primary

  let color__border = chroma(color_primary).tint(0.9)
  let color_divider__border = chroma(color_primary).tint(0.95)

  let color_blockquote__bg = chroma(color_primary).tint(0.965);

  let color_collapsible__bg = chroma(color_primary).tint(0.95);
  let color_collapsible__border = chroma(color_collapsible__bg).shade(0.06)

  let color_toc__bg__selected = chroma(color_primary).tint(0.95);

  let color_code__bg = chroma(color_primary).tint(0.95);

  let color_text__decoration__strikethrough = chroma(color_text).shade(1)
  let color_textCode__bg = chroma(color_primary).tint(0.9)

  let color_popover__text = color_text;
  let color_popover__bg = chroma(color_primary).tint(1)
  let color_popover__bg__hover = chroma(color_primary).tint(0.8)

  let color_draggable_control__hover = color__hover
  if (theme === 'dark') {
    color_bg = chroma(color_primary).desaturate(1).darken(1).shade(0.98);
    color_text = chroma(color_primary).desaturate(1).brighten(1.5).tint(0.7);

    color_bg__hover = chroma(color_bg).tint(0.03)
    color_bg__active = chroma(color_bg).tint(0.15)
    color__hover = chroma(color_bg).tint(0.75)
    color__focus = chroma(color_bg).tint(0.75)
    color__active = chroma(color_primary).tint(0.75)

    color__border = chroma(color_bg).tint(0.01)
    color_divider__border = chroma(color_bg).tint(0.01)

    color_blockquote__bg = chroma(color_bg).tint(0.01)

    color_collapsible__bg = chroma(color_bg).tint(0.003)
    color_collapsible__border = chroma(color_collapsible__bg).tint(0.01)

    color_toc__bg__selected = chroma(color_bg).tint(0.003)
    color_code__bg = chroma(color_bg).tint(0.003)

    color_text__decoration__strikethrough = chroma(color_text).shade(1)
    color_textCode__bg = chroma(color_bg).tint(0.02)

    color_popover__text = color_text
    color_popover__bg = chroma(color_bg).tint(0.03)
    color_popover__bg__hover = chroma(color_popover__bg).tint(0.03)

    color_draggable_control__hover = color_bg__active
  } else if (theme === 'contrast') {
    color_bg = chroma(color_primary).shade(0.999);
    color_text = chroma(color_primary).tint(0.8);

    color_bg__hover = chroma(color_bg).tint(0.03)
    color_bg__active = chroma(color_bg).tint(0.15)
    color__hover = chroma(color_primary).tint(0.75)
    color__focus = chroma(color_primary).tint(0.75)
    color__active = color_primary

    color__border = chroma(color_primary).tint(0.003)
    color_divider__border = chroma(color_primary).tint(0.05)

    color_blockquote__bg = chroma(color_bg).tint(0.003)

    color_collapsible__bg = chroma(color_bg).tint(0.01)
    color_collapsible__border = chroma(color_collapsible__bg).tint(0.01)

    color_toc__bg__selected = chroma(color_bg).tint(0.005)
    color_code__bg = chroma(color_bg).tint(0.003)

    color_text__decoration__strikethrough = chroma(color_text).shade(1)
    color_textCode__bg = chroma(color_bg).tint(0.02)

    color_popover__text = color_text
    color_popover__bg = chroma(color_bg).tint(0.03)
    color_popover__bg__hover = chroma(color_bg).tint(0.075)
  }

  const vars: any = {
    color_primary,
    color_warning,
    color_success,
    color_error,
    color_bg,
    color__hover,
    color__focus,
    color__active,
    color_bg__hover,
    color_bg__active,
    color__border,
    color_blockquote__bg,
    color_collapsible__bg,
    color_collapsible__border,
    color_toc__bg__selected,
    color_divider__border,
    color_text,
    color_text__decoration__strikethrough,
    color_textCode__bg,
    color_code__bg,
    color_popover__bg, color_popover__text,
    color_popover__bg__hover,
    color_text__link,
  }

  const colors = {
    color_primary,
    color_warning,
    color_success,
    color_error,
    color_text,
  }
  Object.entries(colors).forEach(([key, val]) => {
    let scales = chroma.scale([color_bg, val]);
    if (theme === 'light') {
      scales = chroma.scale([color_bg, val]);
    }
    for (let i = 0; i <= 10; i++) {
      vars[key + `__contrast_with_bg__${i}`] = scales(i / 10)
    }
  })

  const styleString = Object.entries(vars).map(([key, val]) => {
    return `--lz-${key}:${val}`
  }).join(';')

  const style = document.createElement('style');
  style.innerHTML = `
    :root {${styleString};
      background-color: var(--lz-color_bg);
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