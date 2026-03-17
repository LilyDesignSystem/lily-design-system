# Lily Design System - Svelte SvelteKit Examples

Svelte 5 + SvelteKit 2 example application demonstrating all 332 components from the [Lily Design System](https://github.com/LilyDesignSystem/lily) headless component library, styled with [NHS UK design system](https://service-manual.nhs.uk/design-system) colors, typography, spacing, and focus states.

## Features

- 332 headless Svelte 5 components with runes
- 13 interactive example pages demonstrating realistic usage patterns
- NHS UK design system styling via CSS custom properties
- WCAG 2.2 AAA accessibility compliance
- Full keyboard navigation and screen reader support
- Internationalization-ready (no hardcoded strings)

## Quick Start

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `pnpm run dev`     | Start development server |
| `pnpm run build`   | Build for production     |
| `pnpm run preview` | Preview production build |
| `pnpm test`        | Run all tests            |

## Project Structure

```
lily-design-system-svelte-sveltekit-examples/
├── src/
│   ├── routes/                 # SvelteKit pages
│   │   ├── +layout.svelte      # Root layout (imports NHS CSS)
│   │   ├── +page.svelte        # Home page with links to examples
│   │   ├── contact-form/       # Form validation example
│   │   ├── dashboard/          # Cards, progress, data table
│   │   ├── dialog-flow/        # Dialogs, drawers, alerts
│   │   ├── file-upload-form/   # File upload with progress
│   │   ├── navigation-and-menus/ # Menus, toolbars, hamburger
│   │   ├── page-layout/        # Header, footer, breadcrumbs
│   │   ├── rating-and-feedback/ # Star/face/NPS ratings
│   │   ├── search-and-filter/  # Search, tags, data table
│   │   ├── settings-page/      # Switches, radios, selects
│   │   ├── tabbed-interface/   # Tabs, accordion, badges
│   │   ├── task-management/    # Task list, progress
│   │   └── timeline-and-cards/ # Timeline, cards, summaries
│   └── lib/
│       └── components/         # 332 headless Svelte components
├── static/
│   └── css/nhs.css             # NHS UK design tokens & component styles
├── package.json
├── svelte.config.js
├── vite.config.ts
├── vitest.config.ts
└── tsconfig.json
```

## Example Pages

| Page         | Route                   | Components Demonstrated                                                                                 |
| ------------ | ----------------------- | ------------------------------------------------------------------------------------------------------- |
| Contact Form | `/contact-form`         | Form, Field, TextInput, EmailInput, Textarea, Select, Option, Button, ErrorSummary                      |
| Dashboard    | `/dashboard`            | Card, Progress, ProgressCircle, Badge, Banner, DataTable                                                |
| Dialog Flow  | `/dialog-flow`          | Dialog, AlertDialog, Drawer, Button, Tooltip                                                            |
| File Upload  | `/file-upload-form`     | FileUpload, Progress, Button, Alert, Badge, Form, Field                                                 |
| Navigation   | `/navigation-and-menus` | NavigationMenu, MenuBar, ToolBar, HamburgerMenu, DropdownMenu, Separator                                |
| Page Layout  | `/page-layout`          | SkipLink, Header, Footer, BreadcrumbNav, Sidebar, NavigationMenu                                        |
| Rating       | `/rating-and-feedback`  | FiveStarRatingPicker, FiveStarRatingView, FiveFaceRatingPicker, NetPromoterScorePicker, Textarea, Alert |
| Search       | `/search-and-filter`    | Combobox, SearchInput, TagInput, TagGroup, Tag, DataTable, Badge                                        |
| Settings     | `/settings-page`        | SwitchButton, RadioGroup, RadioInput, Select, Fieldset, Separator, Button, Banner                       |
| Tabs         | `/tabbed-interface`     | TabBar, TabBarButton, AccordionNav, Badge                                                               |
| Tasks        | `/task-management`      | TaskList, TaskListItem, TextInput, CheckboxInput, Button, Badge, Progress                               |
| Timeline     | `/timeline-and-cards`   | TimelineList, Card, DateRange, ReviewDate, SummaryList                                                  |

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

Components live in `src/lib/components/` and are imported into SvelteKit pages. Each is a headless Svelte 5 component using runes (`$props()`, `$state()`, `$derived()`):

```svelte
<script lang="ts">
    let { type = "button", disabled = false, label, children, class: className = "", ...restProps } = $props();
</script>

<button class={`button ${className}`} {type} {disabled} aria-label={label} {...restProps}>
    {@render children()}
</button>
```

### simple styling

All visual styling comes from `static/css/nhs.css`, which provides:

- **Color tokens**: NHS Blues, Neutrals, Support Greens, Highlights as CSS custom properties
- **Typography**: Frutiger W01 font family with 8-point size scale
- **Spacing**: 10-point spacing scale (0-9)
- **Focus states**: Yellow outline (#ffeb3b) with black text for WCAG contrast
- **Component styles**: All 332 component CSS classes with NHS-appropriate styling

Components are headless (unstyled) by default. Each component renders a semantic CSS class (e.g., `button`, `alert`, `badge`) that the NHS stylesheet targets.

### Composition Patterns

**Form pattern: Form > Field > Input**

```svelte
<Form label="Contact" onsubmit={handleSubmit}>
  <Field label="Name" required error={errors.name}>
    <TextInput label="Name" bind:value={name} />
  </Field>
  <Button type="submit">Submit</Button>
</Form>
```

**Navigation pattern: Nav > List > ListItem**

```svelte
<BreadcrumbNav label="Breadcrumb">
  <BreadcrumbList>
    <BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
    <BreadcrumbListItem current>Page</BreadcrumbListItem>
  </BreadcrumbList>
</BreadcrumbNav>
```

**Table pattern: Table > Head/Body > Row > Data**

```svelte
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

Tests use **Vitest** with **Svelte Testing Library** and **jsdom**. Vitest built-in matchers only (no jest-dom).

```bash
pnpm test                        # Run all tests
pnpm exec vitest run src/             # Run all tests
```

## Tech Stack

- **Svelte 5** with runes and TypeScript
- **SvelteKit 2** for file-based routing
- **Vitest** for testing
- **Svelte Testing Library** for component tests
- **jsdom** for DOM environment

## Related Projects

- [Lily Design System](https://github.com/LilyDesignSystem/lily) — Parent project
- [Svelte Headless](../lily-design-system-svelte-headless/) — 332 headless Svelte components
- [Blazor Web Examples](../lily-design-system-blazor-web-examples/) — Blazor equivalent
- [React Next.js Examples](../lily-design-system-react-next-examples/) — React equivalent
- [Vue Nuxt Examples](../lily-design-system-vue-nuxt-examples/) — Vue equivalent

## NHS UK Design System References

- [NHS UK Design System](https://service-manual.nhs.uk/design-system)
- [NHS Identity Colours](https://www.england.nhs.uk/nhsidentity/identity-guidelines/colours/)
- [NHS Accessibility](https://service-manual.nhs.uk/accessibility/design)

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0, or contact us for more options.

## Contact

Joel Parker Henderson (joel@joelparkerhenderson.com)
