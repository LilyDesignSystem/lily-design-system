# Lily Design System - React Next.js Examples

React 19 + Next.js 15 example application demonstrating all 414 components from the [Lily Design System](https://github.com/LilyDesignSystem/lily) headless component library, styled with [NHS UK design system](https://service-manual.nhs.uk/design-system) colors, typography, spacing, and focus states.

## Features

- 414 components imported from the headless library
- 13 interactive example pages demonstrating realistic usage patterns
- NHS UK design system styling via CSS custom properties
- WCAG 2.2 AAA accessibility compliance
- Full keyboard navigation and screen reader support
- Internationalization-ready (no hardcoded strings)
- 67 tests across 20 test files

## Quick Start

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:4140](http://localhost:4140).

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `pnpm run dev`   | Start development server |
| `pnpm run build` | Build for production     |
| `pnpm start`     | Start production server  |
| `pnpm test`      | Run all tests            |

## Project Structure

```
lily-design-system-react-next-examples/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (imports NHS CSS)
│   ├── page.tsx                # Home page with links to examples
│   ├── contact-form/           # Form validation example
│   ├── dashboard/              # Cards, progress, data table
│   ├── dialog-flow/            # Dialogs, drawers, alerts
│   ├── file-upload-form/       # File upload with progress
│   ├── navigation-and-menus/   # Menus, toolbars, hamburger
│   ├── page-layout/            # Header, footer, breadcrumbs
│   ├── rating-and-feedback/    # Star/face/NPS ratings
│   ├── search-and-filter/      # Search, tags, data table
│   ├── settings-page/          # Switches, radios, selects
│   ├── tabbed-interface/       # Tabs, accordion, badges
│   ├── task-management/        # Task list, progress
│   └── timeline-and-cards/     # Timeline, cards, summaries
├── components/                 # 414 wrapper components (re-exports)
├── assets/css/
│   └── nhs.css                 # NHS UK design tokens & component styles
├── tests/
│   ├── components/             # Component unit tests
│   └── pages/                  # Page integration tests
├── package.json
├── next.config.ts
├── tsconfig.json
├── vitest.config.ts
└── vitest-setup.ts
```

## Example Pages

| Page         | Route                   | Components Demonstrated                                                             |
| ------------ | ----------------------- | ----------------------------------------------------------------------------------- |
| Contact Form | `/contact-form`         | Form, Field, TextInput, EmailInput, TextAreaInput, Select, Option, Button, ErrorSummary  |
| Dashboard    | `/dashboard`            | Card, Progress, ProgressCircle, Badge, Banner, DataTable                            |
| Dialog Flow  | `/dialog-flow`          | Dialog, AlertDialog, Drawer, Button, Popover, Tooltip                               |
| File Upload  | `/file-upload-form`     | FileUpload, Progress, Button, Alert, Badge, Form, Field                             |
| Navigation   | `/navigation-and-menus` | NavigationMenu, MenuBar, ToolBar, HamburgerMenu, DropdownMenu, Separator            |
| Page Layout  | `/page-layout`          | SkipLink, Header, Footer, BreadcrumbNav, Sidebar                                    |
| Rating       | `/rating-and-feedback`  | FiveStarRatingPicker, FiveFaceRatingPicker, NetPromoterScorePicker, TextAreaInput, Alert |
| Search       | `/search-and-filter`    | Combobox, SearchInput, TagInput, TagGroup, Tag, DataTable, Badge                    |
| Settings     | `/settings-page`        | SwitchButton, RadioGroup, RadioInput, Select, Fieldset, Separator, Button, Banner   |
| Tabs         | `/tabbed-interface`     | TabBar, TabBarButton, AccordionNav, Badge                                           |
| Tasks        | `/task-management`      | TaskList, TaskListItem, TextInput, CheckboxInput, Button, Badge, Progress           |
| Timeline     | `/timeline-and-cards`   | TimelineList, Card, DateRange, ReviewDate, SummaryList                              |

## Routes

| Route                   | Description                                             |
| ----------------------- | ------------------------------------------------------- |
| `/`                     | Home page with links to all examples                    |
| `/components`           | Lists all 414 components with links to individual demos |
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

Components are imported from the sibling headless library via TypeScript path aliases:

```tsx
// Page imports directly from the headless library
import Button from "@pgds/Button";
import TextInput from "@pgds/TextInput";
import Alert from "@pgds/Alert";
```

The `@pgds/*` alias resolves to `../lily-design-system-react-headless/components/*`.

Wrapper components in `components/` re-export from the headless library for consumers who prefer local imports:

```tsx
// components/Button.tsx
export { default } from "@pgds/Button";
export type * from "@pgds/Button";
```

### simple styling

All visual styling comes from `assets/css/nhs.css`, which provides:

- **Color tokens**: NHS Blues, Neutrals, Support Greens, Highlights as CSS custom properties
- **Typography**: Frutiger W01 font family with 8-point size scale
- **Spacing**: 10-point spacing scale (0-9)
- **Focus states**: Yellow outline (#ffeb3b) with black text for WCAG contrast
- **Component styles**: All 414 component CSS classes with NHS-appropriate styling

Components are headless (unstyled) by default. Each component renders a semantic CSS class (e.g., `button`, `alert`, `badge`) that the NHS stylesheet targets.

### Composition Patterns

**Form pattern: Form > Field > Input**

```tsx
<Form label="Contact" onSubmit={handleSubmit}>
  <Field label="Name" required error={errors.name}>
    <TextInput label="Name" value={name} onChange={setName} />
  </Field>
  <Button type="submit">Submit</Button>
</Form>
```

**Navigation pattern: Nav > List > ListItem**

```tsx
<BreadcrumbNav label="Breadcrumb">
  <BreadcrumbList>
    <BreadcrumbListItem>
      <a href="/">Home</a>
    </BreadcrumbListItem>
    <BreadcrumbListItem current>Page</BreadcrumbListItem>
  </BreadcrumbList>
</BreadcrumbNav>
```

**Table pattern: Table > Head/Body > Row > Data**

```tsx
<DataTable label="Users">
  <DataTableHead>
    <DataTableRow>
      <th>Name</th>
    </DataTableRow>
  </DataTableHead>
  <DataTableBody>
    <DataTableRow>
      <DataTableTD>Alice</DataTableTD>
    </DataTableRow>
  </DataTableBody>
</DataTable>
```

## Testing

Tests use **Vitest** with **React Testing Library** and **jsdom**. Vitest built-in matchers only (no jest-dom).

```bash
pnpm test                        # Run all tests
pnpm exec vitest run tests/pages/     # Run page tests only
pnpm exec vitest run tests/components # Run component tests only
```

## Tech Stack

- **React 19** with TypeScript
- **Next.js 15** App Router
- **Vitest** for testing
- **React Testing Library** for component tests
- **jsdom** for DOM environment

## Related Projects

- [Lily Design System](https://github.com/LilyDesignSystem/lily) - Parent project
- [React Headless](../lily-design-system-react-headless/) - 414 headless React components
- [Blazor Web Examples](../lily-design-system-blazor-web-examples/) - Blazor equivalent
- [Svelte SvelteKit Examples](../lily-design-system-svelte-sveltekit-examples/) - Svelte equivalent
- [Vue Nuxt Examples](../lily-design-system-vue-nuxt-examples/) - Vue equivalent

## NHS UK Design System References

- [NHS UK Design System](https://service-manual.nhs.uk/design-system)
- [NHS Identity Colours](https://www.england.nhs.uk/nhsidentity/identity-guidelines/colours/)
- [NHS Accessibility](https://service-manual.nhs.uk/accessibility/design)

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0, or contact us for more options.

## Contact

Joel Parker Henderson (joel@joelparkerhenderson.com)
