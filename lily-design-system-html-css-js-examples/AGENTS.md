# Lily Design System - HTML JavaScript Examples

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
- No frameworks (no React, no Svelte, no Vue, no Angular)
- No TypeScript (plain JavaScript only)
- No build tools required
- NHS UK CSS via css/nhs.css for styling

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
│   └── nhs.css
└── package.json
```

## Example Pages

| Page         | Key Components                                                     |
| ------------ | ------------------------------------------------------------------ |
| Contact Form | Form, Field, TextInput, EmailInput, Textarea, Select, Button       |
| Dashboard    | Card, Progress, ProgressCircle, Badge, Banner, DataTable           |
| Dialog Flow  | Dialog, AlertDialog, Drawer, Button, Tooltip                       |
| File Upload  | FileUpload, Progress, Button, Alert, Badge, Form, Field            |
| Navigation   | NavigationMenu, MenuBar, ToolBar, HamburgerMenu, DropdownMenu      |
| Page Layout  | Header, Footer, BreadcrumbNav, Sidebar, NavigationMenu             |
| Rating       | FiveStarRatingPicker, FiveFaceRatingPicker, NetPromoterScorePicker |
| Search       | Combobox, SearchInput, TagInput, TagGroup, Tag, DataTable, Badge   |
| Settings     | SwitchButton, RadioGroup, RadioInput, Select, Fieldset, Banner     |
| Tabs         | TabBar, TabBarButton, AccordionNav, Badge                          |
| Tasks        | TaskList, TaskListItem, TextInput, CheckboxInput, Badge, Progress  |
| Timeline     | TimelineList, Card, DateRange, ReviewDate, SummaryList             |

## Internationalization

- All text content through HTML attributes — no hardcoded strings
- Labels, descriptions, error messages all configurable
- Consumer provides localized text
