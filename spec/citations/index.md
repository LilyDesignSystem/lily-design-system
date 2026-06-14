# Citations

> Lily Design System specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Lily learns from headless/unstyled component libraries, styled/opinionated design systems, and public-sector reference designs; the example apps' current default visual reference is the NHS UK design system, and the editorial/scrollytelling primitives are adapted from the Reuters Graphics components.

## Scope

This topic catalogues the external references that inform Lily: the headless libraries that shape component APIs and accessibility patterns, the styled design systems that inform naming and structure, and the public-sector reference designs the example apps target. It records the canonical NHS UK pages used as the default visual reference and the Reuters Graphics influence — the source-component → Lily-slug mapping, the key adaptations, and the explicitly excluded list.

It does **not** cover: how the NHS palette and tokens are actually wired (see [theme](../theme/index.md)), the example-app routes and styling rules (see [examples](../examples/index.md)), or the accessibility standards these references inform (see [accessibility](../accessibility/index.md)).

## Principles and rules

- References inform but do not dictate. Lily is headless, framework-plural, and zero-CSS; patterns from styled or single-framework libraries are adapted, never copied wholesale.
- The example apps' default visual reference is the NHS UK design system applied to Lily's kebab-case class names — no `nhsuk-` prefixes appear in markup.
- The architecture allows alternative reference designs (GOV.UK, USWDS, Mozilla Protocol, Adobe Spectrum) to be added in parallel as `theme-*` layers without touching component code.
- Reuters Graphics is Svelte-specific with SCSS; Lily adapts its editorial, scrollytelling, and layout primitives to the headless, framework-plural, zero-CSS approach.

## Headless / unstyled component libraries

| Reference                | What Lily learns                                     |
| ------------------------ | --------------------------------------------------- |
| Ark UI                   | Multi-framework headless components (Chakra team)   |
| Bits UI                  | Svelte headless component library                   |
| Melt UI                  | Svelte headless builders                            |
| Radix UI                 | React headless primitives                           |
| shadcn/ui                | Copy-paste React components on top of Radix         |
| Reuters Graphics         | Svelte components for editorial graphics            |

## Styled / opinionated design systems

| Reference            | Origin                          |
| -------------------- | ------------------------------- |
| Adobe Spectrum       | Adobe's design system           |
| Ant Design           | React component framework       |
| Carbon Design System | IBM                             |
| DaisyUI              | Tailwind component library      |
| Flowbite             | Tailwind UI components          |
| Mozilla Protocol     | Mozilla                         |
| Skeleton             | Svelte + Tailwind UI toolkit    |
| Wonderflow Wanda     | Wonderflow                      |
| Design System AU     | Australian Government           |

## Public-sector reference designs

These are the visual languages the example apps target. NHS UK is the current default.

| Reference                  | Role                                         |
| -------------------------- | -------------------------------------------- |
| NHS UK Design System       | Current default reference visual language    |
| GOV.UK Design System       | UK government services                        |
| ONSdigital Design System   | UK Office for National Statistics            |
| U.S. Web Design System     | USWDS, maintained by 18F / GSA               |
| 18F UI Library             | Historically led USWDS development           |

## NHS UK canonical pages

The default visual reference draws on these specific NHS UK pages:

| Topic              | Page                                                            |
| ------------------ | -------------------------------------------------------------- |
| Design system      | service-manual.nhs.uk/design-system                           |
| Focus state        | …/design-system/styles/focus-state                            |
| Icons              | …/design-system/styles/icons                                  |
| Layout             | …/design-system/styles/layout                                 |
| Page template      | …/design-system/styles/page-template                          |
| Spacing            | …/design-system/styles/spacing                                |
| Typography         | …/design-system/styles/typography                             |
| Frutiger font      | …/design-system/styles/use-frutiger-font                      |
| Accessibility      | service-manual.nhs.uk/accessibility/design                    |
| Identity colours   | england.nhs.uk/nhsidentity/identity-guidelines/colours/       |

## Reuters Graphics influence

The Reuters Graphics components library inspired Lily's editorial, scrollytelling, and layout primitives. Source component → Lily slug:

| Reuters source                   | Lily slug(s)                                        |
| -------------------------------- | --------------------------------------------------- |
| Article                          | `article-layout`                                    |
| Block                            | `content-block`                                     |
| PaddingReset                     | `padding-reset`                                     |
| Headline / HeroHeadline          | `headline` / `hero-headline`                        |
| BodyText / Byline / EndNotes     | `body-text` / `byline` / `end-notes`                |
| InfoBox                          | `information-callout`                               |
| Scroller / ScrollerBase / ScrollerVideo | `scroller` / `scroller-base` / `scroller-video` |
| HorizontalScroller / GraphicBlock | `horizontal-scroller` / `graphic-block`            |
| FeaturePhoto / PhotoPack / Video | `feature-photo` / `photo-pack` / `video-player`     |
| Visible / Framer / TileMap       | `visible` / `framer` / `tile-map`                   |
| Theme                            | `theme-provider`                                    |
| SimpleTimeline                   | `timeline-list`, `timeline-list-item`               |
| Table / SearchInput / Spinner / BeforeAfter | covered by `data-table`+sub-elements, `search-input`, `loading`/`progress-spinner`, `diff` |

### Key adaptations

| Reuters pattern                 | Lily adaptation                                                            |
| ------------------------------- | -------------------------------------------------------------------------- |
| `Block` with named widths       | CSS custom properties (`--content-width-*`) set by `article-layout`, read by `content-block`; consumer owns the values. |
| SCSS mixins for typography      | Consumer provides typography via CSS targeting the kebab-case classes.     |
| `Markdown` component            | Props accept plain text or `children` slots; rendering is the consumer's.  |
| String-or-Snippet duality       | Props accept content via slots/children; consumer decides rendering.       |
| `IntersectionObserver` baked in | Documented behaviour; the headless implementation wires the observer.      |
| `display: contents` on Theme    | Recommended pattern for `theme-provider`; the only allowed inline style.   |
| Svelte 5 `$bindable()`          | Documented as two-way binding props where applicable.                      |

### Excluded from Lily

Reuters-specific branding, third-party integrations, or already-covered components are excluded: SiteHeader, SiteFooter, ToolsHeader, ReutersLogo, ReutersGraphicsLogo, KinesisLogo, Analytics, AdSlot, SEO, PymChild, EmbedPreviewerLink, DatawrapperChart, DocumentCloud, Lottie, ReferralBlock, BlogPost, BlogTOC, ClockWall, Headpile, LanguageButton, SiteHeadline.

## Acceptance criteria

- [ ] Each reference in the headless, styled, and public-sector tables is reachable and correctly attributed.
- [ ] Example apps target Lily's kebab-case class names directly; no `nhsuk-` (or other framework) prefixes appear in markup.
- [ ] Alternative reference themes can be added as parallel `theme-*` layers without changing component code.
- [ ] Every Reuters-influenced Lily slug in the mapping table exists in `components.tsv`.
- [ ] Excluded Reuters components have no Lily counterpart introduced by the influence.

## Related topics

- [theme](../theme/index.md) — how the NHS-aligned palette and design tokens are wired
- [examples](../examples/index.md) — the styled reference apps that apply NHS UK to Lily classes
- [accessibility](../accessibility/index.md) — WAI-ARIA APG and the standards these references inform
- [components](../components/index.md) — the catalog the Reuters-influenced slugs live in
- [overview](../overview/index.md) — Lily's vision and where these references fit

## Sources

- [AGENTS/citations.md](../../AGENTS/citations.md)
- [AGENTS/nhs-uk-design-system-references.md](../../AGENTS/nhs-uk-design-system-references.md)
- [spec.md](../../spec.md) §10 (References), §10.1 (Reuters Graphics influence)
