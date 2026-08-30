# Lily Design System - HTML CSS JS Examples

@AGENTS/lily.md
@AGENTS/components.md
@AGENTS/accessibility.md
@AGENTS/internationalization.md
@AGENTS/examples.md
@AGENTS/theme.md
@AGENTS/nhs-uk-design-system-references.md

## Metadata

- **Package**: lily-design-system-html-css-js-examples
- **Version**: 0.2.0
- **Created**: 2026-03-08
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

Styled example pages demonstrating headless components with Plain HTML + vanilla JavaScript, styled with NHS UK design system colors, typography, spacing, and focus states.

## IMPORTANT Architecture

- Plain HTML + vanilla JavaScript
- No frameworks (no React, no Svelte, no Vue, no Angular, no Blazor)
- No TypeScript (plain JavaScript only)
- No build tools required
- Component styling from the runtime theme stylesheet (a managed `<link data-lily-theme-picker>` the theme-picker helper swaps among `/themes/*.css`, default NHS England for patients); `assets/css/app-shell.css` keeps only the fixed app-shell chrome that no theme should style

## Project Structure

```
lily-design-system-html-css-js-examples/
├── pages/
│   ├── contact-form/
│   ├── dashboard/
│   ├── dialog-flow/
│   ├── file-upload-form/
│   ├── navigation-and-menus/
│   ├── page-layout/
│   ├── rating-and-feedback/
│   ├── search-and-filter/
│   ├── settings-page/
│   ├── tabbed-interface/
│   ├── task-management/
│   └── timeline-and-cards/
├── css/
│   └── app-shell.css (component styling comes from the runtime theme)
└── package.json
```

## Example Pages

| Page         | Key Components                                                     |
| ------------ | ------------------------------------------------------------------ |
| Book an Appointment | StepList, RadioGroup, DateInput, Select, SummaryList, ErrorSummary, SuccessPanel — flagship 5-step wizard, see [docs/patterns/book-an-appointment.md](../docs/patterns/book-an-appointment.md) |
| Contact Form | Form, Field, TextInput, EmailInput, TextAreaInput, Select, Button       |
| Dashboard    | Card, Progress, ProgressCircle, Badge, Banner, DataTable           |
| Dialog Flow  | Dialog, AlertDialog, Drawer, Button, Tooltip                       |
| File Upload  | FileUpload, Progress, Button, Alert, Badge, Form, Field            |
| Navigation   | NavigationMenu, MenuBar, ToolBar, HamburgerMenu, DropdownMenu      |
| Page Layout  | Header, Footer, BreadcrumbNav, Sidebar, NavigationMenu             |
| Rating       | FiveStarRatingPicker, FiveFaceRatingPicker, NetPromoterScorePicker |
| RTL Demo     | BreadcrumbNav, DataTable, PaginationNav, Form, RadioGroup, CheckboxInput — dir="rtl" + Arabic content, see [docs/patterns](../docs/patterns) and `e2e/rtl-demo.spec.ts` |
| Search       | Combobox, SearchInput, TagInput, TagGroup, Tag, DataTable, Badge   |
| Settings     | SwitchButton, RadioGroup, RadioInput, Select, Fieldset, Banner     |
| Tabs         | TabBar, TabBarButton, AccordionNav, Badge                          |
| Tasks        | TaskList, TaskListItem, TextInput, CheckboxInput, Badge, Progress  |
| Timeline     | TimelineList, Card, DateRange, ReviewDate, SummaryList             |

## Internationalization

- All text content through HTML attributes — no hardcoded strings
- Labels, descriptions, error messages all configurable
- Consumer provides localized text
