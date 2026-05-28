# Lily Design System — Specification

Living, comprehensive specification for the Lily Design System. This file is the single
source of truth for spec-driven development. It supersedes the prior `plan.md` and
`tasks.md` and consolidates: goal, scope, architecture, design principles, component
catalog, naming conventions, composition patterns, documentation requirements,
acceptance criteria, status, and roadmap.

Conventions used in this document:

- "Component" = one entry in the canonical catalog (`components.tsv`).
- "Slug" = kebab-case identifier (e.g., `breadcrumb-list-item`).
- "Name" = PascalCase identifier (e.g., `BreadcrumbListItem`).
- "Headless subproject" = a framework library shipping unstyled, accessible components.
- "Example subproject" = a framework app demonstrating components with full styling.
- "Consumer" = the application or library that depends on a Lily headless package.

The companion AGENTS files (`AGENTS.md`, `AGENTS/*.md`) are the modular reference docs
that AI coding agents and humans should read; this spec links to and binds together
those references rather than duplicating them in full.

---

## 1. Vision

Lily is a free, open-source design system that any team can adopt, fork, theme, or
extend. The headless layer ships semantic HTML, ARIA, focus management, and keyboard
behaviour with zero visual decisions. The example layer ships complete, styled
reference applications so adopters can see the system working end-to-end before
committing.

- **Accessible by default**: WCAG 2.2 AAA target, WAI-ARIA Authoring Practices 1.2.
- **Composable**: small components snap together into navigation, table, form, layout
  patterns.
- **Internationalisable**: every user-facing string is supplied by the consumer.
- **Framework-plural**: same catalog implemented across HTML, Svelte, React, Vue,
  Blazor, and Nunjucks.
- **CSS-strategy-agnostic**: works with semantic CSS, utility CSS (Tailwind), or
  no CSS at all.

## 2. Scope

### In scope

- A canonical catalog of 487 components (`components.tsv`).
- Six headless component libraries: HTML, Svelte, React, Vue, Blazor, Nunjucks.
- Six example applications: HTML+CSS+JS, SvelteKit, Next.js, Nuxt.js, Blazor Web,
  Nunjucks Eleventy.
- A CSS style-sheet template (`css-style-sheet-template.css`) declaring every
  component class hook.
- Component documentation per component (`components/{slug}/index.md`,
  `AGENTS.md`, `CLAUDE.md`, `plan.md`, `tasks.md`).
- Tooling for listing, scaffolding, syncing, and testing components across
  subprojects (`bin/`).
- Modular project documentation in `AGENTS/*.md`.

### Explicitly out of scope

- Bundled stylesheets in the headless layer.
- A CSS framework dependency (Tailwind / DaisyUI / Bootstrap).
- Data fetching, network state, persistence, or routing.
- Locale-specific formatting (consumer wires `Intl.*` or library).
- Animation choreography, transitions, motion design.
- Bundled fonts, icon sets, or imagery.
- Hardcoded user-facing strings.

## 3. Architecture

```
lily-design-system/                            ← canonical catalog + tools
├── AGENTS.md, AGENTS/*.md                     ← modular reference docs
├── components.tsv                             ← canonical 487-component list
├── components/{slug}/                         ← per-component docs (487 dirs)
├── css-style-sheet-template.css               ← class-hook stylesheet template
├── bin/                                       ← scaffolding, listing, sync, test
├── spec.md                                    ← this file
├── lily-design-system-html-headless/          ← headless: HTML
├── lily-design-system-svelte-headless/        ← headless: Svelte 5
├── lily-design-system-react-headless/         ← headless: React
├── lily-design-system-vue-headless/           ← headless: Vue 3
├── lily-design-system-blazor-headless/        ← headless: Blazor
├── lily-design-system-nunjucks-headless/      ← headless: Nunjucks
├── lily-design-system-html-css-js-examples/   ← examples: vanilla HTML+CSS+JS
├── lily-design-system-svelte-sveltekit-examples/ ← examples: SvelteKit 2
├── lily-design-system-react-next-examples/    ← examples: Next.js
├── lily-design-system-vue-nuxt-examples/      ← examples: Nuxt.js
├── lily-design-system-blazor-web-examples/    ← examples: Blazor Web
└── lily-design-system-nunjucks-eleventy-examples/ ← examples: Nunjucks + Eleventy
```

Each subproject is also a `git subtree` so it can be pushed to its own
standalone remote via `bin/git-subtree-push`.

### Required files per subproject

- `index.md` — human-readable overview.
- `README.md` — symlink to `index.md`.
- `AGENTS.md` — AI coding help; loads modular `AGENTS/*.md`.
- `CLAUDE.md` — loads `AGENTS.md`.
- `plan.md` — subproject implementation plan.
- `tasks.md` — subproject task list.
- `.git-subtree-push` — subtree remote configuration.

### Required files per component directory

- `index.md` — component documentation (description, usage, props, ARIA,
  keyboard, references, "When to Use", "When Not to Use", code example).
- `README.md` — symlink to `index.md`.
- `AGENTS.md` — canonical metadata (HTML tag, ARIA, keyboard, props).
- `CLAUDE.md` — loads `AGENTS.md`.
- `plan.md` — per-component implementation plan.
- `tasks.md` — per-component task list.

`bin/test` verifies every component and every subproject has the files above.

## 4. Design principles

The four principle documents in `AGENTS/` are the binding rules. Summary here;
read the file for the full contract.

### 4.1 Headless ([AGENTS/headless.md](AGENTS/headless.md))

- Most specific semantic HTML element first; ARIA only where semantics fall short.
- Root element carries kebab-case base class + the consumer's optional class hook.
- Inner sub-classes are stable contracts (`{base}-{part}` kebab-case).
- Components spread "rest props" onto the root so consumers can pass arbitrary
  attributes and event handlers.
- Components own: focus management, keyboard navigation, ARIA, bindable open/close
  state, `IntersectionObserver` and scroll listeners that belong to the component.
- Components do NOT own: data fetching, network state, locale formatting,
  persistence, animation choreography, page-level routing.
- No bundled stylesheets, fonts, images, or icons. No inline `style="..."` except
  where structurally required (e.g., `display: contents` on `ThemeProvider`).
- `data-*` attributes are for consumer CSS/JS; ARIA attributes are for assistive
  technology.

### 4.2 Accessibility ([AGENTS/accessibility.md](AGENTS/accessibility.md))

- WCAG 2.2 AAA target across every component, demo, and framework.
- WAI-ARIA Authoring Practices 1.2 patterns are the reference for keyboard,
  roles, states, and properties.
- Every interactive component is reachable and operable with Tab, Shift+Tab,
  Enter, Space, Arrow keys, Home, End, Escape — keyboard contract documented in
  each component's `AGENTS.md`.
- Every interactive element has an accessible name via visible text,
  `aria-label`, or `aria-labelledby`. Required `label` props enforce this where
  text content alone is insufficient.
- No colour-only meaning (WCAG 1.4.1). Status, validity, selection conveyed via
  text/icon/ARIA/position too.
- Live regions are deliberate: `role="alert"` and `aria-live` reserved for
  dynamic content the user must hear.
- Headless components do not auto-animate; consumers respect
  `prefers-reduced-motion` in their CSS.

### 4.3 Internationalisation ([AGENTS/internationalization.md](AGENTS/internationalization.md))

- No hardcoded user-facing strings inside components.
- Stable text-prop names across frameworks: `label`, `description`,
  `placeholder`, `error`, `helpText`, `dismissLabel`, `loadingLabel`,
  `confirmLabel`, `cancelLabel`.
- Locale-aware components (currency, date, measurement) accept the locale
  identifier as a prop; they do not pick a default locale.
- Anchors/links never embed default visible text — content comes from
  `children`/slots or an explicit `label` prop for icon-only links.
- Plural forms, gendered phrasing, conditional copy are the consumer's concern.
- RTL/bidi inherits from the consumer's `dir` attribute and CSS.

### 4.4 Theme ([AGENTS/theme.md](AGENTS/theme.md))

- Themes live entirely in example-subproject CSS and the optional `ThemeProvider`.
- Headless components do not bake colour, spacing, typography, or breakpoints
  into their markup.
- Token shape: flat object → `--theme-{path}` CSS custom properties.
- Light / dark / high-contrast variants via `data-theme` on the wrapper.
- Forbidden in the headless layer: hardcoded hex/RGB/HSL, `font-family`,
  `font-size`, `line-height`, `padding`, `margin`, `gap`, `width`, `height`
  literals, breakpoint media queries, shadow/border-radius/opacity values.

### 4.5 Examples ([AGENTS/examples.md](AGENTS/examples.md))

- Each example subproject ships a complete stylesheet; current default visual
  reference is the NHS UK design system applied to Lily class names.
- CSS targets the kebab-case Lily class names directly (no `nhsuk-` prefixes).
- CSS custom properties carry the design tokens.
- No CSS framework dependency.
- Three required routes per example subproject:
  - `/` — home page describing the project.
  - `/components` — index of every component in the catalog (487 entries),
    searchable / filterable.
  - `/components/{slug}` — per-component detail page with live demo.
- Composed-page demos (e.g., `/dashboard`, `/contact-form`, `/file-upload-form`,
  `/settings-page`, `/tabbed-interface`) are encouraged on top of the required
  routes.
- Accessibility: skip-link first, standard landmarks wrap every page, visible
  focus on every focusable element, keyboard-only completion of every demo.

## 5. Component catalog

The canonical catalog is `components.tsv` — one row per component, three
tab-separated columns: slug, PascalCase name, description. Mirrored by
[AGENTS/components.md](AGENTS/components.md) (with patterns), [index.md](index.md)
(linked listing), and the per-framework implementations.

**Current count: 487 components.**

The most recent additions (May 2026) are 80 national personal identifier
components (40 identifier types × `-input` + `-view`) spanning 30+ countries,
covering healthcare, national-ID, tax, and passport identifiers. The catalog
rows, per-component docs, and CSS class hooks landed in Phase 1; per-subproject
implementations (Svelte, React, Vue, HTML, Blazor, Nunjucks headless +
6 example apps) are deferred to Phase 2.

Catalog category overview (counts approximate; the TSV is authoritative):

| Group                          | Examples                                                   |
| ------------------------------ | ---------------------------------------------------------- |
| Accordion                      | accordion-nav, accordion-list, accordion-list-item         |
| Action                         | action-bar, action-bar-button, action-group, action-link   |
| Alert & Dialog                 | alert, alert-dialog, dialog, popup, popconfirm-dialog      |
| Avatar                         | avatar, avatar-group, avatar-image, avatar-text            |
| Banner & Callout               | banner, banner-box, announcement-banner, phase-banner,     |
|                                | government-banner, super-banner, medical-banner,           |
|                                | information-callout, warning-callout                       |
| Breadcrumb                     | breadcrumb-nav, breadcrumb-list, breadcrumb-list-item,     |
|                                | breadcrumb-link                                            |
| Button                         | button, button-input, button-group, icon-button,           |
|                                | toggle-button, switch-button, split-button, float-button,  |
|                                | download-button, clipboard-copy-button                     |
| Calendar (table)               | calendar-table + head/body/foot/row/th/td,                 |
|                                | calendar-range-picker                                      |
| Card                           | card, feature-card, product-card, care-card, hover-card    |
| Chart                          | area-chart, bar-chart, column-chart, line-chart,           |
|                                | scatter-chart, sparkline, graphic-block                    |
| Chat                           | chat-nav, chat-list, chat-list-item, chat-message          |
| Code                           | code, code-block                                           |
| Color                          | color-input, color-picker, color-picker-button             |
| Container & Layout             | container, container-with-fixed-width,                     |
|                                | container-with-fluid-width, content-block, article-layout, |
|                                | aspect-ratio-container, padding-reset, framer, grid,       |
|                                | flex-stack, masonry, sidebar, tile, separator              |
| Contents                       | contents-nav, contents-list, contents-list-item,           |
|                                | contents-link                                              |
| Data Table                     | data-table + head/body/foot/row/th/td, data-filter-form    |
| Date & Time                    | date-input, date-field, date-range, date-time-local-input, |
|                                | date-time-now-input, date-time-view, time-input,           |
|                                | time-picker-input, month-input, week-input                 |
| Description / Summary lists    | description-list, description-list-item, summary-list,     |
|                                | summary-list-item, summary-box                             |
| Drawer / Sheet / Panel         | drawer, slide-out-drawer, sheet, floating-panel, panel,    |
|                                | success-panel                                              |
| Editorial                      | byline, headline, hero-headline, body-text, blockquote,    |
|                                | end-notes, related-content                                 |
| Emoji                          | emoji, emoji-character-picker                              |
| Email & Tel                    | email-input, email-link, tel-input, tel-link               |
| Error & Validation             | error-message, error-summary, validation-list,             |
|                                | validation-list-item, hint, character-counter              |
| Feature flag                   | ai-label, badge, flair, status-light, status-tag, tag,     |
|                                | tag-group, tag-input                                       |
| File                           | file-input, file-upload, file-dialog, file-manager,        |
|                                | image-file-input                                           |
| Footer / Header                | footer, header                                             |
| Form                           | form, field, fieldset, label, input, hidden-input,         |
|                                | reset-input, submit-input, input-group, input-with-mask    |
| Gantt (table)                  | gantt-table + thead/tbody/tfoot/tr/th/td                   |
| Go-to                          | go-to-top, go-to-next-section, go-to-previous-section,     |
|                                | skip-link, back-link                                       |
| Grail layout                   | grail-layout + top-header/left-aside/center-main/          |
|                                | right-aside/bottom-footer                                  |
| Government                     | government-banner, government-identifier                   |
| Healthcare identifiers         | espana-tarjeta-sanitaria-individual-{input,view},          |
|                                | france-numero-d-identification-au-repertoire-{input,view}, |
|                                | ireland-individual-health-identifier-{input,view},         |
|                                | northern-ireland-health-and-care-number-{input,view},      |
|                                | united-kingdom-national-health-service-number-{input,view},|
|                                | united-states-social-security-number-{input,view}          |
| Hero / Mockup / Pictogram      | hero, hero-headline, mockup-{browser,laptop,phone-…,       |
|                                | shell,tablet-…,watch,window}, pictogram                    |
| Interactive controls           | slider, slider-button, dial, dial-group, range-input,      |
|                                | angle-slider-range-input, switch-button, toggle-button,    |
|                                | toggle-group, segment-group, segment-group-item            |
| Kanban (table)                 | kanban-table + head/body/foot/row/th/td                    |
| List patterns                  | check-list, check-list-item, icon-list, icon-list-item,    |
|                                | step-list, step-list-item, timeline-list,                  |
|                                | timeline-list-item, collection-list, collection-list-item, |
|                                | document-list, document-list-item, transfer-list,          |
|                                | do-list, do-list-item, dont-list, dont-list-item           |
| Measurement                    | measurement-instance-{input,view},                         |
|                                | measurement-system-{input,view},                           |
|                                | measurement-unit-{input,view}                              |
| Media                          | image, image-input, feature-photo, photo-pack, figure,     |
|                                | caption, video-player, qr-code, signature-pad              |
| Menu                           | menu, menu-item, menu-group, menu-bar, menu-bar-button,    |
|                                | context-menu, context-menu-item, dropdown-menu,            |
|                                | hamburger-menu, navigation-menu, command, cascader         |
| Notification & Toast           | notification, toast, sonner, sticky-promo-banner           |
| Overlay                        | popover, hover-card, tooltip, coachmark, contextual-help,  |
|                                | overlay-container                                          |
| Pagination                     | pagination-nav, pagination-list, pagination-list-item,     |
|                                | pagination-link                                            |
| Password & PIN                 | password-input, password-input-or-text-input-div,          |
|                                | pin-input-div                                              |
| Picker & Rating                | five-face-rating-picker, five-face-rating-picker-button,   |
|                                | five-face-rating-view, five-star-rating-picker,            |
|                                | five-star-rating-picker-button, five-star-rating-view,     |
|                                | net-promoter-score-picker, net-promoter-score-picker-button|
|                                | net-promoter-score-view, red-amber-green-picker,           |
|                                | red-amber-green-picker-button, red-amber-green-view,       |
|                                | red-orange-yellow-green-blue-picker (+button, view),       |
|                                | theme-picker, theme-picker-button, theme-view, theme-select|
|                                | theme-select-option                                        |
| Progress                       | progress, progress-bar, progress-circle, progress-spinner, |
|                                | loading, skeleton, meter                                   |
| Radio & Checkbox               | radio-input, radio-group, checkbox-input, checkbox-group,  |
|                                | accordion-checkbox, mutually-exclusive                     |
| Scroll & Resize                | scroll-area, scroll-bar, scroller, scroller-base,          |
|                                | scroller-video, horizontal-scroller, resizable, splitter,  |
|                                | split-view, affix, visible                                 |
| Search & Combobox              | search-input, text-input-with-search, combobox, listbox,   |
|                                | select, select-with-extras, option, autosuggest,           |
|                                | mentions-input, tree-select                                |
| Section navigation             | section-nav, section-list, section-list-item, section-link,|
|                                | section-heading                                            |
| Semantic entities              | person, organization, place, event                         |
| Special text                   | citation, digital-object-identifier-link, footnote, kbd,   |
|                                | character, screen-reader-span, clamp-text                  |
| Statistic                      | statistic, watermark, beach-ball                           |
| Step / Tour / Task list        | step-list (+item), tour, tour-list, tour-list-item,        |
|                                | task-list, task-list-item                                  |
| Table (plain)                  | table + head/body/foot/row/th/td                           |
| Tabs                           | tab-bar, tab-bar-button, tab-panel                         |
| Theme                          | theme-provider, theme-picker, theme-picker-button,         |
|                                | theme-view, theme-select, theme-select-option              |
| Tile map / Visualization extra | tile-map, diff, sparkline                                  |
| Timer / Time                   | timer, timer-button, timeout-dialog                        |
| Toolbar / Taskbar              | tool-bar, tool-bar-button, task-bar, task-bar-button       |
| Tree                           | tree-nav, tree-list, tree-list-item, tree-link, tree-menu, |
|                                | tree-select                                                |
| Editable                       | editable, editable-form                                    |
| Currency / Number / URL        | currency-input, number-input, url-input, postal-code-input,|
|                                | postal-code-view                                           |
| Misc                           | beach-ball, call-to-action, carousel, comment,             |
|                                | info-state, newsletter-signup, share-page, expander,       |
|                                | collapsible, details                                       |

## 6. Naming conventions

See [AGENTS/components.md](AGENTS/components.md) for full detail.

### 6.1 Suffix → HTML element mapping

| Suffix          | Element      | Example                                       |
| --------------- | ------------ | --------------------------------------------- |
| `-article`      | `<article>`  |                                               |
| `-aside`        | `<aside>`    | grail-layout-left-aside                       |
| `-button`       | `<button>`   | button, toggle-button, switch-button          |
| `-dialog`       | `<dialog>`   | dialog, alert-dialog, file-dialog             |
| `-div`          | `<div>`      | pin-input-div                                 |
| `-fieldset`     | `<fieldset>` | fieldset                                      |
| `-figure`       | `<figure>`   | figure                                        |
| `-footer`       | `<footer>`   | footer                                        |
| `-header`       | `<header>`   | header                                        |
| `-input`        | `<input>`    | text-input, date-input, email-input           |
| `-kbd`          | `<kbd>`      | kbd                                           |
| `-list`         | `<ol>`/`<ul>`| check-list, task-list (do-list uses `<ul>`)   |
| `-list-item`    | `<li>`       | check-list-item, task-list-item               |
| `-main`         | `<main>`     | grail-layout-center-main                      |
| `-meter`        | `<meter>`    | meter                                         |
| `-nav`          | `<nav>`      | breadcrumb-nav, tree-nav                      |
| `-option`       | `<option>`   | option, theme-select-option                   |
| `-picker`       | `<div>`      | color-picker, five-star-rating-picker         |
| `-progress`     | `<progress>` | progress                                      |
| `-select`       | `<select>`   | select, theme-select                          |
| `-span`         | `<span>`     | flair, character, screen-reader-span          |
| `-table`        | `<table>`    | table, data-table, calendar-table             |
| `-table-head`   | `<thead>`    | table-head, data-table-head, calendar-…       |
| `-table-body`   | `<tbody>`    | table-body, data-table-body, calendar-…       |
| `-table-foot`   | `<tfoot>`    | table-foot, data-table-foot, calendar-…       |
| `-table-row`    | `<tr>`       | table-row, data-table-row, calendar-…         |
| `-table-th`     | `<th>`       | table-th, data-table-th, calendar-…           |
| `-table-td`     | `<td>`       | table-td, data-table-td, calendar-…           |
| `-table-thead`  | `<thead>`    | gantt-table-thead (gantt only)                |
| `-table-tbody`  | `<tbody>`    | gantt-table-tbody (gantt only)                |
| `-table-tfoot`  | `<tfoot>`    | gantt-table-tfoot (gantt only)                |
| `-table-tr`     | `<tr>`       | gantt-table-tr (gantt only)                   |

### 6.2 Name patterns

Stable compound-component name patterns (full list in
[AGENTS/components.md](AGENTS/components.md)):

- `*Bar` + `*BarButton` — ActionBar/ActionBarButton, MenuBar/MenuBarButton,
  TabBar/TabBarButton, TaskBar/TaskBarButton, ToolBar/ToolBarButton.
- `*Group` + `*GroupItem` — SegmentGroup/SegmentGroupItem.
- `*List` + `*ListItem` — many: CheckList, CollectionList, ContentsList,
  DescriptionList, DocumentList, DoList, DontList, IconList, PaginationList,
  SectionList, StepList, SummaryList, ValidationList.
- `*Nav` + `*List` + `*ListItem` — AccordionNav, BreadcrumbNav, ChatNav,
  ContentsNav, PaginationNav, SectionNav, TreeNav.
- `*Menu` + `*MenuItem` — Menu/MenuItem, ContextMenu/ContextMenuItem.
- `*Select` + `*SelectOption` — ThemeSelect/ThemeSelectOption.
- `*Input` + `*Link` — EmailInput/EmailLink, TelInput/TelLink.
- `*Input` + `*View` — PostalCodeInput/PostalCodeView,
  MeasurementInstanceInput/MeasurementInstanceView.
- `*Picker` + `*PickerButton` — ColorPicker, FiveFaceRatingPicker,
  FiveStarRatingPicker, NetPromoterScorePicker, RedAmberGreenPicker,
  RedOrangeYellowGreenBluePicker, ThemePicker.
- `ContainerWith*` — ContainerWithFixedWidth, ContainerWithFluidWidth.
- Table sub-elements (`*TableHead/Body/Foot/Row/TH/TD`) — Table, CalendarTable,
  DataTable, KanbanTable.
- Gantt sub-elements use HTML names — GanttTable, GanttTableThead,
  GanttTableTbody, GanttTableTfoot, GanttTableTr, GanttTableTH, GanttTableTD.

## 7. Composition patterns

See [AGENTS/components.md §"Component composition patterns"](AGENTS/components.md)
and the helper docs in [AGENTS/components-helpers/](AGENTS/components-helpers/)
for canonical templates: Avatar, CalendarTable, DataTable, GanttTable,
GrailLayout, KanbanTable.

Headline patterns (recap):

- **Form**: `Form > Field > {Label, Input, Hint, ErrorMessage}` plus
  `ErrorSummary` and a `Button[type=submit]`.
- **Grail layout**: `GrailLayout > {TopHeader, LeftAside, CenterMain, RightAside,
  BottomFooter}` for a five-region responsive page shell.
- **Navigation**: `*Nav > *List > *ListItem` for breadcrumbs, contents,
  pagination, sections, tree, chat, accordion.
- **Table**: `*Table > *TableHead | *TableBody | *TableFoot > *TableRow >
  *TableTH | *TableTD`.

## 8. Per-component documentation

Each `components/{slug}/index.md` includes the following sections in this order:

1. **Title** — PascalCase name.
2. **Description** — one-sentence summary matching `components.tsv`.
3. **When to Use** — 3-5 positive-guidance bullets (when this component is the
   right choice, what user needs it serves, what contexts it fits).
4. **When Not to Use** — 2-4 bullets that name a specific Lily alternative,
   anti-patterns, and contexts where it doesn't belong.
5. **Usage** — realistic code example using semantic HTML with proper ARIA.
   Demo strings are concrete English content but flow through the same prop
   names a consumer would localise.
6. **Props / Slots / Parameters** — name, type, required, description.
7. **ARIA** — roles, states, properties used.
8. **Keyboard** — table of key + action.
9. **References** — links to WAI-ARIA APG, NHS UK, MDN, etc.

The companion `AGENTS.md` carries the canonical machine-readable metadata
(HTML tag, ARIA, keyboard contract, props) used by AI coding agents.

### 8.1 Quality standards for component docs

- Lily is headless: guidance is framework-agnostic.
- NHS research informs but doesn't dictate: adapt for headless context.
- "When Not to Use" always names specific Lily alternatives.
- Code examples use semantic HTML with proper ARIA.
- No hardcoded user-facing strings in examples — use realistic placeholder
  content.
- Consistent voice across all 487 components.

### 8.2 Component demo strategy (example subprojects)

Each `/components/{slug}` page in an example app renders:

- Component metadata (name, slug, description).
- A **live demo** rendering the actual component with sample data and styled CSS.
- A usage code snippet.
- An import statement.

Demo HTML is generated based on component suffix patterns (full mapping table in
the previous plan):

- `*-input` → labeled input with appropriate `type` attribute.
- `*-button` → button element with sample text.
- `*-nav` → nav element with `aria-label`.
- `*-list` → ordered list with sample items.
- `*-list-item` → list item with sample content.
- `*-table` → table with head/body/row structure.
- `*-table-head/body/foot/row/td/th` → table sub-elements.
- `*-view` → span with `role="img"` and sample data.
- `*-picker` → div with `role="radiogroup"` and sample options.
- `*-picker-button` → button within a picker.
- `*-link` → anchor element with `href`.
- `*-menu` → div with `role="menu"`.
- `*-menu-item` → div with `role="menuitem"`.
- Standalone components → semantic HTML based on component type.

Rendering approach per framework:

| Framework | Mechanism                      |
| --------- | ------------------------------ |
| HTML/JS   | `element.innerHTML = demo`     |
| Svelte    | `{@html demo}`                 |
| React     | `dangerouslySetInnerHTML`      |
| Vue       | `v-html` directive             |
| Blazor    | `MarkupString`                 |
| Nunjucks  | `{{ demo | safe }}`            |

## 9. Tooling

Scripts live in `bin/`:

| Script                                | Purpose                                              |
| ------------------------------------- | ---------------------------------------------------- |
| `bin/list-components-as-kebab-case`   | List all component slugs (one per line).             |
| `bin/list-components-as-pascal-case`  | List all component PascalCase names.                 |
| `bin/list-implementations`            | List implementation subprojects.                     |
| `bin/create-component-directory`      | Scaffold one component directory.                    |
| `bin/create-implementation-directory` | Scaffold one implementation directory.               |
| `bin/test`                            | Verify required files across repo + all subprojects. |
| `bin/sync`                            | Sync shared files across subprojects (rsync).        |
| `bin/update`                          | Update shared files.                                 |
| `bin/git-subtree-push`                | Push each subtree to its standalone remote.          |
| `bin/generate-storybook-stories.mjs`  | Generate Storybook stories.                          |

Note on syncing: AGENTS files at the repo root are canonical; `bin/sync` copies
them into subprojects with `rsync` (not symlinks, because `git subtree push`
does not follow symlinks across project boundaries).

## 10. References

External design systems and component libraries that inform Lily are listed in
[AGENTS/citations.md](AGENTS/citations.md). The current default visual
reference for the example apps is the NHS UK design system; see
[AGENTS/nhs-uk-design-system-references.md](AGENTS/nhs-uk-design-system-references.md)
for the canonical NHS pages.

Other inspirations include GOV.UK, ONSdigital, USWDS, Mozilla Protocol, Adobe
Spectrum, Ant Design, Wonderflow Wanda, Design System AU, DaisyUI, shadcn/ui,
Reuters graphics components.

Framework-specific notes:

- [AGENTS/sveltekit.md](AGENTS/sveltekit.md) — Svelte 5 + SvelteKit 2 conventions.
- [AGENTS/nunjucks.md](AGENTS/nunjucks.md) — Nunjucks macro conventions.

### 10.1 Reuters Graphics — editorial / scrollytelling influence

The [Reuters Graphics components](https://github.com/reuters-graphics/graphics-components)
library inspired Lily's editorial, scrollytelling, and layout primitives.
Reuters is Svelte-specific with SCSS; Lily adapts the patterns to its headless,
framework-plural, zero-CSS approach. The following Reuters-influenced components
are in the catalog and follow the adaptations below:

| Reuters source       | Lily slug(s)                                                              |
| -------------------- | ------------------------------------------------------------------------- |
| Article              | `article-layout`                                                          |
| Block                | `content-block`                                                           |
| PaddingReset         | `padding-reset`                                                           |
| Headline             | `headline`                                                                |
| HeroHeadline         | `hero-headline`                                                           |
| BodyText             | `body-text`                                                               |
| Byline               | `byline`                                                                  |
| EndNotes             | `end-notes`                                                               |
| InfoBox              | `information-callout`                                                     |
| Scroller             | `scroller`                                                                |
| ScrollerBase         | `scroller-base`                                                           |
| ScrollerVideo        | `scroller-video`                                                          |
| HorizontalScroller   | `horizontal-scroller`                                                     |
| GraphicBlock         | `graphic-block`                                                           |
| FeaturePhoto         | `feature-photo`                                                           |
| PhotoPack            | `photo-pack`                                                              |
| Video                | `video-player`                                                            |
| Visible              | `visible`                                                                 |
| Theme                | `theme-provider`                                                          |
| SimpleTimeline       | `timeline-list`, `timeline-list-item`                                     |
| TileMap              | `tile-map`                                                                |
| Framer               | `framer`                                                                  |
| Table, SearchInput,  | already covered by `data-table`+sub-elements, `text-input-with-search` /  |
| Spinner, BeforeAfter | `search-input`, `loading` / `progress-spinner`, `diff`                    |

Key adaptations from Reuters:

| Reuters pattern                | Lily adaptation                                                          |
| ------------------------------ | ------------------------------------------------------------------------ |
| `Block` with named widths      | CSS custom properties (`--content-width-*`) set by `article-layout`,     |
|                                | read by `content-block`. Consumer owns the values.                       |
| SCSS mixins for typography     | Consumer provides typography via CSS targeting the kebab-case classes.   |
| `Markdown` component           | Props accept plain text or `children` slots; rendering is the consumer's.|
| String-or-Snippet duality      | Props accept content via slots/children; consumer decides rendering.     |
| `IntersectionObserver` baked in| Documented behaviour; the headless implementation wires the observer.    |
| `display: contents` on Theme   | Recommended pattern for `theme-provider`; only allowed inline style.     |
| Svelte 5 `$bindable()`         | Documented as two-way binding props where applicable.                    |

Reuters column-width system (CSS custom property convention):

```css
.article-layout {
  --content-width-narrower: 330px;
  --content-width-narrow:   510px;
  --content-width-normal:   660px;
  --content-width-wide:     930px;
  --content-width-wider:    1200px;
}

.content-block {
  max-width: var(--content-width-normal);
  margin-inline: auto;
}

.content-block[data-width="wide"]  { max-width: var(--content-width-wide); }
.content-block[data-width="wider"] { max-width: var(--content-width-wider); }
```

Excluded from Lily (Reuters-specific branding, third-party integrations, or
already covered): SiteHeader, SiteFooter, ToolsHeader, ReutersLogo,
ReutersGraphicsLogo, KinesisLogo, Analytics, AdSlot, SEO, PymChild,
EmbedPreviewerLink, DatawrapperChart, DocumentCloud, Lottie, ReferralBlock,
BlogPost, BlogTOC, ClockWall, Headpile, LanguageButton, SiteHeadline.

## 11. Acceptance criteria

The criteria below describe the **complete** Lily Design System. Anything
checked is considered live work; anything unchecked is queued in §12.

### 11.1 Catalog & docs

- [x] Canonical component list defined (487 components in `components.tsv`).
- [x] CSS style sheet template covers every component class hook.
- [x] All 487 components have a directory in `components/` with `index.md`,
      `README.md` (symlink), `AGENTS.md`, `CLAUDE.md`, `plan.md`, `tasks.md`.
- [x] All 487 components have separate "When to Use" and "When Not to Use"
      sections (not combined).
- [x] All "When Not to Use" sections name specific Lily component alternatives.
- [x] All 37 NHS-equivalent components enhanced with NHS-researched guidance.
- [x] All ~370 remaining components enhanced with original headless-context
      guidance.
- [x] Component naming patterns documented and consistent.
- [x] Suffix-to-HTML-element mapping documented and accurate.
- [x] Composition patterns documented (Form, Navigation, Table, Grail Layout,
      Avatar, CalendarTable, DataTable, GanttTable, KanbanTable).

### 11.2 Subprojects

- [x] All 6 headless subprojects exist (HTML, Svelte, React, Vue, Blazor,
      Nunjucks).
- [x] All 6 example subprojects exist (HTML+CSS+JS, SvelteKit, Next.js, Nuxt.js,
      Blazor Web, Nunjucks Eleventy).
- [x] All 12 subprojects have required files (`index.md`, `README.md` symlink,
      `AGENTS.md`, `CLAUDE.md`, `plan.md`, `tasks.md`, `.git-subtree-push`).
- [x] All example subprojects reference `AGENTS/examples.md` for route
      requirements.
- [x] All example subprojects have a `/components` route listing the full catalog.
- [x] All example subprojects have a `/components/{slug}` route with a live
      demo per component.
- [x] Component-demo data files include an `html` demo field for every
      component in each example subproject.

### 11.3 Tooling & verification

- [x] `bin/list-components-as-kebab-case` and `…-as-pascal-case` work.
- [x] `bin/list-implementations` works.
- [x] `bin/create-component-directory` and `bin/create-implementation-directory`
      scaffold correctly.
- [x] `bin/test` passes against the repository, all components, all subprojects.
- [x] `bin/sync` keeps shared files in sync (rsync, not symlink).
- [x] `bin/git-subtree-push` pushes each subtree to its remote.

### 11.4 Verified

- [x] `css-style-sheet-template.css` audit: 487 / 487 canonical slugs have
      a class hook; 3 additional documented sub-element hooks
      (`accordion-checkbox-input`, `accordion-checkbox-label`,
      `accordion-checkbox-panel`).
- [x] All 6 headless and 6 example subprojects implement all 487 canonical
      components. The 80 newly-added national personal identifier
      components (May 2026) shipped per-subproject implementations in
      Phase 2 (commits 50841648..490282db): Svelte, React, Vue, HTML,
      Blazor, Nunjucks headless libraries plus all 6 example apps. Sample
      tests pass in every framework that has runnable tests (38 svelte,
      19 react, 19 vue, 17 nunjucks, 9 blazor sample tests verified).
- [x] Cross-subproject name consistency: TabGroup removed,
      `medical-record-red-box` renamed; no orphans remain.
- [x] Per-framework test suites cover every component in every subproject:
      - svelte-headless: 4,016 vitest cases (407 dual-mirror specs).
      - react-headless: 2,205 vitest cases.
      - vue-headless: 2,187 vitest cases.
      - blazor-headless: 1,245 bUnit cases.
      - nunjucks-headless: 2,393 vitest cases.
      - html-headless: 407 WebDriverIO spec files.
- [x] Per-framework CSS class-name audit: 407 / 407 components in every
      headless subproject reference their canonical kebab-case base class.
- [x] Storybook story coverage across headless: 407 / 407 in svelte, react,
      vue, html (4 frameworks with Storybook; blazor + nunjucks do not).
- [x] Playwright e2e coverage on all 5 browser-runnable example apps:
      - svelte-sveltekit-examples: 1,221 specs.
      - react-next-examples: 1,221 specs.
      - vue-nuxt-examples: 1,221 specs.
      - blazor-web-examples: 1,221 specs.
      - html-css-js-examples: 814 specs.
      - nunjucks-eleventy-examples: 612 specs.

### 11.5 Accessibility audit (axe-core via Playwright)

axe-core / Playwright integration shipped across all 6 example apps.
Per-app baseline (axe-clean routes / total checked):

| App                            | Clean | Notes                                |
| ------------------------------ | ----- | ------------------------------------ |
| svelte-sveltekit-examples      | 29/29 | ✅ full pass                          |
| react-next-examples            | 29/29 | ✅ full pass                          |
| vue-nuxt-examples              | 29/29 | ✅ full pass                          |
| blazor-web-examples            | 29/29 | ✅ full pass                          |
| html-css-js-examples           | ~1/29 | Many static-HTML form-label gaps     |
| nunjucks-eleventy-examples     | 17/17 | ✅ full pass                          |

axe rule set: WCAG 2.0 A+AA, 2.1 A+AA, 2.2 AA.

### 11.6 Responsive viewport sweep

Responsive smoke check across 4 viewport sizes (mobile 375×667,
tablet 768×1024, desktop 1280×800, 4K 2560×1440) ported to all 6
example apps. Tests assert: skip-link present, `<main>` and H1
visible, no horizontal page overflow.

Each app loads ~10 representative routes (home, catalog, sample
component-detail pages, key composed pages) × 4 viewports = ~40
checks per app. Route paths adjusted per app:

| App                            | Route shape                                          |
| ------------------------------ | ---------------------------------------------------- |
| svelte-sveltekit-examples      | `/components/{slug}`, `/page-layout` (no slashes)    |
| react-next-examples            | `/components/{slug}`, `/page-layout` (no slashes)    |
| vue-nuxt-examples              | `/components/{slug}`, `/page-layout` (no slashes)    |
| blazor-web-examples            | `/components/{slug}`, `/page-layout` (no slashes)    |
| html-css-js-examples           | `/components/component.html?slug={slug}`, trailing slash on composed |
| nunjucks-eleventy-examples     | `/components/{slug}/` (trailing slash), no composed pages built yet  |

The nunjucks-eleventy app skips composed-page routes (only catalog
+ component-detail pages are built), and tests skip individually if
a built route 404s.

### 11.7 Storybook coverage

| Library              | Storybook    | Stories       |
| -------------------- | ------------ | ------------- |
| html-headless        | yes (vite)   | 487 / 487     |
| svelte-headless      | yes (vite)   | 487 / 487     |
| react-headless       | yes (vite)   | 487 / 487     |
| vue-headless         | yes (vite)   | 487 / 487     |
| nunjucks-headless    | yes (vite)   | 487 / 487     |
| blazor-headless      | no           | not planned   |

Blazor headless deliberately skips Storybook: there is no idiomatic
`@storybook/blazor` framework, and the runtime-rendering pipeline
(bUnit + `dotnet watch`) covers the same exploration use case. A
static-HTML pre-render pipeline would be possible but adds tooling
overhead that the project hasn't chosen to pay.

### 11.8 Open backlog

- [ ] axe-core: tune html-css-js-examples to reach the 29/29 baseline
      that the other 5 example apps already hit. blazor-web-examples
      reached 29/29 in commit 2eb6b11c via narrow ARIA fixes to 7
      Blazor headless components (ProgressCircle, FileUpload, DateRange,
      SwitchButton, Select, Combobox, DropdownMenu) plus a Listbox
      wrapper in the search-and-filter demo and a hamburger-menu
      link-padding tweak for WCAG 2.2 target-size.
- [x] Port the responsive viewport sweep from svelte-sveltekit to the
      other 5 example apps. Specs land in
      `{app}/e2e/responsive.spec.ts` with route paths adjusted per
      app (see §11.6 for the per-app route table). Runtime baselines
      still need to be captured per-app once each app's playwright
      runner is exercised.
- [x] National personal identifier Phase 2: implemented the 80 newly-
      catalogued components in all 6 headless subprojects (Svelte 5,
      React 19, Vue 3, plain HTML, Blazor 10, Nunjucks 3) and all 6
      example apps. Each follows the existing
      `france-numero-d-identification-au-repertoire-{input,view}`
      pattern: `<input type="text" autocomplete="off">` for the input
      variant, `<span aria-label=...>` for the view variant. Tests,
      demo registry entries, and Storybook stories landed in commits
      50841648..490282db.

## 12. Implementation status

### 12.1 Completed work (carried over from prior tasks.md)

#### Catalog & infrastructure

- [x] Create canonical component list (now 407 components).
- [x] Create CSS style sheet template.
- [x] Create scaffolding/listing/testing tools.
- [x] Create `AGENTS.md` with component patterns and composition patterns.
- [x] Create all 6 headless subprojects (HTML, Svelte, React, Vue, Blazor,
      Nunjucks).
- [x] Create all 6 example subprojects (HTML+CSS+JS, SvelteKit, Next.js,
      Nuxt.js, Blazor Web, Nunjucks Eleventy).
- [x] Document suffix-to-HTML-element mapping.
- [x] Document component name patterns and composition patterns.
- [x] Document accessibility standards (WCAG 2.2 AAA, WAI-ARIA APG).
- [x] Document internationalisation principles.
- [x] Document theming approach (token shape, `ThemeProvider`, `data-theme`).

#### Repairs

- [x] Fix duplicate entries in `AGENTS/components.md` (chat-nav, chat-list,
      chat-list-item, chat-message).
- [x] Fix wrong links in `index.md` (accordion-link, pagination-link).
- [x] Fix typo in `AGENTS/accessibility.md` filename across all subprojects.
- [x] Harmonise component count across `plan.md`, `tasks.md`, and subprojects.
- [x] Remove non-existent "thing" entry from semantic concepts.
- [x] Create 26 missing component directories with documentation.
- [x] Populate 8 empty component files (chat-nav, chat-list, chat-list-item,
      chat-message, citation, diff, digital-object-identifier-link,
      mockup-phone-portrait).
- [x] Deduplicate `components.csv` (325 → 364 → 407 over time).

#### Per-component demos

- [x] Create `generate-component-demos.js` script for demo-HTML generation.
- [x] Add live component demos to `/components/{slug}` pages in all example
      subprojects:
  - [x] `component-demos.ts` for SvelteKit examples.
  - [x] `component-demos.ts` for Next.js examples.
  - [x] `component-demos.ts` for Nuxt.js examples.
  - [x] SvelteKit `/components/[slug]` page renders via `{@html}`.
  - [x] Next.js `/components/[slug]` page renders via
        `dangerouslySetInnerHTML`.
  - [x] Nuxt.js `/components/[slug]` page renders via `v-html`.
  - [x] Blazor Web `ComponentData.cs` + `ComponentDetail.razor` render via
        `MarkupString`.
  - [x] HTML+CSS+JS `component.html` renders via `innerHTML`.

#### Subproject harmonisation

- [x] Harmonise all subproject `index.md`, `AGENTS.md`, `plan.md`, `tasks.md`.
- [x] Update component counts across all subproject `index.md` and `AGENTS.md`.
- [x] Add `@AGENTS/examples.md` reference to all example subproject
      `AGENTS.md`.
- [x] Update plan/tasks acceptance criteria across all subprojects.
- [x] Update tasks to reflect `/components` route work in all example
      subprojects.

#### Per-component documentation (407 components)

- [x] All 407 component `index.md` files enhanced with separate "When to Use"
      and "When Not to Use" sections plus improved realistic code examples.
- [x] Phase 1: NHS-researched component enhancements (65 Lily components mapped
      to 37 NHS components).
- [x] Phase 2: Original guidance for the remaining ~340 components grouped by
      category.

#### Recent (May 2026)

- [x] Extend component catalogs from 259 to 407 entries across 3 example apps
      (commit `26c11ae0`).
- [x] Add Playwright e2e to svelte-sveltekit-examples and fix broken Header
      imports (commit `6f297650`).
- [x] Add per-component bUnit tests for Blazor headless library and example
      app (commit `1b8600d4`).
- [x] Add Playwright e2e tests across 5 example apps and Storybook for Vue/React
      example apps (commit `7a51013b`).
- [x] Add `.gitignore` entries for build artifacts and test outputs across all
      13 projects (commit `624bbb94`).

### 12.2 Open backlog

Backlog items live in §11.4 and are not duplicated here. New work items added
during ongoing development should be appended there (or to the appropriate
section), not into a separate `tasks.md`.

## 13. Roadmap

Near-term focus:

1. Catalog and css-template audit — close §11.4 items.
2. Cross-subproject component coverage audit — ensure all 407 components are
   implemented in every headless and example subproject.
3. Test-coverage audit — vitest, bUnit, Playwright e2e cover every component.

Medium-term:

- Add alternative reference themes (GOV.UK, USWDS, Mozilla Protocol, Adobe
  Spectrum) as parallel `theme-*` CSS layers in the example subprojects.
- Expand composed-page demos beyond the required routes.

Long-term:

- Versioned releases per subproject npm/NuGet package.
- Contributor onboarding documentation (currently informal).

## 14. Tracking

- Package: lily
- Version: 0.2.0
- Created: 2025-08-09
- Updated: 2026-05-24
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or contact
  for other terms)
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
- Canonical catalog: [components.tsv](components.tsv) (407 rows, tab-separated:
  slug, name, description)
- Companion docs: [AGENTS.md](AGENTS.md), [AGENTS/*.md](AGENTS/),
  [index.md](index.md)
- Subtree pushes: see each subproject's `.git-subtree-push` file
