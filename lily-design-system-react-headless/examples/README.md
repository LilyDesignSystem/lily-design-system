# Examples

Comprehensive standalone examples showing how to compose components from the Lily Design System React Headless library.

## Quick Reference

| Example                                      | Description                                    | Key Components                                                                                         |
| -------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [ContactForm](ContactForm.tsx)               | Form with validation and error summary         | Form, Field, TextInput, EmailInput, TextAreaInput, Select, ErrorSummary                                     |
| [SettingsPage](SettingsPage.tsx)             | Settings with toggles, radios, and selects     | SwitchButton, RadioGroup, RadioInput, Select, Fieldset, Banner                                         |
| [Dashboard](Dashboard.tsx)                   | Dashboard with cards, progress, and data table | Card, Progress, ProgressCircle, Badge, Banner, DataTable                                               |
| [PageLayout](PageLayout.tsx)                 | Accessible page layout with skip link and nav  | SkipLink, Header, Footer, NavigationMenu, BreadcrumbNav, Sidebar                                       |
| [TabbedInterface](TabbedInterface.tsx)       | Tabs with accordion content                    | TabBar, TabBarButton, AccordionNav, Badge                                                              |
| [DialogFlow](DialogFlow.tsx)                 | Dialogs, alerts, drawers, and overlays         | Dialog, AlertDialog, Drawer, Popover, Tooltip                                                          |
| [RatingAndFeedback](RatingAndFeedback.tsx)   | Star, face, and NPS rating collection          | FiveStarRatingPicker, FiveFaceRatingPicker, NetPromoterScorePicker                                     |
| [FileUploadForm](FileUploadForm.tsx)         | File upload with progress feedback             | FileUpload, Progress, Badge, Form, Field                                                               |
| [TaskManagement](TaskManagement.tsx)         | Task/todo list with progress tracking          | TaskList, TaskListItem, TextInput, CheckboxInput, Button, Badge, Progress                              |
| [NavigationAndMenus](NavigationAndMenus.tsx) | Navigation, menus, and toolbars                | NavigationMenu, MenuBar, MenuBarButton, ToolBar, ToolBarButton, HamburgerMenu, DropdownMenu, Separator |
| [TimelineAndCards](TimelineAndCards.tsx)     | Project timeline with info cards               | TimelineList, TimelineListItem, Card, Badge, DateRange, ReviewDate, SummaryList, SummaryListItem       |
| [SearchAndFilter](SearchAndFilter.tsx)       | Search with combobox and data filtering        | Combobox, SearchInput, TagInput, TagGroup, Tag, DataTable, DataTableHead/Body/Row/Data, Badge          |

## Running Examples

These examples are standalone React components. To use them:

1. Import the example into your React application
2. Render it as a component
3. Add your own CSS styling (components are headless)

```tsx
import ContactForm from "./examples/ContactForm";

function App() {
  return <ContactForm />;
}
```

## Styling

All components are headless and render semantic CSS classes. Style them with any approach:

- **Tailwind CSS**: Add utility classes via `className` prop
- **CSS Modules**: Import `.module.css` files and pass class names
- **Plain CSS**: Target the built-in semantic class names (e.g., `.button`, `.alert`, `.dialog`)
- **CSS-in-JS**: Use styled-components, emotion, or similar libraries

## Patterns Demonstrated

### Forms and Validation

- Controlled inputs with `value` + `onChange`
- Error summary with linked error messages
- Field-level validation with error display
- Form submission handling

### Navigation

- Skip links for keyboard accessibility
- Breadcrumb trails with `aria-current`
- Responsive navigation with hamburger menu
- Tabbed interfaces with `controls` linking

### Data Display

- Data tables with sortable columns
- Progress indicators (linear and circular)
- Status badges with semantic types
- Timeline/chronological views

### Overlays and Dialogs

- Modal confirmation dialogs
- Alert dialogs for critical messages
- Side drawers for supplementary content
- Tooltips and popovers

### Ratings and Feedback

- Star rating (1-5)
- Face satisfaction rating (1-5)
- Net Promoter Score (0-10)
- Comment/feedback text-area-input
