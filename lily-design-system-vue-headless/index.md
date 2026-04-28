# Lily Design System - Vue Headless

A headless Vue 3 component library with 414 components. All components are headless (no built-in styles), fully accessible (WCAG 2.2 AAA), and use Vue 3 Composition API with `<script setup lang="ts">`.

## Features

- 414 headless Vue components
- TypeScript with full type definitions
- WCAG 2.2 AAA accessibility compliance
- Full keyboard navigation support
- ARIA attributes and roles
- Internationalization-ready (no hardcoded strings)
- Zero dependencies beyond Vue
- Works with any CSS framework or custom styles

## Quick Start

### Install

```bash
pnpm install lily-design-system-vue-headless
```

### Peer Dependencies

```json
{
  "vue": "^3.0.0"
}
```

### Basic Usage

```vue
<script setup lang="ts">
import { ref } from "vue";
import Button from "lily-design-system-vue-headless/components/Button.vue";
import TextInput from "lily-design-system-vue-headless/components/TextInput.vue";
import Alert from "lily-design-system-vue-headless/components/Alert.vue";

const name = ref("");
</script>

<template>
  <TextInput
    label="Your name"
    v-model="name"
    placeholder="Enter your name"
  />
  <Button @click="alert(`Hello, ${name}!`)">Greet</Button>
  <Alert
    v-if="name"
    type="success"
    heading="Greeting"
  >
    Welcome, {{ name }}!
  </Alert>
</template>
```

## Architecture

### Headless Design

Components provide:

- Semantic HTML structure
- ARIA attributes for accessibility
- Props and events for behavior
- Keyboard interaction patterns

Components do NOT provide:

- CSS styles or stylesheets
- Visual styling or themes
- Tailwind classes
- Any built-in appearance

### Component File Structure

Each component consists of three files:

```
components/
  Button.vue         # Component implementation
  Button.test.ts     # Tests (Vue Testing Library + Vitest)
  Button.md          # Documentation
```

### Vue Component Conventions

- `<script setup lang="ts">` syntax for all components
- `defineProps<{}>()` with `withDefaults()` for prop definitions
- `defineModel()` for two-way bindable props (v-model)
- `computed()` for derived values
- Headless: no CSS embedded, uses CSS class names matching kebab-case component name
- `v-bind="$attrs"` for pass-through attributes

### CSS Class Convention

Every component's root element includes a semantic CSS class matching its kebab-case name:

```vue
<Button class="my-custom">Click</Button>
<!-- Renders: <button class="button my-custom">Click</button> -->
```

### Naming Conventions

Component names follow a suffix-based pattern that indicates the root HTML element:

| Suffix    | HTML Element | Example                                      |
| --------- | ------------ | -------------------------------------------- |
| Button    | `<button>`   | `Button`, `ToggleButton`                     |
| Input     | `<input>`    | `TextInput`, `DateInput`                     |
| Select    | `<select>`   | `Select`, `ThemeSelect`                      |
| Dialog    | `<dialog>`   | `Dialog`, `AlertDialog`                      |
| Nav       | `<nav>`      | `BreadcrumbNav`, `TreeNav`                   |
| List      | `<ol>`       | `CheckList`, `TaskList`                      |
| ListItem  | `<li>`       | `CheckListItem`, `TaskListItem`              |
| Table     | `<table>`    | `DataTable`, `CalendarTable`                 |
| TableHead | `<thead>`    | `DataTableHead`                              |
| TableBody | `<tbody>`    | `DataTableBody`                              |
| TableFoot | `<tfoot>`    | `DataTableFoot`                              |
| TableCol  | `<col>`      | `DataTableCol`, `CalendarTableCol`           |
| TableRow  | `<tr>`       | `DataTableRow`                               |
| TableData | `<td>`       | `DataTableData`                              |
| Div       | `<div>`      | `PinInputDiv`, `PasswordInputOrTextInputDiv` |
| Fieldset  | `<fieldset>` | `Fieldset`                                   |
| Figure    | `<figure>`   | `Figure`                                     |
| Footer    | `<footer>`   | `Footer`                                     |
| Header    | `<header>`   | `Header`                                     |
| Kbd       | `<kbd>`      | `Kbd`                                        |
| Meter     | `<meter>`    | `Meter`                                      |
| Option    | `<option>`   | `Option`, `ThemeSelectOption`                |
| Picker    | `<div>`      | `ColorPicker`, `FiveStarRatingPicker`        |
| Progress  | `<progress>` | `Progress`                                   |
| Span      | `<span>`     | `Flair`, `Character`                         |

## Components

- **accordion**:
  - **accordion-nav**: a navigation container for collapsible accordion information
  - **accordion-list**: an ordered list of accordion list item components
  - **accordion-list-item**: one accordion list item component
  - **accordion-link**: one accordion link in the trail
- **action-link**: a hyperlink styled as an action trigger
- **ai-label**: an indicator of AI instances that is a pathway to AI explainability
- **alert-dialog**: a modal dialog for urgent messages requiring user acknowledgment
- **alert**: a status message for important information or feedback
- **angle-slider-range-input**: a range input for selecting an angle in degrees
- **aspect-ratio-container**: a container that maintains a fixed aspect ratio
- **avatar**:
  - **avatar**: an avatar indicator that shows an avatar image or avatar text
  - **avatar-image**: an avatar indicator inside image such as a user photo
  - **avatar-text**: an avatar indicator inner text such as a user name
- **back-link**: a navigation link to return to a previous page
- **badge**: a small label for counts, statuses, or categories
- **banner**: a prominent message bar across the top of a page
- **banner-box**: a banner box that is inside a banner component, using flexbox horizontal
- **beach-ball**: a decorative animated beach ball element
- **breadcrumb**:
  - **breadcrumb-nav**: a navigation container for breadcrumb trail links
  - **breadcrumb-list**: an ordered list of breadcrumb navigation items
  - **breadcrumb-list-item**: one breadcrumb navigation link in the trail
  - **breadcrumb-link**: one breadcrumb link in the trail
- **button**: a generic clickable button element
- **button-input**: an input element of type button for form actions
- **calendar-table**:
  - **calendar-table**: a calendar table interactive grid for managing dates, days, etc.
  - **calendar-table-head**: a calendar table interactive grid thead for managing dates, days, etc.
  - **calendar-table-body**: a calendar table interactive grid tbody for managing dates, days, etc.
  - **calendar-table-foot**: a calendar table interactive grid tfoot for managing dates, days, etc.
  - **calendar-table-col**: a calendar table interactive grid column for managing dates, days, etc.
  - **calendar-table-row**: a calendar table interactive grid row for managing dates, days, etc.
  - **calendar-table-data**: a calendar table interactive grid data cell for managing dates, days, etc.
- ...and 200+ more components

See the [parent project](https://github.com/LilyDesignSystem/lily) for the full component list.

## Component Name Patterns

- \*Bar \*BarButton: MenuBar MenuBarButton, TabBar TabBarButton, TaskBar TaskBarButton, ToolBar ToolBarButton
- \*Group \*GroupItem: SegmentGroup SegmentGroupItem
- \*Guide \*GuideList \*GuideListItem: Tour TourList TourListItem
- \*Input \*Link: TelInput TelLink, EmailInput EmailLink
- \*List \*ListItem: CheckList, ContentsList, DoList, DontList, PaginationList, SummaryList, TaskList, TimelineList
- \*Menu \*MenuItem: ContextMenu ContextMenuItem, Menu MenuItem
- \*Nav \*List \*ListItem: AccordionNav, BreadcrumbNav, ContentsNav, PaginationNav, TreeNav TreeList TreeListItem
- \*Picker \*PickerButton: ColorPicker, FiveFaceRatingPicker, FiveStarRatingPicker, NetPromoterScorePicker, RedAmberGreenPicker, RedOrangeYellowGreenBluePicker
- \*Select \*SelectOption: ThemeSelect ThemeSelectOption
- \*Table \*TableHead \*TableBody \*TableFoot \*TableCol \*TableRow \*TableData: CalendarTable, DataTable, GanttTable, KanbanTable, Table

## Testing

Vitest + Vue Testing Library for component testing. No @testing-library/jest-dom.

```sh
pnpm test          # run all tests
pnpm run test:ui   # open vitest UI
pnpm run test:watch # watch mode
```

## Accessibility

All components follow WCAG 2.2 AAA guidelines:

- **Semantic HTML**: Proper element usage (`<button>`, `<nav>`, `<dialog>`, etc.)
- **ARIA attributes**: Roles, labels, states, and properties
- **Keyboard navigation**: Full keyboard support for all interactive components
- **Screen readers**: Proper announcements via aria-live, role="alert", etc.
- **Focus management**: Logical focus order and visible focus indicators
- **Error handling**: Accessible error messages linked via aria-errormessage

## Internationalization

No strings are hardcoded in any component. All user-facing text comes through props.

## Related Projects

- [Lily Design System](https://github.com/LilyDesignSystem/lily) — Parent project
- [Vue Nuxt Examples](../lily-design-system-vue-nuxt-examples/) — Example app with simple styling
- [Svelte Headless](../lily-design-system-svelte-headless/) — Svelte equivalent
- [React Headless](../lily-design-system-react-headless/) — React equivalent
- [Blazor Headless](../lily-design-system-blazor-headless/) — Blazor equivalent

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0, or contact us for more options.

## Contact

Joel Parker Henderson (joel@joelparkerhenderson.com)
