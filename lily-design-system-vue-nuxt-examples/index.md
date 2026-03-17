# Lily Design System - Vue Nuxt.js Examples

Vue 3 + Nuxt 3 example application demonstrating all 332 components from the [Lily Design System](https://github.com/LilyDesignSystem/lily) headless component library, styled with [NHS UK design system](https://service-manual.nhs.uk/design-system) colors, typography, spacing, and focus states.

## Features

- 332 headless Vue components with `<script setup lang="ts">` syntax
- 13 interactive example pages demonstrating realistic usage patterns
- NHS UK design system styling via CSS custom properties
- WCAG 2.2 AAA accessibility compliance
- Full keyboard navigation and screen reader support
- Internationalization-ready (no hardcoded strings)
- 1342 tests across 332 test files

## Quick Start

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3320](http://localhost:3320).

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `pnpm run dev`   | Start development server |
| `pnpm run build` | Build for production     |
| `pnpm start`     | Start production server  |
| `pnpm test`      | Run all tests            |

## Project Structure

```
lily-design-system-vue-nuxt-examples/
├── app.vue                     # Root layout
├── nuxt.config.ts              # Nuxt configuration (imports NHS CSS)
├── components/                 # 332 headless Vue components
│   ├── AccordionNav.vue
│   ├── Alert.vue
│   ├── Button.vue
│   └── ... (332 total)
├── pages/                      # Nuxt pages (example compositions)
│   ├── index.vue               # Home page with links to all examples
│   ├── contact-form.vue        # Form validation example
│   ├── dashboard.vue           # Cards, progress, data table
│   ├── dialog-flow.vue         # Dialogs, drawers, alerts
│   ├── file-upload-form.vue    # File upload with progress
│   ├── navigation-and-menus.vue # Menus, toolbars, hamburger
│   ├── page-layout.vue         # Header, footer, breadcrumbs
│   ├── rating-and-feedback.vue # Star/face/NPS ratings
│   ├── search-and-filter.vue   # Search, tags, data table
│   ├── settings-page.vue       # Switches, radios, selects
│   ├── tabbed-interface.vue    # Tabs, accordion, badges
│   ├── task-management.vue     # Task list, progress
│   └── timeline-and-cards.vue  # Timeline, cards, summaries
├── assets/css/
│   └── nhs.css                 # NHS UK design tokens & component styles
├── tests/components/           # 332 component test files
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── vitest-setup.ts
```

## Example Pages

| Page         | Route                   | Components Demonstrated                                                                                 |
| ------------ | ----------------------- | ------------------------------------------------------------------------------------------------------- |
| Contact Form | `/contact-form`         | Form, Field, TextInput, EmailInput, Textarea, Select, Option, Button, ErrorSummary                      |
| Dashboard    | `/dashboard`            | Card, Progress, ProgressCircle, Badge, Banner, DataTable                                                |
| Dialog Flow  | `/dialog-flow`          | Dialog, AlertDialog, Drawer, Button, Tooltip                                                            |
| File Upload  | `/file-upload-form`     | FileUpload, FileInput, Progress, Button, Alert, Badge, Form, Field                                      |
| Navigation   | `/navigation-and-menus` | NavigationMenu, MenuBar, ToolBar, HamburgerMenu, DropdownMenu, Separator                                |
| Page Layout  | `/page-layout`          | SkipLink, Header, Footer, BreadcrumbNav, Sidebar, NavigationMenu                                        |
| Rating       | `/rating-and-feedback`  | FiveStarRatingPicker, FiveStarRatingView, FiveFaceRatingPicker, NetPromoterScorePicker, Textarea, Alert |
| Search       | `/search-and-filter`    | Combobox, SearchInput, TagInput, TagGroup, Tag, DataTable, Badge                                        |
| Settings     | `/settings-page`        | SwitchButton, RadioGroup, RadioInput, Select, Fieldset, Separator, Button, Banner                       |
| Tabs         | `/tabbed-interface`     | TabBar, TabBarButton, AccordionNav, Badge                                                               |
| Tasks        | `/task-management`      | TaskList, TaskListItem, TextInput, CheckboxInput, Button, Badge, Progress                               |
| Timeline     | `/timeline-and-cards`   | TimelineList, Card, DateRange, DateInput, ReviewDate, SummaryList, Field                                |

## Routes

| Route                   | Description                                             |
| ----------------------- | ------------------------------------------------------- |
| `/`                     | Home page with links to all examples                    |
| `/components`           | Lists all 332 components with links to individual demos |
| `/components/{slug}`    | Demonstrates one component with a live interactive demo |
| `/contact-form`         | Contact form example page                               |
| `/dashboard`            | Dashboard example page                                  |
| `/dialog-flow`          | Dialog flow example page                                |
| `/file-upload-form`     | File upload example page                                |
| `/navigation-and-menus` | Navigation example page                                 |
| `/page-layout`          | Page layout example page                                |
| `/rating-and-feedback`  | Rating example page                                     |
| `/search-and-filter`    | Search example page                                     |
| `/settings-page`        | Settings example page                                   |
| `/tabbed-interface`     | Tabbed interface example page                           |
| `/task-management`      | Task management example page                            |
| `/timeline-and-cards`   | Timeline example page                                   |

## Architecture

### Component Integration

Components live in the `components/` directory and are auto-imported by Nuxt. Each is a headless Vue 3 Single File Component using `<script setup lang="ts">`:

```vue
<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    pressed?: boolean;
    label?: string;
  }>(),
  {
    type: "button",
    disabled: false,
    pressed: undefined,
    label: undefined,
  },
);
</script>

<template>
  <button
    class="button"
    :type="type"
    :disabled="disabled"
    :aria-pressed="pressed"
    :aria-label="label"
  >
    <slot />
  </button>
</template>
```

### simple styling

All visual styling comes from `assets/css/nhs.css`, which provides:

- **Color tokens**: NHS Blues, Neutrals, Support Greens, Highlights as CSS custom properties
- **Typography**: Frutiger W01 font family with 8-point size scale
- **Spacing**: 10-point spacing scale (0-9)
- **Focus states**: Yellow outline (#ffeb3b) with black text for WCAG contrast
- **Component styles**: All 332 component CSS classes with NHS-appropriate styling

Components are headless (unstyled) by default. Each component renders a semantic CSS class (e.g., `button`, `alert`, `badge`) that the NHS stylesheet targets.

### Composition Patterns

**Form pattern: Form > Field > Input**

```vue
<Form label="Contact" @submit="handleSubmit">
  <Field label="Name" required :error="errors.name">
    <TextInput label="Name" v-model="name" />
  </Field>
  <Button type="submit">Submit</Button>
</Form>
```

**Navigation pattern: Nav > List > ListItem**

```vue
<BreadcrumbNav label="Breadcrumb">
  <BreadcrumbList>
    <BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
    <BreadcrumbListItem current>Page</BreadcrumbListItem>
  </BreadcrumbList>
</BreadcrumbNav>
```

**Table pattern: Table > Head/Body > Row > Data**

```vue
<DataTable label="Users">
  <DataTableHead>
    <DataTableRow><th>Name</th></DataTableRow>
  </DataTableHead>
  <DataTableBody>
    <DataTableRow><DataTableData>Alice</DataTableData></DataTableRow>
  </DataTableBody>
</DataTable>
```

## Testing

Tests use **Vitest** with **Vue Testing Library** and **jsdom**. Vitest built-in matchers only (no jest-dom).

```bash
pnpm test                                  # Run all tests
pnpm exec vitest run tests/components/          # Run component tests
pnpm exec vitest run tests/components/Button    # Run a specific test
```

## Tech Stack

- **Vue 3** with Composition API and TypeScript
- **Nuxt 3** for file-based routing and auto-imports
- **Vitest** for testing
- **Vue Testing Library** for component tests
- **jsdom** for DOM environment

## Related Projects

- [Lily Design System](https://github.com/LilyDesignSystem/lily) — Parent project
- [Vue Headless](../lily-design-system-vue-headless/) — 332 headless Vue components
- [Blazor Web Examples](../lily-design-system-blazor-web-examples/) — Blazor equivalent
- [React Next.js Examples](../lily-design-system-react-next-examples/) — React equivalent
- [Svelte SvelteKit Examples](../lily-design-system-svelte-sveltekit-examples/) — Svelte equivalent

## NHS UK Design System References

- [NHS UK Design System](https://service-manual.nhs.uk/design-system)
- [NHS Identity Colours](https://www.england.nhs.uk/nhsidentity/identity-guidelines/colours/)
- [NHS Accessibility](https://service-manual.nhs.uk/accessibility/design)

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0, or contact us for more options.

## Contact

Joel Parker Henderson (joel@joelparkerhenderson.com)
