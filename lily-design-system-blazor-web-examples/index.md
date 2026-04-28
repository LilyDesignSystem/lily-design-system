# Lily Design System - Blazor Web Examples

Blazor Web App (.NET 10) example application demonstrating headless components from the [Lily Design System](https://github.com/LilyDesignSystem/lily) Blazor headless component library, styled with [NHS UK design system](https://service-manual.nhs.uk/design-system) colors, typography, spacing, and focus states.

## Features

- Headless components imported from the Blazor headless library via ProjectReference
- 13 interactive example pages demonstrating realistic usage patterns
- NHS UK design system styling via CSS custom properties
- WCAG 2.2 AAA accessibility compliance
- Full keyboard navigation and screen reader support
- Internationalization-ready (no hardcoded strings)
- Interactive Server rendering with SignalR

## Quick Start

```bash
dotnet run --project src/LilyBlazorWebExamples
```

Open [https://localhost:5001](https://localhost:5001).

## Commands

| Command                                          | Description              |
| ------------------------------------------------ | ------------------------ |
| `dotnet build`                                   | Build the project        |
| `dotnet run --project src/LilyBlazorWebExamples` | Start development server |
| `dotnet publish -c Release`                      | Publish for production   |

## Project Structure

```
lily-design-system-blazor-web-examples/
├── LilyBlazorWebExamples.slnx
├── src/LilyBlazorWebExamples/
│   ├── LilyBlazorWebExamples.csproj
│   ├── Program.cs
│   ├── _Imports.razor
│   ├── Components/
│   │   ├── App.razor              # Root HTML document
│   │   ├── Routes.razor           # Router configuration
│   │   ├── Layout/
│   │   │   └── MainLayout.razor   # Shared layout with SkipLink
│   │   └── Pages/
│   │       ├── Home.razor                # Links to all examples
│   │       ├── ContactForm.razor         # Form validation
│   │       ├── Dashboard.razor           # Cards, progress, data table
│   │       ├── DialogFlow.razor          # Dialogs, drawers, tooltips
│   │       ├── FileUploadForm.razor      # File upload with progress
│   │       ├── NavigationAndMenus.razor  # Menus, toolbars, hamburger
│   │       ├── PageLayout.razor          # Header, footer, breadcrumbs
│   │       ├── RatingAndFeedback.razor   # Star/face/NPS ratings
│   │       ├── SearchAndFilter.razor     # Search, tags, data table
│   │       ├── SettingsPage.razor        # Switches, radios, selects
│   │       ├── TabbedInterface.razor     # Tabs, accordion, badges
│   │       ├── TaskManagement.razor      # Task list, progress
│   │       └── TimelineAndCards.razor    # Timeline, cards, summaries
│   └── wwwroot/
│       ├── css/nhs.css            # NHS UK design tokens & styles
│       └── js/headless-interop.js # Keyboard navigation helpers
```

## Example Pages

| Page         | Route                   | Components Demonstrated                                                                          |
| ------------ | ----------------------- | ------------------------------------------------------------------------------------------------ |
| Contact Form | `/contact-form`         | Form, Field, TextInput, EmailInput, Textarea, Select, Option, Button, ErrorSummary               |
| Dashboard    | `/dashboard`            | Card, Progress, ProgressCircle, Badge, Banner, DataTable                                         |
| Dialog Flow  | `/dialog-flow`          | Dialog, AlertDialog, Drawer, Tooltip, Button                                                     |
| File Upload  | `/file-upload-form`     | FileUpload, Progress, Button, Alert, Badge, Form, Field                                          |
| Navigation   | `/navigation-and-menus` | NavigationMenu, MenuBar, ToolBar, HamburgerMenu, DropdownMenu, Separator                         |
| Page Layout  | `/page-layout`          | Header, Footer, BreadcrumbNav, Sidebar, NavigationMenu                                           |
| Rating       | `/rating-and-feedback`  | FiveStarRatingPicker, FiveStarRatingView, FiveFaceRatingPicker, NetPromoterScorePicker, Textarea |
| Search       | `/search-and-filter`    | Combobox, SearchInput, TextInput, TagGroup, Tag, DataTable, Badge                                |
| Settings     | `/settings-page`        | SwitchButton, RadioGroup, RadioInput, Select, Fieldset, Separator, Button, Banner                |
| Tabs         | `/tabbed-interface`     | TabBar, TabBarButton, AccordionNav, AccordionList, AccordionListItem, Badge                      |
| Tasks        | `/task-management`      | TaskList, TaskListItem, TextInput, CheckboxInput, Button, Badge, Progress                        |
| Timeline     | `/timeline-and-cards`   | TimelineList, TimelineListItem, Card, DateRange, ReviewDate, SummaryList, SummaryListItem, Badge |

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

Components are imported from the sibling headless library via ProjectReference:

```xml
<ProjectReference Include="../../../lily-design-system-blazor-headless/..." />
```

Usage in Razor pages:

```razor
@using LilyBlazorHeadless.Components

<Form Label="Contact" OnSubmit="HandleSubmit">
    <Field Label="Name" Required="true" Error="@GetError("name")">
        <TextInput Label="Name" Value="@name" ValueChanged="v => name = v" Required="true" />
    </Field>
    <Button Type="submit">Submit</Button>
</Form>
```

### simple styling

All visual styling comes from `wwwroot/css/nhs.css`, which provides:

- **Color tokens**: NHS Blues, Neutrals, Support Greens, Highlights as CSS custom properties
- **Typography**: Frutiger W01 font family with 8-point size scale
- **Spacing**: 10-point spacing scale (0-9)
- **Focus states**: Yellow outline (#ffeb3b) with black text for WCAG contrast
- **Component styles**: Component CSS classes with NHS-appropriate styling

Components are headless (unstyled) by default. Each component renders a semantic CSS class (e.g., `button`, `alert`, `badge`) that the NHS stylesheet targets.

### Blazor Patterns

| Pattern               | Example                                                                       |
| --------------------- | ----------------------------------------------------------------------------- |
| Two-way binding       | `@bind-Value`, `@bind-Checked`, `@bind-Open` or manual `Value`/`ValueChanged` |
| Events                | `OnSubmit` (Form), `@onclick` (Button)                                        |
| Conditional rendering | `@if (condition) { <Component /> }`                                           |
| Lists                 | `@foreach (var item in items) { <Component /> }`                              |
| Async state update    | `await Task.Delay(ms); StateHasChanged();`                                    |

## Tech Stack

- **.NET 10.0** with C#
- **Blazor Web App** with Interactive Server rendering
- **SignalR** for real-time UI updates

## Related Projects

- [Lily Design System](https://github.com/LilyDesignSystem/lily) - Parent project
- [Blazor Headless](../lily-design-system-blazor-headless/) - Blazor headless components
- [React Next.js Examples](../lily-design-system-react-next-examples/) - React equivalent
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
