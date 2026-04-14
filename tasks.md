# Lily Design System — Tasks

## Done

- [x] Create canonical component list (332 components)
- [x] Create CSS style sheet template
- [x] Create tools (list-components, test-components, test-implementations)
- [x] Create AGENTS.md with component patterns and composition patterns
- [x] Create all 5 headless subprojects (HTML, Svelte, React, Vue, Blazor)
- [x] Create all 5 example subprojects (HTML JS, SvelteKit, Next.js, Nuxt, Blazor Web)
- [x] Document suffix-to-HTML-element mapping
- [x] Document component name patterns
- [x] Document component composition patterns
- [x] Document accessibility standards (WCAG 2.2 AAA)
- [x] Document internationalization principles
- [x] Fix duplicate entries in AGENTS/components.md (chat-nav, chat-list, chat-list-item, chat-message)
- [x] Fix wrong links in index.md (accordion-link, pagination-link)
- [x] Fix typo in AGENTS/accessibility.md filename (across all 10 subprojects)
- [x] Harmonize component count across plan.md, tasks.md (332)
- [x] Remove "thing" from semantic concepts section (no component exists)
- [x] Create 26 missing component directories with documentation
- [x] Populate 8 empty component files (chat-nav, chat-list, chat-list-item, chat-message, citation, diff, digital-object-identifier-link, mockup-phone)
- [x] Create lily-design-system-blazor-headless subproject files (index.md, README.md, AGENTS.md, CLAUDE.md, plan.md, tasks.md)
- [x] Deduplicate components.csv (325 → 332)
- [x] Create generate-component-demos.js script for demo HTML generation
- [x] Add live component demos to /components/{slug} pages in all 5 example subprojects
  - [x] Generate component-demos.ts for lily-design-system-svelte-sveltekit-examples (332 demos)
  - [x] Generate component-demos.ts for lily-design-system-react-next-examples (332 demos)
  - [x] Generate component-demos.ts for lily-design-system-vue-nuxt-examples (332 demos)
  - [x] Update lily-design-system-svelte-sveltekit-examples /components/[slug] page with live demo via {@html}
  - [x] Update lily-design-system-react-next-examples /components/[slug] page with live demo via dangerouslySetInnerHTML
  - [x] Update lily-design-system-vue-nuxt-examples /components/[slug] page with live demo via v-html
  - [x] Update lily-design-system-blazor-web-examples ComponentData.cs with DemoHtml field + ComponentDetail.razor with MarkupString
  - [x] Update lily-design-system-html-javascript-examples component.html with componentDemos object + innerHTML rendering

- [x] Harmonize all 10 subproject files (index.md, AGENTS.md, plan.md, tasks.md)
  - [x] Fix "316" → "332" component count across all subproject index.md and AGENTS.md
  - [x] Add @AGENTS/examples.md reference to all 5 example subproject AGENTS.md
  - [x] Update plan.md acceptance criteria across all 10 subprojects
  - [x] Update tasks.md to reflect /components route work in all 5 example subprojects

## Done (continued)

- [x] Enhance all 332 component index.md files with separate "When to Use" and "When Not to Use" sections plus improved realistic code examples
  - [x] Phase 1: NHS-researched component enhancements (65 Lily components mapped to 37 NHS components)
  - [x] Phase 2: Original guidance for remaining ~270 components grouped by category

### Phase 1 completed: NHS-researched components

- [x] action-link (NHS: Action link)
- [x] back-link (NHS: Back link)
- [x] breadcrumb-nav (NHS: Breadcrumbs)
- [x] breadcrumb-list (NHS: Breadcrumbs)
- [x] breadcrumb-list-item (NHS: Breadcrumbs)
- [x] breadcrumb-link (NHS: Breadcrumbs)
- [x] button (NHS: Buttons)
- [x] button-input (NHS: Buttons)
- [x] card (NHS: Card)
- [x] character-counter (NHS: Character count)
- [x] text-area-with-character-counter (NHS: Character count)
- [x] checkbox-input (NHS: Checkboxes)
- [x] checkbox-group (NHS: Checkboxes)
- [x] contents-nav (NHS: Contents list)
- [x] contents-list (NHS: Contents list)
- [x] contents-list-item (NHS: Contents list)
- [x] contents-link (NHS: Contents list)
- [x] date-input (NHS: Date input)
- [x] details (NHS: Details)
- [x] do-list (NHS: Do and Don't lists)
- [x] do-list-item (NHS: Do and Don't lists)
- [x] dont-list (NHS: Do and Don't lists)
- [x] dont-list-item (NHS: Do and Don't lists)
- [x] error-message (NHS: Error message)
- [x] error-summary (NHS: Error summary)
- [x] expander (NHS: Expander)
- [x] fieldset (NHS: Fieldset)
- [x] file-upload (NHS: File upload)
- [x] footer (NHS: Footer)
- [x] header (NHS: Header)
- [x] hint (NHS: Hint text)
- [x] image (NHS: Images)
- [x] inset-text (NHS: Inset text)
- [x] banner (NHS: Notification banners)
- [x] notification (NHS: Notification banners)
- [x] pagination-nav (NHS: Pagination)
- [x] pagination-list (NHS: Pagination)
- [x] pagination-list-item (NHS: Pagination)
- [x] pagination-link (NHS: Pagination)
- [x] panel (NHS: Panel)
- [x] password-input (NHS: Password input)
- [x] password-input-or-text-input-div (NHS: Password input)
- [x] radio-input (NHS: Radios)
- [x] radio-group (NHS: Radios)
- [x] review-date (NHS: Review date)
- [x] select (NHS: Select)
- [x] skip-link (NHS: Skip link)
- [x] summary-list (NHS: Summary list)
- [x] summary-list-item (NHS: Summary list)
- [x] table (NHS: Table)
- [x] table-head (NHS: Table)
- [x] table-body (NHS: Table)
- [x] table-foot (NHS: Table)
- [x] table-col (NHS: Table)
- [x] table-row (NHS: Table)
- [x] table-data (NHS: Table)
- [x] tab-bar (NHS: Tabs)
- [x] tab-bar-button (NHS: Tabs)
- [x] tag (NHS: Tag)
- [x] tag-group (NHS: Tag)
- [x] task-list (NHS: Task list)
- [x] task-list-item (NHS: Task list)
- [x] text-input (NHS: Text input)
- [x] textarea (NHS: Textarea)
- [x] warning-callout (NHS: Warning callout)

### Phase 2: Original guidance for remaining components (by category)

Write original "When to Use" and "When Not to Use" guidance for all non-NHS components. Group by category for voice consistency.

#### Accordion (4)
- [x] accordion-nav
- [x] accordion-list
- [x] accordion-list-item
- [x] accordion-link

#### Alert & Dialog (4)
- [x] alert
- [x] alert-dialog
- [x] dialog
- [x] popup

#### Avatar (4)
- [x] avatar
- [x] avatar-group
- [x] avatar-image
- [x] avatar-text

#### AI & Special Labels (3)
- [x] ai-label
- [x] badge
- [x] flair

#### Banner & Callout (7)
- [x] banner-box
- [x] super-banner
- [x] medical-banner
- [x] medical-banner-box
- [x] medical-banner-box-for-danger
- [x] medical-banner-box-for-advice
- [x] information-callout

#### Calendar (8)
- [x] calendar-table
- [x] calendar-table-head
- [x] calendar-table-body
- [x] calendar-table-foot
- [x] calendar-table-col
- [x] calendar-table-row
- [x] calendar-table-data
- [x] calendar-range-picker

#### Care & Medical (2)
- [x] care-card
- [x] medical-banner

#### Carousel & Media (3)
- [x] carousel
- [x] hero
- [x] beach-ball

#### Chat (4)
- [x] chat-nav
- [x] chat-list
- [x] chat-list-item
- [x] chat-message

#### Code (2)
- [x] code
- [x] code-block

#### Color (3)
- [x] color-input
- [x] color-picker
- [x] color-picker-button

#### Comment & Citation (3)
- [x] comment
- [x] citation
- [x] digital-object-identifier-link

#### Data Table (8)
- [x] data-table
- [x] data-table-head
- [x] data-table-body
- [x] data-table-foot
- [x] data-table-col
- [x] data-table-row
- [x] data-table-data
- [x] data-filter-form

#### Date & Time extended (7)
- [x] date-field
- [x] date-range
- [x] date-time-now-input
- [x] datetime-local-input
- [x] time-input
- [x] time-picker-input
- [x] month-input
- [x] week-input

#### Drawer & Panel (4)
- [x] drawer
- [x] slide-out-drawer
- [x] sheet
- [x] floating-panel

#### Editable (2)
- [x] editable
- [x] editable-form

#### Email & Tel (4)
- [x] email-input
- [x] email-link
- [x] tel-input
- [x] tel-link

#### Emoji (2)
- [x] emoji
- [x] emoji-character-picker

#### File extended (4)
- [x] file-dialog
- [x] file-input
- [x] file-manager
- [x] image-file-input

#### Form core (7)
- [x] form
- [x] field
- [x] label
- [x] input
- [x] hidden-input
- [x] reset-input
- [x] submit-input

#### Footnote & Text (5)
- [x] footnote
- [x] kbd
- [x] screen-reader-span
- [x] character
- [x] figure
- [x] caption

#### Gantt (7)
- [x] gantt-table
- [x] gantt-table-head
- [x] gantt-table-body
- [x] gantt-table-foot
- [x] gantt-table-col
- [x] gantt-table-row
- [x] gantt-table-data

#### Grail Layout (6)
- [x] grail-layout
- [x] grail-layout-top-header
- [x] grail-layout-left-aside
- [x] grail-layout-center-main
- [x] grail-layout-right-aside
- [x] grail-layout-bottom-footer

#### Healthcare Identifiers (12)
- [x] espana-tarjeta-sanitaria-individual-input
- [x] espana-tarjeta-sanitaria-individual-view
- [x] france-numero-d-identification-au-repertoire-input
- [x] france-numero-d-identification-au-repertoire-view
- [x] ireland-individual-health-identifier-input
- [x] ireland-individual-health-identifier-view
- [x] northern-ireland-health-and-care-number-input
- [x] northern-ireland-health-and-care-number-view
- [x] united-kingdom-national-health-service-number-input
- [x] united-kingdom-national-health-service-number-view
- [x] united-states-social-security-number-input
- [x] united-states-social-security-number-view

#### Interactive Controls (9)
- [x] switch-button
- [x] toggle-button
- [x] toggle-group
- [x] slider
- [x] slider-button
- [x] dial
- [x] dial-group
- [x] range-input
- [x] angle-slider-range-input

#### Kanban (7)
- [x] kanban-table
- [x] kanban-table-head
- [x] kanban-table-body
- [x] kanban-table-foot
- [x] kanban-table-col
- [x] kanban-table-row
- [x] kanban-table-data

#### List Patterns (4)
- [x] check-list
- [x] check-list-item
- [x] timeline-list
- [x] timeline-list-item

#### Measurement (6)
- [x] measurement-instance-input
- [x] measurement-instance-view
- [x] measurement-system-input
- [x] measurement-system-view
- [x] measurement-unit-input
- [x] measurement-unit-view

#### Menu extended (9)
- [x] menu
- [x] menu-item
- [x] menu-bar
- [x] menu-bar-button
- [x] context-menu
- [x] context-menu-item
- [x] dropdown-menu
- [x] hamburger-menu
- [x] navigation-menu

#### Mockup (8)
- [x] mockup-browser
- [x] mockup-laptop
- [x] mockup-phone
- [x] mockup-shell
- [x] mockup-tablet-landscape
- [x] mockup-tablet-portrait
- [x] mockup-watch
- [x] mockup-window

#### Media & Visual (5)
- [x] image-input
- [x] icon
- [x] sparkline
- [x] qr-code
- [x] diff

#### Overlay (3)
- [x] popover
- [x] hover-card
- [x] tooltip

#### Picker & Rating (20)
- [x] five-face-rating-picker
- [x] five-face-rating-picker-button
- [x] five-face-rating-view
- [x] five-star-rating-picker
- [x] five-star-rating-picker-button
- [x] five-star-rating-view
- [x] net-promoter-score-picker
- [x] net-promoter-score-picker-button
- [x] net-promoter-score-view
- [x] red-amber-green-picker
- [x] red-amber-green-picker-button
- [x] red-amber-green-view
- [x] red-orange-yellow-green-blue-picker
- [x] red-orange-yellow-green-blue-picker-button
- [x] red-orange-yellow-green-blue-view
- [x] theme-picker
- [x] theme-picker-button
- [x] theme-view
- [x] theme-select
- [x] theme-select-option

#### Progress & Loading (6)
- [x] progress
- [x] progress-circle
- [x] progress-spinner
- [x] loading
- [x] skeleton
- [x] meter

#### Scroll & Resize (4)
- [x] scroll-area
- [x] scroll-bar
- [x] resizable
- [x] splitter

#### Search & Combo (6)
- [x] search-input
- [x] text-input-with-search
- [x] combobox
- [x] listbox
- [x] select-with-extras
- [x] command

#### Segment (2)
- [x] segment-group
- [x] segment-group-item

#### Semantic Entities (4)
- [x] person
- [x] organization
- [x] place
- [x] event

#### Special Input (7)
- [x] currency-input
- [x] postal-code-input
- [x] postal-code-view
- [x] pin-input-div
- [x] number-input
- [x] url-input
- [x] signature-pad
- [x] tag-input

#### Structural (7)
- [x] aspect-ratio-container
- [x] collapsible
- [x] separator
- [x] sidebar
- [x] tile
- [x] call-to-action
- [x] clipboard-copy-button

#### Task & Tool Bar (4)
- [x] task-bar
- [x] task-bar-button
- [x] tool-bar
- [x] tool-bar-button

#### Toast & Notification (2)
- [x] toast
- [x] sonner

#### Tour (3)
- [x] tour
- [x] tour-list
- [x] tour-list-item

#### Tree (5)
- [x] tree-nav
- [x] tree-list
- [x] tree-list-item
- [x] tree-link
- [x] tree-menu

#### Timer (2)
- [x] timer
- [x] timer-button

#### Vital Signs (32)
- [x] vital-sign-belly-circumference-as-cm-input
- [x] vital-sign-belly-circumference-as-cm-view
- [x] vital-sign-blood-pressure-diastolic-as-mmhg-input
- [x] vital-sign-blood-pressure-diastolic-as-mmhg-view
- [x] vital-sign-blood-pressure-systolic-as-mmhg-input
- [x] vital-sign-blood-pressure-systolic-as-mmhg-view
- [x] vital-sign-body-fat-as-percentage-input
- [x] vital-sign-body-fat-as-percentage-view
- [x] vital-sign-body-temperature-as-celcius-input
- [x] vital-sign-body-temperature-as-celcius-view
- [x] vital-sign-cholesterol-as-hdl-mmol-per-litre-input
- [x] vital-sign-cholesterol-as-hdl-mmol-per-litre-view
- [x] vital-sign-cholesterol-as-ldl-mmol-per-litre-input
- [x] vital-sign-cholesterol-as-ldl-mmol-per-litre-view
- [x] vital-sign-heart-rate-as-beats-per-minute-input
- [x] vital-sign-heart-rate-as-beats-per-minute-view
- [x] vital-sign-heart-rate-variability-input
- [x] vital-sign-heart-rate-variability-view
- [x] vital-sign-height-as-cm-input
- [x] vital-sign-height-as-cm-view
- [x] vital-sign-respiratory-rate-as-breaths-per-minute-input
- [x] vital-sign-respiratory-rate-as-breaths-per-minute-view
- [x] vital-sign-sleep-score-as-0-to-100-input
- [x] vital-sign-sleep-score-as-0-to-100-view
- [x] vital-sign-total-sleep-time-as-min-per-day-input
- [x] vital-sign-total-sleep-time-as-min-per-day-view
- [x] vital-sign-vo2-max-as-ml-per-kg-per-minute-input
- [x] vital-sign-vo2-max-as-ml-per-kg-per-minute-view
- [x] vital-sign-waist-circumference-as-cm-input
- [x] vital-sign-waist-circumference-as-cm-view
- [x] vital-sign-weight-as-kg-input
- [x] vital-sign-weight-as-kg-view

## Backlog

- [ ] Audit CSS style sheet template against all implemented components
- [ ] Verify tools work across all subprojects
- [ ] Verify all subprojects have all 332 canonical components implemented
- [ ] Cross-check component names across all subprojects for consistency
