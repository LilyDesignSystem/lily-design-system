## Theme design principle rules

Themes live entirely in the example subprojects' CSS and the optional `ThemeProvider` component. The headless components do not bake colour, spacing, typography, or breakpoints into their markup.

### Reference palette (default examples)

The example apps default to an NHS-aligned palette, one reference among the 63 themes (public-sector systems from several countries plus general-purpose ones); teams can swap any value via CSS custom properties without touching component code.

- primary `#2563eb`
- NHS blue `#005eb8`
- danger `#dc2626`
- warning `#f59e0b`
- success `#16a34a`
- page background `#f9fafb`
- card background `#ffffff`

### Token shape

The theme is exposed as a flat object whose keys flatten into `--theme-{path}` CSS custom properties via the `ThemeProvider` component:

```ts
{
  color: { primary: "#2563eb", danger: "#dc2626", success: "#16a34a" },
  space: { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "2rem" },
  font: { body: "system-ui, sans-serif", heading: "system-ui, sans-serif" },
  radius: { sm: "0.25rem", md: "0.5rem", lg: "1rem" },
}
```

Consumer CSS reads `var(--theme-color-primary)`, `var(--theme-space-md)`, etc.

### Design tokens (DTCG 2025.10)

Each reference theme's primitives are sourced from `themes/tokens/{slug}.json`, strict DTCG 2025.10: only the standard `color`, `dimension` (`px` or `rem`) and `number` types. Lily-only data lives under `$extensions["com.lilydesignsystem"]`; a fluid spacing token is a `dimension` whose `$value` is its `rem` floor, with `fluid: {floor, base, grow, ceiling}` in the extension, from which `bin/generate-theme-tokens` emits the `clamp()`. Never add a non-standard `$type`. `themes/tokens/lily.resolver.json` (generated) is the 2025.10 Resolver: one `theme` modifier with a context per theme. Edit the JSON, run `bin/generate-theme-tokens`, then `bin/check-dtcg-tokens`. Details: [spec/theme](../spec/theme/index.md#strict-202510-plan-p16-t6).

### Light / dark / high-contrast

`ThemeProvider` accepts a `base` prop (`"light" | "dark"`) that is reflected as `data-theme` on the wrapper. Consumer CSS targets `[data-theme="light"]` and `[data-theme="dark"]` to swap variables. High-contrast themes are an additional `data-theme` value and are layered the same way.

### Writing systems

A theme defines only its Latin font stack, `--lily-font-body-latin`. The pinned "Writing systems" section in every theme
builds `--lily-font-body` from it plus `--lily-font-script`, the system fonts of the element's language (CJK by language,
Arabic script, Hebrew, the Indic scripts, Thai, Lao, Khmer), re-declared on every `[lang]` element, and sets
`--lily-line-height-body` (1.75 for scripts with tall marks). Never define `--lily-font-body` in a theme; `bin/check-theme`
rule 14 fails it. Details: [spec/theme](../spec/theme/index.md#writing-systems-2026-10-30-tasksmd-p17-t9).

### Brand colour

`--lily-brand` and `--lily-on-brand` are the identity's decorative colour and the text on it, defined once in every theme's
pinned "Brand colour" section and defaulting to the primary pair. Use them for a header band, a rule or a logo background,
never for text or a control's boundary (`bin/check-theme` rule 15 fails it); text and borders use the content pairs. An adopter
with a brand colour that fails 4.5:1 sets both in their own CSS. Details: [visual-identity.md](visual-identity.md).

### Error text

`--color-error` is a fill colour, not a text colour. Error _text_ uses `--lily-error-text` (error mixed 22% into
`--color-base-content`), defined by every reference theme; reuse that pattern for any status-coloured text.

### Forbidden in the headless layer

- Hard-coded hex values, named colours, RGB / HSL literals
- `font-family`, `font-size`, `line-height` declarations
- `padding`, `margin`, `gap`, `width`, `height` literals
- Breakpoint media queries
- Shadow, border-radius, opacity values

These all live in example-app CSS and consume the theme CSS custom properties. The headless components only set ARIA, semantic structure, class hooks, and `data-*` attributes.

### Reference theme stylesheets

The root [themes/](../themes) directory ships 63 standalone theme stylesheets targeting the Lily class hooks — NHS England/Scotland/Wales (patient + practitioner variants), GOV.UK GDS, USWDS, the GC Design System (Canada), SGDS (Singapore), the Digital Agency (Japan), gov.br (Brazil), ECL (European Commission), AgDS (Australia), Adobe Spectrum, Mozilla Protocol, Ant Design, Atlassian, Excel, Fluent, GitHub Primer, IBM Carbon, Linear, Notion, Salesforce, SAP Fiori, Vercel, and general-purpose light/dark themes. Selectors use `:where(...)` so consumer overrides win. The `theme-picker` helper (see [helpers.md](helpers.md)) loads them at runtime by swapping a managed `<link>` href and setting `data-theme` on the document root.
