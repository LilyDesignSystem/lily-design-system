# Lily Design System -- Nunjucks Headless -- Tasks

Reference: [plan.md](plan.md).

## Done

- [x] Create subproject directory `lily-design-system-nunjucks-headless/`
- [x] Create `package.json` with `nunjucks`, `vitest`, `jsdom`
- [x] Run `pnpm install`
- [x] Create `vitest.config.js`
- [x] Create `test/render.js` shared render helper (Nunjucks + jsdom)
- [x] Create `AGENTS.md` with component architecture
- [x] Create `CLAUDE.md` referencing `AGENTS.md`
- [x] Create `index.md` with project overview
- [x] Create `README.md` symlink -> `index.md`
- [x] Create `AGENTS/` directory with shared docs
- [x] Add entry to root `AGENTS.md` linking to this subproject
- [x] Create `.git-subtree-push`

## In Progress

_(nothing currently in progress)_

## Backlog

### Infrastructure

- [ ] Add `lily-design-system-nunjucks-headless` to `bin/list-implementations`

### First-light verification (toolchain smoke test)

- [ ] Implement `components/button/macro.njk`
- [ ] Implement `components/button/macro.test.js`
- [ ] Run `pnpm test`; confirm button test passes
- [ ] Only after green: proceed to bulk authoring

### Component implementation -- priority groups

Each task below delivers `components/{component}/macro.njk` **and**
`components/{component}/macro.test.js`. Each component lives in its own
directory matching the NHS.UK frontend layout.

#### a. Static wrappers

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
- [ ] care-card
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

#### b. Form inputs

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
- [ ] datetime-local-input
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
- [ ] textarea
- [ ] text-area-with-character-counter
- [ ] time-input
- [ ] time-picker-input
- [ ] url-input
- [ ] week-input

#### c. Links and views

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

#### d. Vital sign views and inputs (16 pairs = 32 components)

- [ ] vital-sign-belly-circumference-as-cm-input
- [ ] vital-sign-belly-circumference-as-cm-view
- [ ] vital-sign-blood-pressure-diastolic-as-mmhg-input
- [ ] vital-sign-blood-pressure-diastolic-as-mmhg-view
- [ ] vital-sign-blood-pressure-systolic-as-mmhg-input
- [ ] vital-sign-blood-pressure-systolic-as-mmhg-view
- [ ] vital-sign-body-fat-as-percentage-input
- [ ] vital-sign-body-fat-as-percentage-view
- [ ] vital-sign-body-temperature-as-celcius-input
- [ ] vital-sign-body-temperature-as-celcius-view
- [ ] vital-sign-cholesterol-as-hdl-mmol-per-litre-input
- [ ] vital-sign-cholesterol-as-hdl-mmol-per-litre-view
- [ ] vital-sign-cholesterol-as-ldl-mmol-per-litre-input
- [ ] vital-sign-cholesterol-as-ldl-mmol-per-litre-view
- [ ] vital-sign-heart-rate-as-beats-per-minute-input
- [ ] vital-sign-heart-rate-as-beats-per-minute-view
- [ ] vital-sign-heart-rate-variability-input
- [ ] vital-sign-heart-rate-variability-view
- [ ] vital-sign-height-as-cm-input
- [ ] vital-sign-height-as-cm-view
- [ ] vital-sign-respiratory-rate-as-breaths-per-minute-input
- [ ] vital-sign-respiratory-rate-as-breaths-per-minute-view
- [ ] vital-sign-sleep-score-as-0-to-100-input
- [ ] vital-sign-sleep-score-as-0-to-100-view
- [ ] vital-sign-total-sleep-time-as-min-per-day-input
- [ ] vital-sign-total-sleep-time-as-min-per-day-view
- [ ] vital-sign-vo2-max-as-ml-per-kg-per-minute-input
- [ ] vital-sign-vo2-max-as-ml-per-kg-per-minute-view
- [ ] vital-sign-waist-circumference-as-cm-input
- [ ] vital-sign-waist-circumference-as-cm-view
- [ ] vital-sign-weight-as-kg-input
- [ ] vital-sign-weight-as-kg-view

#### e. Table families (5 families x 7 parts = 35 components)

- [ ] table, table-head, table-body, table-foot, table-col, table-row, table-data
- [ ] calendar-table, calendar-table-head, calendar-table-body, calendar-table-foot, calendar-table-col, calendar-table-row, calendar-table-data
- [ ] data-table, data-table-head, data-table-body, data-table-foot, data-table-col, data-table-row, data-table-data
- [ ] gantt-table, gantt-table-head, gantt-table-body, gantt-table-foot, gantt-table-col, gantt-table-row, gantt-table-data
- [ ] kanban-table, kanban-table-head, kanban-table-body, kanban-table-foot, kanban-table-col, kanban-table-row, kanban-table-data
- [ ] calendar-range-picker

#### f. Navigation patterns

- [ ] accordion-nav, accordion-list, accordion-list-item, accordion-link
- [ ] breadcrumb-nav, breadcrumb-list, breadcrumb-list-item, breadcrumb-link
- [ ] chat-nav, chat-list, chat-list-item, chat-message
- [ ] contents-nav, contents-list, contents-list-item, contents-link
- [ ] hamburger-menu
- [ ] navigation-menu
- [ ] pagination-nav, pagination-list, pagination-list-item, pagination-link
- [ ] tree-nav, tree-list, tree-list-item, tree-link
- [ ] tree-menu

#### g. List patterns

- [ ] check-list, check-list-item
- [ ] do-list, do-list-item
- [ ] dont-list, dont-list-item
- [ ] summary-list, summary-list-item
- [ ] task-list, task-list-item
- [ ] timeline-list, timeline-list-item
- [ ] tour, tour-list, tour-list-item

#### h. Bar patterns

- [ ] menu-bar, menu-bar-button
- [ ] tab-bar, tab-bar-button
- [ ] task-bar, task-bar-button
- [ ] tool-bar, tool-bar-button

#### i. Picker patterns

- [ ] color-picker, color-picker-button
- [ ] emoji-character-picker
- [ ] five-face-rating-picker, five-face-rating-picker-button, five-face-rating-view
- [ ] five-star-rating-picker, five-star-rating-picker-button, five-star-rating-view
- [ ] net-promoter-score-picker, net-promoter-score-picker-button, net-promoter-score-view
- [ ] red-amber-green-picker, red-amber-green-picker-button, red-amber-green-view
- [ ] red-orange-yellow-green-blue-picker, red-orange-yellow-green-blue-picker-button, red-orange-yellow-green-blue-view
- [ ] theme-picker, theme-picker-button, theme-select, theme-select-option, theme-view
- [ ] theme-provider

#### j. Form composition

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

#### k. Overlays and menus

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

#### l. Layout

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

#### m. Interactive specialty

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
- [ ] mockup-browser, mockup-laptop, mockup-phone, mockup-shell, mockup-tablet-landscape, mockup-tablet-portrait, mockup-watch, mockup-window
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

### Verification

- [ ] Run `pnpm test` with zero failures
- [ ] Cross-check delivered components against canonical list in
      `AGENTS/components.md`; no missing, no extras
- [ ] Grep `components/**/macro.njk` for `<style`, `style=`, `color:`,
      `px`, `rem`, `Tailwind` -> must return zero matches
- [ ] Grep `components/**/macro.njk` for `<script` -> must return zero
      matches
- [ ] Grep `components/**/macro.njk` for hardcoded strings in
      `aria-label`, `placeholder`, error text -> must return zero
      hardcoded content
- [ ] Confirm every component directory has both `macro.njk` and
      `macro.test.js`
- [ ] Confirm every macro root element has
      `class="{component-kebab-case} {{ params.classes | default('') }}"`
- [ ] Confirm every macro renders `params.attributes`
