# Theme

> Lily Design System specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Themes live entirely in the example subprojects' CSS and the optional `ThemeProvider`; the headless components bake in no colour, spacing, typography, or breakpoints — only ARIA, semantic structure, class hooks, and `data-*` attributes.

## Scope

This topic covers the theming contract: where themes are allowed to live, the default NHS-aligned reference palette, the flat token-object shape and its `--theme-{path}` custom-property projection, light / dark / high-contrast switching via `data-theme`, the list of values forbidden in the headless layer, and the Reuters `--content-width-*` convention.

It explicitly does **not** cover: the example apps' full stylesheets (see [examples](../examples/index.md)), the headless markup rules (see [headless](../headless/index.md)), or accessible colour-contrast targets (see [accessibility](../accessibility/index.md)). No CSS framework dependency (Tailwind, DaisyUI, Bootstrap) is part of any theme.

## Principles and rules

- **Themes live only in example CSS + the optional `ThemeProvider`.** Headless components do not bake colour, spacing, typography, or breakpoints into their markup.
- **Tokens flatten to custom properties.** The theme is a flat object whose keys flatten into `--theme-{path}` CSS custom properties via `ThemeProvider`; consumer CSS reads `var(--theme-color-primary)`, `var(--theme-space-md)`, etc.
- **`base` reflects to `data-theme`.** `ThemeProvider` accepts a `base` prop (`"light" | "dark"`); it is reflected as `data-theme` on the wrapper. High-contrast is an additional `data-theme` value layered the same way.
- **`display: contents` is the only allowed inline style** on `ThemeProvider`, alongside the CSS custom properties it sets as variables — so the provider sets tokens without introducing a layout box.
- **Headless components only set ARIA, semantic structure, class hooks, and `data-*` attributes** — never literal visual values.

## Reference palette (default examples)

The example apps default to an NHS-aligned palette so demos look familiar to public-sector users; teams swap any value via CSS custom properties without touching component code.

| Token           | Value     |
| --------------- | --------- |
| primary         | `#2563eb` |
| NHS blue        | `#005eb8` |
| danger          | `#dc2626` |
| warning         | `#f59e0b` |
| success         | `#16a34a` |
| page background | `#f9fafb` |
| card background | `#ffffff` |

## Token shape

The theme is exposed as a flat object; keys flatten into `--theme-{path}` custom properties.

```ts
{
  color: { primary: "#2563eb", danger: "#dc2626", success: "#16a34a" },
  space: { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "2rem" },
  font: { body: "system-ui, sans-serif", heading: "system-ui, sans-serif" },
  radius: { sm: "0.25rem", md: "0.5rem", lg: "1rem" },
}
```

| Object path     | CSS custom property      |
| --------------- | ------------------------ |
| `color.primary` | `--theme-color-primary`  |
| `space.md`      | `--theme-space-md`       |
| `font.body`     | `--theme-font-body`      |
| `radius.lg`     | `--theme-radius-lg`      |

Consumer CSS reads these:

```css
.button { background: var(--theme-color-primary); padding: var(--theme-space-md); }
```

## Light / dark / high-contrast

`base` is reflected as `data-theme` on the wrapper; consumer CSS swaps variables per value. High-contrast is an additional `data-theme` value, layered the same way.

```css
[data-theme="light"] { --theme-color-primary: #2563eb; --theme-bg: #f9fafb; }
[data-theme="dark"]  { --theme-color-primary: #60a5fa; --theme-bg: #111827; }
[data-theme="high-contrast"] { --theme-color-primary: #0000ff; --theme-bg: #ffffff; }
```

```tsx
// display: contents is the only inline style; tokens set as CSS variables.
<ThemeProvider base="dark" theme={theme}>
  {children}
</ThemeProvider>
```

## Forbidden in the headless layer

None of the following may appear in headless markup; they live in example CSS and consume the theme custom properties.

| Forbidden value                                | Lives instead in                 |
| ---------------------------------------------- | -------------------------------- |
| Hardcoded hex / named colours / RGB / HSL      | `--theme-color-*`                |
| `font-family`, `font-size`, `line-height`      | `--theme-font-*` + example CSS   |
| `padding`, `margin`, `gap`, `width`, `height`  | `--theme-space-*` + example CSS  |
| Breakpoint media queries                       | example CSS                      |
| Shadow, border-radius, opacity values          | `--theme-radius-*` + example CSS |

## Reuters content-width convention

Editorial / scrollytelling primitives use CSS custom properties for column widths: `article-layout` declares `--content-width-*` and `content-block` reads them. The consumer owns the values.

```css
.article-layout {
  --content-width-narrower: 330px;
  --content-width-narrow:   510px;
  --content-width-normal:   660px;
  --content-width-wide:     930px;
  --content-width-wider:    1200px;
}

.content-block { max-width: var(--content-width-normal); margin-inline: auto; }
.content-block[data-width="wide"]  { max-width: var(--content-width-wide); }
.content-block[data-width="wider"] { max-width: var(--content-width-wider); }
```

## Acceptance criteria

- [ ] No headless component contains a hardcoded hex / named colour / RGB / HSL literal.
- [ ] No headless component declares `font-family`, `font-size`, `line-height`, `padding`, `margin`, `gap`, `width`, `height`, breakpoint media queries, or shadow / border-radius / opacity literals.
- [ ] Theme tokens are a flat object flattening to `--theme-{path}` custom properties.
- [ ] `ThemeProvider` reflects `base` to `data-theme` and uses only `display: contents` plus CSS-variable inline styles.
- [ ] Light / dark / high-contrast variants are selected via `data-theme` values, not component logic.
- [ ] Editorial column widths use the `--content-width-*` convention set by `article-layout` and read by `content-block`.

## Related topics

- [headless](../headless/index.md) — the zero-CSS boundary themes are kept out of
- [examples](../examples/index.md) — where the full stylesheets and concrete token values live
- [accessibility](../accessibility/index.md) — colour-contrast targets the example themes must meet
- [internationalization](../internationalization/index.md) — the parallel rule keeping strings, like styles, outside the headless layer

## Sources

- [AGENTS/theme.md](../../AGENTS/theme.md)
- [spec.md](../../spec.md) §4.4 Theme, §10.1 Reuters column-width convention
- [AGENTS/examples.md](../../AGENTS/examples.md)
