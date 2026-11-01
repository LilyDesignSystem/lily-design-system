# Theme

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Themes live entirely in the example subprojects' CSS and the optional `ThemeProvider`; the headless components bake in no colour, spacing, typography, or breakpoints — only ARIA, semantic structure, class hooks, and `data-*` attributes.

## Scope

This topic covers the theming contract: where themes are allowed to live, the default NHS-aligned reference palette, the flat token-object shape and its `--theme-{path}` custom-property projection, light / dark / high-contrast switching via `data-theme`, the list of values forbidden in the headless layer, and the Reuters `--content-width-*` convention.

It explicitly does **not** cover: the example apps' full stylesheets (see [examples](../examples/index.md)), the headless markup rules (see [headless](../headless/index.md)), or accessible colour-contrast targets (see [accessibility](../accessibility/index.md)). No CSS framework dependency (Tailwind, DaisyUI, Bootstrap) is part of any theme.

## Principles and rules

- **Themes live only in example CSS + the optional `ThemeProvider`.** Headless components do not bake colour, spacing, typography, or breakpoints into their markup.
- **Tokens flatten to custom properties.** The theme is a flat object whose keys flatten into `--theme-{path}` CSS custom properties via `ThemeProvider`; consumer CSS reads `var(--theme-color-primary)`, `var(--theme-space-md)`, etc.
- **`base` reflects to `data-theme`.** `ThemeProvider` accepts a `base` prop (`"light" | "dark"`); it is reflected as `data-theme` on the wrapper. High-contrast is an additional `data-theme` value layered the same way.
- **`display: contents` is the only allowed inline style** on `ThemeProvider`, alongside the CSS custom properties it sets as variables — so the provider sets tokens without introducing a layout box.
- **Preference sections (P12-T12, P12-T13).** Every theme also ends with two pinned sections after "Focus not obscured": "Text size and motion preferences" (the seven `data-text-size` steps as percentages of the root font size, 80% to 150%, `normal` 100%; `data-motion="reduce"` shortens animations and transitions to 0.01ms, never removes them, so no information is lost) and "Forced colours and contrast preference" (`@media (forced-colors: active)`: control borders, `Highlight` focus ring, `SelectedItem` for selected states; `@media (prefers-contrast: more)`: heavier borders and focus ring). `bin/check-theme` rule 13 and rule 5 pin them.
- **Focus not obscured.** Every theme ends with the same pinned "Focus not obscured" section (WCAG 2.2 SC 2.4.11): `:where(html) { scroll-padding-block: var(--lily-fixed-bar-block-start, 0px) var(--lily-fixed-bar-block-end, 0px); }`. A fixed bar sets those two custom properties on the root to its height; `bin/check-theme` rule 12 requires the section in any theme that uses `position: fixed|sticky`, and rule 5 pins its text.
- **Headless components only set ARIA, semantic structure, class hooks, and `data-*` attributes** — never literal visual values.

## Reference palette (default examples)

The example apps default to the reference palette, which is NHS-aligned (a regional choice: the NHS and USWDS themes are regional standards, not global ones); teams swap any value via CSS custom properties without touching component code.

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

| Object path     | CSS custom property     |
| --------------- | ----------------------- |
| `color.primary` | `--theme-color-primary` |
| `space.md`      | `--theme-space-md`      |
| `font.body`     | `--theme-font-body`     |
| `radius.lg`     | `--theme-radius-lg`     |

Consumer CSS reads these:

```css
.button {
  background: var(--theme-color-primary);
  padding: var(--theme-space-md);
}
```

## Light / dark / high-contrast

`base` is reflected as `data-theme` on the wrapper; consumer CSS swaps variables per value. High-contrast is an additional `data-theme` value, layered the same way.

```css
[data-theme="light"] {
  --theme-color-primary: #2563eb;
  --theme-bg: #f9fafb;
}
[data-theme="dark"] {
  --theme-color-primary: #60a5fa;
  --theme-bg: #111827;
}
[data-theme="high-contrast"] {
  --theme-color-primary: #0000ff;
  --theme-bg: #ffffff;
}
```

```tsx
// display: contents is the only inline style; tokens set as CSS variables.
<ThemeProvider
  base="dark"
  theme={theme}
>
  {children}
</ThemeProvider>
```

## Reference theme stylesheets (`themes/`)

The root [`themes/`](../../themes/) directory ships 63 ready-to-use theme stylesheets that target the Lily™ class hooks directly. They cover public-sector reference designs (NHS England, NHS Scotland, and NHS Wales — each with `-for-patients` and `-for-practitioners` variants — GOV.UK GDS as `united-kingdom-government-digital-service`, USWDS as `united-states-web-design-system`), vendor-inspired palettes (`adobe-spectrum`, `mozilla-protocol`), and general-purpose themes (`light`, `dark`, `nord`, `dracula`, `wireframe`, and others).

- Each file is standalone: link one stylesheet, get one complete theme.
- Selectors use `:where(...)` so consumer overrides always win on specificity.
- The [`theme-select` helper](../helpers/index.md) loads these at runtime by swapping a managed `<link>` href and setting `data-theme` on the document root.

## Picker popups

The reference themes place every picker popup (`.{theme,locale,text-size,motion,share}-picker-list`,
`.search-picker-panel`) with CSS anchor positioning inside `@supports (position-area: block-end)`: `position: fixed`,
anchored to the picker root (`anchor-name: --lily-{picker}`), `position-area: block-end span-inline-end`,
`position-try-fallbacks: flip-inline, flip-block, flip-block flip-inline`, and a width of `max-content` capped at
`100vw - 1rem`. Fixed positioning is deliberate: fallbacks are checked against the containing block, so only the
viewport makes them react to the window edge. A popup that is wider than the space beside its button otherwise runs off
the window and focusing it scrolls the page sideways. Do not use `min-width: max-content` here: it beats `max-width`,
and `min()` does not accept intrinsic keywords. Regression test: the docs site's `tests/header-popups.spec.ts`.

## Error text (`--lily-error-text`)

`--color-error` is a **fill** colour (a badge, a border, a tint), not a text colour: used as text it failed WCAG
contrast in 26 of the 45 themes (2.35–4.4:1 on the error-tinted callout). Every theme therefore defines
`--lily-error-text` — the error colour mixed 22% into the theme's own `--color-base-content` — and uses it for error
_text_: `.error-message`, a failed `.validation-list-item` and the `.dont-list-item` marker. It deliberately mixes
`--color-base-content`, not `--lily-text`, so a host page that overrides `--lily-text` (the docs site does) cannot
break it. Verified by switching all 45 themes on `/components/error-message/` under axe (0 failures). Any new
status-coloured text should follow the same pattern rather than reuse a fill token.

## Design-token source (DTCG)

Each theme's design primitives — the `--color-*`, `--radius-*`,
`--size-*`, `--border`, `--depth`, `--noise` block it declares on
`:root` / `:root[data-theme="{slug}"]` — are sourced from a Design
Tokens Community Group format file (DTCG 2025.10) under
[`themes/tokens/{slug}.json`](../../themes/tokens/): structured
`$type`/`$value` entries (oklch and srgb color objects, dimension
objects), with each token's documentation carried as `$description`.

[`bin/generate-theme-tokens`](../../bin/generate-theme-tokens) is the
bridge: it regenerates every theme's token block from its JSON in one
canonical emission format, and `--check` (run by `bin/test`) fails on
any drift between the two — the CSS block is generated output, so edit
the JSON. `--extract` exists for bootstrapping/backfill. Only the
primitives are token-sourced; the derived `--lily-*` layer
(`var()`/`color-mix()` over these) and the component body remain CSS,
because they are shared logic rather than per-theme data. The DTCG
format is what design tooling (Figma Variables, Style Dictionary,
Tokens Studio, Terrazzo, Penpot) can consume — the bridge the `lily-figma` decision
(plan P5-T5) builds on.

### Strict 2025.10 (plan P16-T6)

The token files use only standard 2025.10 types: `color` (oklch and
srgb objects, srgb carrying a `hex` fallback), `dimension`
(`{value, unit}`, unit `px` or `rem`) and `number`. Anything Lily
needs beyond the standard goes under the reverse-domain
`$extensions["com.lilydesignsystem"]` key, which strict tools ignore:

- at the root, `colorScheme` (`light` or `dark`) and `order` (the CSS
  declaration order the generator emits);
- on a fluid spacing token (`--space-fluid-gutter`,
  `--space-fluid-section`), `fluid: {floor, base, grow, ceiling}`. The
  token itself is a standard `dimension` whose `$value` is the `rem`
  floor, so a strict tool reads a usable fixed size; the generator reads
  the extension and emits `clamp(floor, base + grow, ceiling)`. These
  were a non-standard `$type: "fluidDimension"` until 2026-10-29; the
  move changed no byte of the generated CSS.

[`themes/tokens/lily.resolver.json`](../../themes/tokens/lily.resolver.json)
is a 2025.10 Resolver document, written by the same generator. Each
theme file is a complete token set, so the 63 themes are the contexts
of one `theme` modifier (input `{"theme": "<slug>"}`, default `light`)
rather than layered sets; the patient and practitioner pairs and each
theme's light or dark scheme are listed under the modifier's
`$extensions`. Restructuring the files into a shared base plus per-theme
deltas would let sets do real work, and is not done.

[`bin/check-dtcg-tokens`](../../bin/check-dtcg-tokens) (in `bin/test`)
is a dependency-free validator of the 2025.10 rules for those types:
known `$` keys only, names without `{ } .`, colour spaces and component
ranges, dimension units, aliases that resolve with matching types,
reverse-domain `$extensions` keys, Lily's own extension shape, and the
Resolver's structure and references. On 2026-10-29 two real parsers
were also run once over the files, outside the repo: Terrazzo
(`@terrazzo/parser` 2.10.0) loaded all 63 files and the resolver (57
permutations) with no errors or warnings, and Style Dictionary 5.7.1
(`usesDtcg`) formatted all 63 with no warnings, now emitting `1rem` for
the fluid tokens where it used to emit `[object Object]`. Neither tool
rejected the old `fluidDimension` type, so the in-repo check is the
stricter gate.

## Dark / high-contrast coverage matrix (audited 2026-08-27)

Computed from `color-scheme` declarations across the 45 `themes/*.css`
that existed on 2026-08-27 (plan P3-T8). `bin/check-theme` guards the
structural contracts; this matrix records scheme coverage and the
deliberate exclusions.

| Family                                                  | Light | Dark                                                                                                               | High-contrast |
| ------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------ | ------------- |
| General-purpose (34 themes)                             | 20    | 14 — abyss, aqua, black, business, coffee, dark, dim, dracula, forest, halloween, luxury, night, sunset, synthwave | none          |
| NHS England / Scotland / Wales (6)                      | 6     | 0                                                                                                                  | none          |
| GOV.UK GDS, USWDS, Adobe Spectrum, Mozilla Protocol (4) | 4     | 0                                                                                                                  | none          |
| `light` / `dark` canonical pair                         | 1     | 1                                                                                                                  | —             |

Added 2026-10-16 (63 themes in all): eleven design-system references —
Ant Design, Atlassian, Excel, Fluent, GitHub Primer, IBM Carbon, Notion,
Salesforce, SAP Fiori and Vercel (all light), and Linear (dark, the one
upstream whose own visual language is dark-first) — and `cappuccino`, a
Lily original in the coffee family (light). Every text pair in them
reaches at least AA (4.5:1); where a brand colour could not carry text at
that ratio its fill was moved along lightness, and the move is recorded
in that theme's own spec (`lily-design-system-themes/spec/themes/{slug}/`).
Totals: 63 themes, 42 light and 15 dark.

**Deliberate exclusions.**

- The reference families ship light-only because their upstreams'
  published visual languages are light-first; inventing a "dark NHS"
  would be design speculation presented as reference, which is exactly
  what these themes exist not to do. If an upstream publishes a dark
  mode, its theme gains one — that is what each theme's
  `Upstream tracked:` provenance line exists to trigger.
- **No dedicated high-contrast theme ships yet.** This is a recorded
  gap, not an oversight: `black` and `wireframe` are the nearest
  starting points, but a real high-contrast theme should be built
  against WCAG 1.4.6 (contrast enhanced) deliberately, not relabeled
  from an aesthetic theme. Candidate future work; consumers needing
  one today should follow the `ThemeProvider` guidance above (a
  high-contrast `data-theme` value layered like light/dark).

## NHS England and Scotland on nhsuk-frontend 10 (2026-10-29, plan P18-T7)

The four NHS England and NHS Scotland themes were re-baselined from
nhsuk-frontend 9.x to 10.7.1. The 10.7.1 and 9.6.4 packages' Sass settings
(colour palette and applied colours, globals, spacing, typography,
breakpoints) were diffed and read against the CHANGELOG for 10.0.0 to 10.7.0.

- One token changed: `--color-success` moved from NHS Identity green
  `#009639` to `#007F3B`, which is `$nhsuk-success-colour` (new in v10).
  The old value gave white content 4.37:1, below AA. The new value gives
  5.19:1.
- These are unchanged from 9.x: spacing points, breakpoints,
  `$nhsuk-border-radius` (4px), and the focus colours (`#FFEB3B` and
  `#212B32`). Type scale point 24 was removed, and no token used it. In
  10.7.0 `purple` and `dark-pink` (the link hover colour) changed, but no
  Lily token maps either of them.
- NHS Scotland publishes no frontend package of its own, so its themes take
  nhsuk-frontend plus a Scottish palette. That palette is kept as it was.
- Each theme's `Upstream tracked:` line and `themes/references.tsv` now
  record 10.7.1.

## Writing systems (2026-10-30, tasks.md P17-T9)

Every theme ends with a pinned "Writing systems" section (`bin/check-theme` rules 5 and 14). A theme names only its
Latin stack, `--lily-font-body-latin`; the section builds `--lily-font-body` as
`var(--lily-font-script,) var(--lily-font-body-latin)` and re-declares it on every `[lang]` element, so the stack is
right for a `<p lang="ja">` inside an English page and resets for a `<span lang="en">` inside that.
`--lily-font-script` carries each script's system fonts (Windows, Apple, then Noto) for Chinese (Simplified,
Traditional, Hong Kong and Cantonese), Japanese, Korean, Arabic script (Urdu in Nastaliq first), Hebrew, Devanagari,
Bengali, Gujarati, Gurmukhi, Kannada, Tamil, Telugu, Thai, Lao and Khmer. Han is shared, so the language, not the
script, picks the font. `--lily-line-height-body` is 1.5, and 1.75 for the scripts with tall marks (Arabic script,
the Indic scripts, Thai, Lao, Khmer). Checked in Chromium and WebKit: computed `font-family` and `line-height` for
`en`, `ja`, nested `en` in `ja`, `zh-CN`, `zh-TW`, `zh-HK`, `ur`, `th` and `cy` (which keeps the Latin stack).

To change a theme's font, set `--lily-font-body-latin`; to change a script's, set `--lily-font-script` under that
language. An app's body text should use `var(--lily-font-body)` and `var(--lily-line-height-body)`.

## Public-sector design systems beyond the UK and US: adopt or decline (2026-10-30, P17-T9)

The 63 themes include public-sector looks from the UK (7) and the US (1) only (worldwide audit, finding 10). A theme
takes colours, spacing and type scale from a system's published guidance; it never copies its logo, crest, coat of
arms or a restricted typeface, and never claims to be the system. Licences were read from each system's own
repository on 2026-10-30.

| System                                                    | Country / body      | Licence (source)                                                                                                   | Decision                                                                                               |
| --------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| GC Design System                                          | Canada              | MIT (`cds-snc/gcds-components`)                                                                                    | Adopt                                                                                                  |
| Singapore Government Design System (SGDS)                 | Singapore           | MIT (`GovTechSG/sgds`)                                                                                             | Adopt                                                                                                  |
| Digital Agency design system (デジタル庁デザインシステム) | Japan               | MIT (`digital-go-jp/design-system-example-components-react`; `@digital-go-jp/design-tokens` on npm)                | Adopt                                                                                                  |
| Padrão Digital de Governo (gov.br DS)                     | Brazil              | MIT (`gitlab.com/govbr-ds/bibliotecas/javascript/govbr-ds-core`; `@govbr-ds/core` on npm)                          | Adopt                                                                                                  |
| Europa Component Library (ECL)                            | European Commission | EUPL-1.1 (`ec-europa/europa-component-library`)                                                                    | Adopt, from the published guidance only: EUPL is copyleft, so copy no ECL code into a Lily theme       |
| Agriculture Design System (AgDS)                          | Australia           | MIT (`agriculturegovau/agds-next`)                                                                                 | Adopt, named as the Department of Agriculture's; Australia's whole-of-government system closed in 2020 |
| Système de Design de l'État (DSFR)                        | France              | Etalab Licence Ouverte 2.0, but its terms bar use outside the French administration and outside `.gouv.fr` domains | Decline                                                                                                |
| UX4G                                                      | India               | None published (`ux4g/ux4g-design-system-v1` has no licence file; last pushed 2023-08-18)                          | Defer until a licence is published                                                                     |

The dated record of each public-sector theme's identity changes (created, re-baselined) is [`themes/identity-changes.tsv`](../../themes/identity-changes.tsv); `bin/check-theme-references` validates and prints it ([visual-identity](../visual-identity/index.md), P21-T8).

The six adopted themes were built 2026-10-31 (tasks.md P17-T9a): `canada-government-of-canada-design-system`, `singapore-government-design-system`, `japan-digital-agency-design-system`, `brazil-padrao-digital-de-governo`, `european-union-europa-component-library` and `australia-agriculture-design-system`, from each system's published tokens (ECL: colour values only, no code, because EUPL is copyleft). Provenance rows are in `themes/references.tsv`.

## Forbidden in the headless layer

None of the following may appear in headless markup; they live in example CSS and consume the theme custom properties.

| Forbidden value                               | Lives instead in                 |
| --------------------------------------------- | -------------------------------- |
| Hardcoded hex / named colours / RGB / HSL     | `--theme-color-*`                |
| `font-family`, `font-size`, `line-height`     | `--theme-font-*` + example CSS   |
| `padding`, `margin`, `gap`, `width`, `height` | `--theme-space-*` + example CSS  |
| Breakpoint media queries                      | example CSS                      |
| Shadow, border-radius, opacity values         | `--theme-radius-*` + example CSS |

## Reuters content-width convention

Editorial / scrollytelling primitives use CSS custom properties for column widths: `article-layout` declares `--content-width-*` and `content-block` reads them. The consumer owns the values.

```css
.article-layout {
  --content-width-narrower: 330px;
  --content-width-narrow: 510px;
  --content-width-normal: 660px;
  --content-width-wide: 930px;
  --content-width-wider: 1200px;
}

.content-block {
  max-width: var(--content-width-normal);
  margin-inline: auto;
}
.content-block[data-width="wide"] {
  max-width: var(--content-width-wide);
}
.content-block[data-width="wider"] {
  max-width: var(--content-width-wider);
}
```

## Acceptance criteria

- [x] No headless component contains a hardcoded hex / named colour / RGB / HSL literal.
- [x] No headless component declares `font-family`, `font-size`, `line-height`, `padding`, `margin`, `gap`, `width`, `height`, breakpoint media queries, or shadow / border-radius / opacity literals.
- [x] Theme tokens are a flat object flattening to `--theme-{path}` custom properties.
- [x] `ThemeProvider` reflects `base` to `data-theme` and uses only `display: contents` plus CSS-variable inline styles.
- [x] Light / dark / high-contrast variants are selected via `data-theme` values, not component logic.
- [x] All 63 themes carry the pinned "Focus not obscured" section (`scroll-padding-block` from `--lily-fixed-bar-block-start` / `-end`).
- [x] All 63 themes carry the pinned "Writing systems" section and define only `--lily-font-body-latin` (`bin/check-theme` rule 14).
- [x] An adopt-or-decline list of non-UK/US public-sector systems, with a licence per system.
- [x] Themes for the six adopted systems (P17-T9a).
- [x] Editorial column widths use the `--content-width-*` convention set by `article-layout` and read by `content-block`.

## Related topics

- [headless](../headless/index.md) — the zero-CSS boundary themes are kept out of
- [examples](../examples/index.md) — where the full stylesheets and concrete token values live
- [accessibility](../accessibility/index.md) — colour-contrast targets the example themes must meet
- [internationalization](../internationalization/index.md) — the parallel rule keeping strings, like styles, outside the headless layer

## Sources

- [AGENTS/theme.md](../../AGENTS/theme.md)
- [spec/index.md](../index.md) §4.4 Theme, §10.1 Reuters column-width convention
- [AGENTS/examples.md](../../AGENTS/examples.md)

---

Lily™ and Lily Design System™ are trademarks.
