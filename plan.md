# Lily Design System — Implementation Plan

## Goal

Maintain the canonical component list, design tokens, and CSS style sheet template for the Lily Design System. Coordinate across 5 headless component library subprojects and 5 example application subprojects. Each example subproject demonstrates every component with working demos.

## Approach

1. Maintain canonical component list (332 components) in AGENTS.md and AGENTS/components.md
2. Maintain CSS style sheet template for component class names
3. Provide tools for listing, testing, and verifying components
4. Ensure all subprojects stay in sync with the canonical list
5. Document design principles, accessibility standards, and patterns
6. Each subproject has: index.md, README.md (symlink), AGENTS.md, CLAUDE.md, plan.md, tasks.md
7. Each example subproject has `/components` route listing all components
8. Each example subproject has `/components/{slug}` route demonstrating one component
9. Component demos render the actual headless HTML with NHS CSS styling
10. Use `componentDemos` data mapping slug → demo HTML for each component

## Component Demo Strategy

Each `/components/{slug}` page shows:
- Component metadata (name, slug, description)
- **Live demo** rendering the actual component with sample data and NHS CSS
- Usage code snippet
- Import statement

Demo HTML is generated based on component suffix patterns:
- `*-input` → labeled input element with appropriate type attribute
- `*-button` → button element with sample text
- `*-nav` → nav element with aria-label
- `*-list` → ordered list with sample items
- `*-list-item` → list item with sample content
- `*-table` → table with head/body/row structure
- `*-table-head/body/foot/col/row/data` → table sub-elements
- `*-view` → span with role="img" and sample data
- `*-picker` → div with role="radiogroup" and sample options
- `*-picker-button` → button within a picker
- `*-link` → anchor element with href
- `*-menu` → div with role="menu"
- `*-menu-item` → div with role="menuitem"
- Standalone components → semantic HTML based on component type

Rendering approach per framework:
- HTML/JS: innerHTML injection
- Svelte: {@html demo}
- React: dangerouslySetInnerHTML
- Vue: v-html directive
- Blazor: MarkupString

## Component Documentation Enhancement Strategy

Enhance all 332 component `index.md` files with NHS-style usage guidance and improved code examples. Uses a two-phase approach: NHS-researched components first to establish quality templates, then original guidance for remaining components.

### Phase 1: NHS-researched components (37 components)

Research each component's page at https://service-manual.nhs.uk/design-system/components/ and adapt the guidance for Lily's headless context. These 37 components have direct NHS Design System equivalents:

| NHS Component | Lily Component(s) | NHS URL path |
|---|---|---|
| Action link | action-link | /components/action-link |
| Back link | back-link | /components/back-link |
| Breadcrumbs | breadcrumb-nav, breadcrumb-list, breadcrumb-list-item, breadcrumb-link | /components/breadcrumbs |
| Buttons | button, button-input | /components/buttons |
| Card | card | /components/card |
| Character count | character-counter, text-area-with-character-counter | /components/character-count |
| Checkboxes | checkbox-input, checkbox-group | /components/checkboxes |
| Contents list | contents-nav, contents-list, contents-list-item, contents-link | /components/contents-list |
| Date input | date-input | /components/date-input |
| Details | details | /components/details |
| Do and Don't lists | do-list, do-list-item, dont-list, dont-list-item | /components/do-and-dont-lists |
| Error message | error-message | /components/error-message |
| Error summary | error-summary | /components/error-summary |
| Expander | expander | /components/expander |
| Fieldset | fieldset | /components/fieldset |
| File upload | file-upload | /components/file-upload |
| Footer | footer | /components/footer |
| Header | header | /components/header |
| Hint text | hint | /components/hint-text |
| Images | image | /components/images |
| Inset text | inset-text | /components/inset-text |
| Notification banners | banner, notification | /components/notification-banners |
| Pagination | pagination-nav, pagination-list, pagination-list-item, pagination-link | /components/pagination |
| Panel | panel | /components/panel |
| Password input | password-input, password-input-or-text-input-div | /components/password-input |
| Radios | radio-input, radio-group | /components/radios |
| Review date | review-date | /components/review-date |
| Select | select | /components/select |
| Skip link | skip-link | /components/skip-link |
| Summary list | summary-list, summary-list-item | /components/summary-list |
| Table | table, table-head, table-body, table-foot, table-col, table-row, table-data | /components/table |
| Tabs | tab-bar, tab-bar-button | /components/tabs |
| Tag | tag, tag-group | /components/tag |
| Task list | task-list, task-list-item | /components/task-list |
| Text input | text-input | /components/text-input |
| Textarea | textarea | /components/textarea |
| Warning callout | warning-callout | /components/warning-callout |

### Phase 2: Original guidance for remaining components (295 components)

Write original "When to Use" and "When Not to Use" guidance based on:
- Component semantics and WAI-ARIA patterns
- Design system best practices
- Related NHS component patterns (as templates)
- Domain knowledge (medical, measurement, layout components)

Group by category for consistency:

| Category | Components | Count |
|---|---|---|
| Accordion | accordion-nav, accordion-list, accordion-list-item, accordion-link | 4 |
| Alert & Dialog | alert, alert-dialog, dialog, popup | 4 |
| Avatar | avatar, avatar-group, avatar-image, avatar-text | 4 |
| Banner & Callout | banner-box, super-banner, medical-banner, medical-banner-box, medical-banner-box-for-danger, medical-banner-box-for-advice, information-callout | 7 |
| Calendar | calendar-table, calendar-table-head, calendar-table-body, calendar-table-foot, calendar-table-col, calendar-table-row, calendar-table-data, calendar-range-picker | 8 |
| Chat | chat-nav, chat-list, chat-list-item, chat-message | 4 |
| Code | code, code-block | 2 |
| Color | color-input, color-picker, color-picker-button | 3 |
| Data Table | data-table, data-table-head, data-table-body, data-table-foot, data-table-col, data-table-row, data-table-data, data-filter-form | 8 |
| Date & Time | date-field, date-range, date-time-now-input, datetime-local-input, time-input, time-picker-input, month-input, week-input | 8 |
| Drawer & Sheet | drawer, slide-out-drawer, sheet, floating-panel | 4 |
| Editable | editable, editable-form | 2 |
| Email & Tel | email-input, email-link, tel-input, tel-link | 4 |
| Emoji | emoji, emoji-character-picker | 2 |
| File | file-dialog, file-input, file-manager, image-file-input | 4 |
| Form | form, field, label, input, hidden-input, reset-input, submit-input | 7 |
| Gantt | gantt-table, gantt-table-head, gantt-table-body, gantt-table-foot, gantt-table-col, gantt-table-row, gantt-table-data | 7 |
| Grail Layout | grail-layout, grail-layout-top-header, grail-layout-left-aside, grail-layout-center-main, grail-layout-right-aside, grail-layout-bottom-footer | 6 |
| Healthcare IDs | espana-tarjeta-sanitaria-individual-input/view, france-numero-d-identification-au-repertoire-input/view, ireland-individual-health-identifier-input/view, northern-ireland-health-and-care-number-input/view, united-kingdom-national-health-service-number-input/view, united-states-social-security-number-input/view | 12 |
| Interactive Controls | switch-button, toggle-button, toggle-group, slider, slider-button, dial, dial-group, range-input, angle-slider-range-input | 9 |
| Kanban | kanban-table, kanban-table-head, kanban-table-body, kanban-table-foot, kanban-table-col, kanban-table-row, kanban-table-data | 7 |
| List Patterns | check-list, check-list-item, timeline-list, timeline-list-item | 4 |
| Media & Visual | image-input, figure, caption, icon, flair, hero, sparkline, qr-code, diff | 9 |
| Measurement | measurement-instance-input/view, measurement-system-input/view, measurement-unit-input/view | 6 |
| Menu | menu, menu-item, menu-bar, menu-bar-button, context-menu, context-menu-item, dropdown-menu, hamburger-menu, navigation-menu | 9 |
| Mockup | mockup-browser, mockup-laptop, mockup-phone, mockup-shell, mockup-tablet-landscape, mockup-tablet-portrait, mockup-watch, mockup-window | 8 |
| Overlay | popover, hover-card, tooltip | 3 |
| Picker & Rating | five-face-rating-picker/picker-button/view, five-star-rating-picker/picker-button/view, net-promoter-score-picker/picker-button/view, red-amber-green-picker/picker-button/view, red-orange-yellow-green-blue-picker/picker-button/view, theme-picker/picker-button/view, theme-select/select-option | 20 |
| Progress | progress, progress-circle, progress-spinner, loading, skeleton, meter | 6 |
| Scroll & Resize | scroll-area, scroll-bar, resizable, splitter | 4 |
| Search & Combo | search-input, text-input-with-search, combobox, listbox, select-with-extras, command | 6 |
| Segment | segment-group, segment-group-item | 2 |
| Semantic | person, organization, place, event, tour, tour-list, tour-list-item | 7 |
| Special Input | currency-input, postal-code-input/view, pin-input-div, number-input, url-input, signature-pad, tag-input | 7 |
| Special Text | ai-label, badge, footnote, citation, digital-object-identifier-link, kbd, screen-reader-span, character | 8 |
| Structural | aspect-ratio-container, collapsible, separator, sidebar, tile | 5 |
| Task & Tool Bar | task-bar, task-bar-button, tool-bar, tool-bar-button | 4 |
| Toast & Notification | toast, sonner | 2 |
| Tree | tree-nav, tree-list, tree-list-item, tree-link, tree-menu | 5 |
| Vital Signs | 32 vital-sign-*-input and vital-sign-*-view components | 32 |
| Other | beach-ball, clipboard-copy-button, care-card, carousel, comment, timer, timer-button, call-to-action | 8 |

### Enhancement per component

For each component `index.md`, update these sections:

1. **"When to Use"** — separate section with 3-5 positive-guidance bullets
   - When this component is the right choice
   - What user needs it serves
   - What contexts it fits

2. **"When Not to Use"** — new separate section with 2-4 bullets
   - When another component is better (name the alternative)
   - Anti-patterns and common misuses
   - Contexts where it doesn't belong

3. **Code example** — improve the Usage section with realistic, real-world examples
   - Show typical usage with realistic content (not "Click me" or "Content")
   - Show composition patterns where applicable
   - Show accessibility attributes in use

### Quality standards

- Lily is headless: guidance must be framework-agnostic
- NHS research informs but doesn't dictate: adapt for headless context
- Always name specific Lily alternatives in "When Not to Use"
- Code examples use semantic HTML with proper ARIA
- No hardcoded user-facing strings in examples; use realistic placeholder content
- Consistent voice across all 332 components

## Acceptance Criteria

- [x] All 332 components documented in canonical list
- [x] CSS style sheet template covers all component class names
- [x] Tools (list-components, test-components, test-implementations) work correctly
- [x] Component naming patterns documented and consistent
- [x] Suffix-to-HTML-element mapping documented and accurate
- [x] Composition patterns documented (Form, Navigation, Table, Grail Layout, VitalSign)
- [x] All subprojects have required files (index.md, README.md symlink, AGENTS.md, CLAUDE.md, plan.md, tasks.md)
- [x] All 332 components have directories with documentation
- [x] All 5 example subprojects have `/components` route listing all components
- [x] All 5 example subprojects have `/components/{slug}` route with live demo for each component
- [x] Component data files include `html` demo field for all 332 components
- [x] Each component demo renders actual headless HTML with NHS CSS styling
- [x] All subprojects harmonized: component count 332, acceptance criteria updated, tasks accurate
- [x] All example subprojects reference AGENTS/examples.md for route requirements
- [x] All 37 NHS-equivalent components enhanced with NHS-researched "When to Use" and "When Not to Use" sections
- [x] All 37 NHS-equivalent components have improved realistic code examples
- [x] All 295 remaining components enhanced with original "When to Use" and "When Not to Use" sections
- [x] All 295 remaining components have improved realistic code examples
- [x] All 332 components have separate "When to Use" and "When Not to Use" sections (not combined)
- [x] All "When Not to Use" sections name specific Lily component alternatives
