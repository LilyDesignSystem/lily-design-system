# Lily Design System — Nunjucks Eleventy Examples — Tasks

Reference: [nunjucks-plan.md](nunjucks-plan.md).

## Infrastructure

- [ ] Create subproject directory `lily-design-system-nunjucks-eleventy-examples/`
- [ ] Create `package.json` with `@11ty/eleventy`, `nunjucks`,
      `vitest`, `jsdom`; ESM; scripts `dev`, `build`, `test`
- [ ] Run `pnpm install`
- [ ] Create `.eleventy.js` — shared Nunjucks `FileSystemLoader` that
      includes `../lily-design-system-nunjucks-headless` so headless
      macro imports resolve transparently
- [ ] Create `src/_data/site.js` (site name, language, nav metadata)
- [ ] Create `src/_data/components.js` (component inventory sourced
      from the canonical Lily list)
- [ ] Create `AGENTS.md`, `CLAUDE.md`
- [ ] Symlink shared `AGENTS/` docs
      (`lily.md`, `components.md`, `accessibility.md`,
      `internationalization.md`, `nunjucks.md`, `theme.md`,
      `nhs-uk-design-system-references.md`, `examples.md`)
- [ ] Create `index.md` project overview
- [ ] Symlink `README.md` → `index.md`
- [ ] Add entry to root `AGENTS.md` linking to this subproject
- [ ] Add `lily-design-system-nunjucks-eleventy-examples` to
      `bin/list-implementations`
- [ ] Gitignore `_site/` and `node_modules/`

## Base layouts and partials

- [ ] `src/_includes/layouts/base.njk` — `<html>`, `<head>`,
      skip-link, header, breadcrumb slot, `<main>`, footer, JS tag
- [ ] `src/_includes/layouts/page.njk` — standard content page
- [ ] `src/_includes/layouts/component-demo.njk` — component demo
      page (heading, description, examples, code, a11y notes,
      NHS UK reference links)
- [ ] `src/_includes/partials/header.njk` — NHS UK-style site header
- [ ] `src/_includes/partials/footer.njk` — NHS UK-style site footer
- [ ] `src/_includes/partials/sidebar-nav.njk` — component sidebar
- [ ] `src/_includes/partials/breadcrumb.njk` — page breadcrumb

## Design tokens (CSS custom properties)

- [ ] `src/assets/css/tokens/colors.css`
      (NHS Blue #005eb8, Dark Blue #003087, Bright Blue #0072ce,
      Light Blue #41b6e6, Aqua Blue #00a9ce, Black #212b32,
      Dark Grey #425563, Mid Grey #768692, Light Grey #d8dde0,
      Pale Grey #f0f4f5, White #ffffff, Red #d5281b,
      Warm Yellow #ffb81c, Yellow #ffeb3b, Green #007f3b,
      Pink #ae2573, Purple #330072)
- [ ] `src/assets/css/tokens/spacing.css`
      (0 / 4 / 8 / 16 / 24 / 32 / 40 / 64)
- [ ] `src/assets/css/tokens/typography.css`
      (stack `"Frutiger W01", Arial, sans-serif`; sizes 14/16/19/22/
      26/32/48/64; weights 400/600; line-heights)
- [ ] `src/assets/css/tokens/breakpoints.css`
      (320 / 641 / 769 / 990 / 1280)
- [ ] `src/assets/css/tokens/focus.css`
      (4px `--nhsuk-yellow` outer + 4px `--nhsuk-black` inner)

## Base styles

- [ ] `src/assets/css/base/reset.css`
- [ ] `src/assets/css/base/page.css`
      (page background `--nhsuk-white`, body text `--nhsuk-black`)
- [ ] `src/assets/css/base/typography.css`
      (headings, paragraph, modular scale)
- [ ] `src/assets/css/base/links.css`
      (link colour `--nhsuk-bright-blue`, visited, hover, active)
- [ ] `src/assets/css/base/focus-state.css`
      (`:focus-visible` ring — applies globally)
- [ ] `src/assets/css/main.css` — top-level `@import` entry

## Layout styles

- [ ] `src/assets/css/layout/width-container.css`
      (max-width, horizontal padding, breakpoints)
- [ ] `src/assets/css/layout/grid.css`
      (NHS UK 1 / 2 / 3 / 4 column responsive grid)
- [ ] `src/assets/css/layout/grail-layout.css`
      (style Lily's grail-layout + 5 slots responsively)

## First-light verification

- [ ] `src/assets/css/components/button.css` — NHS UK button style
      (primary, secondary, reverse, warning variants via
      `params.classes` modifier)
- [ ] `src/components/button.njk` — button demo page (default, all
      types, all variants, disabled state, with caller block)
- [ ] Run `pnpm build`; confirm button demo page exists in `_site/`
- [ ] Open the page in a browser; confirm NHS UK blue primary button
      and yellow/black focus ring
- [ ] Only after green: proceed to bulk style + demo authoring

## Component styles + demo pages — priority groups

Each bullet below delivers **both**
`src/assets/css/components/{component}.css`
**and** `src/components/{component}.njk`.

### a. Static wrappers

- [ ] alert
- [ ] ai-label
- [ ] aspect-ratio-container
- [ ] avatar
- [ ] avatar-group
- [ ] avatar-image
- [ ] avatar-text
- [ ] badge
- [ ] banner
- [ ] banner-box
- [ ] beach-ball
- [ ] call-to-action
- [ ] caption
- [ ] card
- [ ] care-card (NHS UK non-urgent / urgent / emergency variants)
- [ ] character
- [ ] character-counter
- [ ] citation
- [ ] code
- [ ] code-block
- [ ] comment
- [ ] emoji
- [ ] end-notes
- [ ] event
- [ ] figure
- [ ] flair
- [ ] footer
- [ ] footnote
- [ ] framer
- [ ] header
- [ ] hero
- [ ] icon
- [ ] image
- [ ] information-callout
- [ ] inset-text
- [ ] kbd
- [ ] loading
- [ ] medical-banner
- [ ] medical-banner-box
- [ ] medical-banner-box-for-advice
- [ ] medical-banner-box-for-danger
- [ ] notification
- [ ] organization
- [ ] panel
- [ ] person
- [ ] place
- [ ] progress
- [ ] progress-circle
- [ ] progress-spinner
- [ ] qr-code
- [ ] review-date
- [ ] screen-reader-span
- [ ] separator
- [ ] skeleton
- [ ] sparkline
- [ ] super-banner
- [ ] tag
- [ ] tag-group
- [ ] toast
- [ ] warning-callout

### b. Form inputs

- [ ] angle-slider-range-input
- [ ] button
- [ ] button-input
- [ ] checkbox-input
- [ ] checkbox-group
- [ ] color-input
- [ ] currency-input
- [ ] date-input
- [ ] date-field
- [ ] date-time-now-input
- [ ] date-time-local-input
- [ ] email-input
- [ ] file-input
- [ ] hidden-input
- [ ] image-file-input
- [ ] image-input
- [ ] input
- [ ] month-input
- [ ] number-input
- [ ] password-input
- [ ] password-input-or-text-input-div
- [ ] pin-input-div
- [ ] postal-code-input
- [ ] radio-input
- [ ] radio-group
- [ ] range-input
- [ ] reset-input
- [ ] search-input
- [ ] submit-input
- [ ] tag-input
- [ ] tel-input
- [ ] text-input
- [ ] text-input-with-search
- [ ] text-area-input
- [ ] text-area-input-with-character-counter
- [ ] time-input
- [ ] time-picker-input
- [ ] url-input
- [ ] week-input

### c. Links and views

- [ ] action-link
- [ ] back-link
- [ ] digital-object-identifier-link
- [ ] email-link
- [ ] skip-link
- [ ] tel-link
- [ ] date-range
- [ ] espana-tarjeta-sanitaria-individual-input
- [ ] espana-tarjeta-sanitaria-individual-view
- [ ] france-numero-d-identification-au-repertoire-input
- [ ] france-numero-d-identification-au-repertoire-view
- [ ] ireland-individual-health-identifier-input
- [ ] ireland-individual-health-identifier-view
- [ ] measurement-instance-input
- [ ] measurement-instance-view
- [ ] measurement-system-input
- [ ] measurement-system-view
- [ ] measurement-unit-input
- [ ] measurement-unit-view
- [ ] northern-ireland-health-and-care-number-input
- [ ] northern-ireland-health-and-care-number-view
- [ ] postal-code-view
- [ ] united-kingdom-national-health-service-number-input
- [ ] united-kingdom-national-health-service-number-view
- [ ] united-states-social-security-number-input
- [ ] united-states-social-security-number-view



### e. Table families (5 families × 7 parts = 35 components + 1)

- [ ] table, table-head, table-body, table-foot, table-th, table-row, table-td
- [ ] calendar-table, calendar-table-head, calendar-table-body, calendar-table-foot, calendar-table-th, calendar-table-row, calendar-table-td
- [ ] data-table, data-table-head, data-table-body, data-table-foot, data-table-th, data-table-row, data-table-td
- [ ] gantt-table, gantt-table-thead, gantt-table-tbody, gantt-table-tfoot, gantt-table-th, gantt-table-tr, gantt-table-td
- [ ] kanban-table, kanban-table-head, kanban-table-body, kanban-table-foot, kanban-table-th, kanban-table-row, kanban-table-td
- [ ] calendar-range-picker

### f. Navigation patterns

- [ ] accordion-nav, accordion-list, accordion-list-item, accordion-link
- [ ] breadcrumb-nav, breadcrumb-list, breadcrumb-list-item, breadcrumb-link
- [ ] chat-nav, chat-list, chat-list-item, chat-message
- [ ] contents-nav, contents-list, contents-list-item, contents-link
- [ ] hamburger-menu
- [ ] navigation-menu
- [ ] pagination-nav, pagination-list, pagination-list-item, pagination-link
- [ ] tree-nav, tree-list, tree-list-item, tree-link
- [ ] tree-menu

### g. List patterns

- [ ] check-list, check-list-item
- [ ] do-list, do-list-item
- [ ] dont-list, dont-list-item
- [ ] summary-list, summary-list-item
- [ ] task-list, task-list-item
- [ ] timeline-list, timeline-list-item
- [ ] tour, tour-list, tour-list-item

### h. Bar patterns

- [ ] menu-bar, menu-bar-button
- [ ] tab-bar, tab-bar-button
- [ ] task-bar, task-bar-button
- [ ] tool-bar, tool-bar-button

### i. Picker patterns

- [ ] color-picker, color-picker-button
- [ ] emoji-character-picker
- [ ] five-face-rating-picker, five-face-rating-picker-button, five-face-rating-view
- [ ] five-star-rating-picker, five-star-rating-picker-button, five-star-rating-view
- [ ] net-promoter-score-picker, net-promoter-score-picker-button, net-promoter-score-view
- [ ] red-amber-green-picker, red-amber-green-picker-button, red-amber-green-view
- [ ] red-orange-yellow-green-blue-picker, red-orange-yellow-green-blue-picker-button, red-orange-yellow-green-blue-view
- [ ] theme-picker, theme-picker-button, theme-select, theme-select-option, theme-view
- [ ] theme-provider

### j. Form composition

- [ ] form
- [ ] field
- [ ] fieldset
- [ ] error-message
- [ ] error-summary
- [ ] hint
- [ ] label
- [ ] data-filter-form
- [ ] editable
- [ ] editable-form

### k. Overlays and menus

- [ ] alert-dialog
- [ ] context-menu, context-menu-item
- [ ] dialog
- [ ] drawer
- [ ] dropdown-menu
- [ ] file-dialog
- [ ] file-manager
- [ ] file-upload
- [ ] floating-panel
- [ ] hover-card
- [ ] menu, menu-item
- [ ] popover
- [ ] popup
- [ ] sheet
- [ ] slide-out-drawer
- [ ] sonner
- [ ] tooltip

### l. Layout

- [ ] article-layout
- [ ] body-text
- [ ] byline
- [ ] content-block
- [ ] graphic-block
- [ ] grail-layout
- [ ] grail-layout-top-header
- [ ] grail-layout-left-aside
- [ ] grail-layout-center-main
- [ ] grail-layout-right-aside
- [ ] grail-layout-bottom-footer
- [ ] headline
- [ ] hero-headline
- [ ] horizontal-scroller
- [ ] padding-reset
- [ ] resizable
- [ ] scroll-area
- [ ] scroll-bar
- [ ] scroller
- [ ] scroller-base
- [ ] scroller-video
- [ ] sidebar
- [ ] splitter
- [ ] tile
- [ ] tile-map

### m. Interactive specialty

- [ ] carousel
- [ ] clipboard-copy-button
- [ ] collapsible
- [ ] combobox
- [ ] command
- [ ] details
- [ ] dial, dial-group
- [ ] diff
- [ ] expander
- [ ] feature-photo
- [ ] listbox
- [ ] meter
- [ ] mockup-browser, mockup-laptop, mockup-phone-portrait, mockup-shell, mockup-tablet-landscape, mockup-tablet-portrait, mockup-watch, mockup-window
- [ ] option
- [ ] photo-pack
- [ ] segment-group, segment-group-item
- [ ] select, select-with-extras
- [ ] signature-pad
- [ ] slider, slider-button
- [ ] switch-button
- [ ] timer, timer-button
- [ ] toggle-button, toggle-group
- [ ] video-player
- [ ] visible

## JavaScript behaviour modules (progressive enhancement only)

- [ ] `src/assets/js/main.js` — bootstrapper; walks the DOM looking
      for `data-module` attributes and initialises matching modules
- [ ] `src/assets/js/modules/header-menu.js` — mobile hamburger
- [ ] `src/assets/js/modules/details.js` — polyfill where needed
- [ ] `src/assets/js/modules/dialog.js` — modal open/close + focus
      trap + Escape key to close
- [ ] `src/assets/js/modules/tabs.js` — tab-bar panel switching
      (roving tabindex)
- [ ] `src/assets/js/modules/accordion.js` — accordion-list expand
      and collapse
- [ ] `src/assets/js/modules/character-count.js` — text-area-input
      character counter live update
- [ ] `src/assets/js/modules/combobox.js` — input + listbox combobox
- [ ] `src/assets/js/modules/popover.js` — popover show/hide + click
      outside to dismiss
- [ ] `src/assets/js/modules/toast.js` — Sonner-style toast stack
- [ ] `src/assets/js/modules/clipboard-copy.js` — copy-to-clipboard
      on ClipboardCopyButton

## Composed page templates

- [ ] `src/page-templates/default.njk` — default NHS UK service page
- [ ] `src/page-templates/form-example.njk` — multi-field form with
      error summary, hints, fieldsets, and check-before-you-submit
- [ ] `src/page-templates/dashboard-example.njk` — patient dashboard
      `care-card`, `summary-list`, `review-date`

## Landing and index pages

- [ ] `src/index.njk` — landing page (NHS UK hero-style)
- [ ] `src/components/index.njk` — component index grouped by
      priority tier with links to each demo page
- [ ] `src/page-templates/index.njk` — page template index

## Tests

- [ ] `test/build.test.js` — runs Eleventy programmatically; asserts
      `_site/` contains one HTML file per component
- [ ] `test/pages.test.js` — sample pages across tiers; each page's
      rendered DOM contains the expected Lily class name and the
      NHS UK header / footer / skip-link structure
- [ ] (Backlog) `pa11y-ci` or `axe` regression gate over `_site/`

## Verification

- [ ] `pnpm build` exits zero with no warnings
- [ ] `pnpm test` passes
- [ ] Cross-check every component has both a CSS file and a demo page
- [ ] Grep `src/assets/css/**/*.css` for raw hex colours and magic
      pixel values outside `tokens/` → must return zero matches
- [ ] Grep `src/assets/css/**/*.css` for `!important` (except in the
      shared focus declaration) → review and justify each match
- [ ] Grep templates for `class="nhsuk-` → must return zero matches
      (we style Lily classes, not NHS UK BEM classes)
- [ ] Keyboard-only walk of each page template with focus ring
      visible on every focusable element
- [ ] Manual contrast check on key surface combinations
- [ ] Confirm no third-party trackers or analytics are loaded

## Done

_(populated as infrastructure, styles, and demo pages ship)_
