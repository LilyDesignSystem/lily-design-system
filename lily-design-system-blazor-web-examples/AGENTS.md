# Lily Design System - Blazor Web Examples

Blazor Web App examples of the Lily Design System Blazor headless component library, styled with NHS UK design system colors, typography, spacing, and focus states.

@AGENTS/lily.md
@AGENTS/components.md
@AGENTS/accessibility.md
@AGENTS/internationalization.md
@AGENTS/examples.md
@AGENTS/theme.md
@AGENTS/nhs-uk-design-system-references.md

## Metadata

- **Package**: lily-design-system-blazor-web-examples
- **Version**: 0.2.0
- **Created**: 2026-03-03
- **Updated**: 2026-05-30
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Tech Stack

- .NET 10.0 with C#
- Blazor Web App with Interactive Server rendering
- ProjectReference to `../lily-design-system-blazor-headless/`
- NHS UK CSS custom properties for styling

## Build & Run Commands

```bash
dotnet build                                              # Build the project
dotnet run --project src/LilyBlazorWebExamples  # Start dev server
dotnet publish -c Release                                 # Publish for production
```

## Project Structure

```
lily-design-system-blazor-web-examples/
├── CLAUDE.md
├── README.md
├── LilyBlazorWebExamples.slnx
├── src/LilyBlazorWebExamples/
│   ├── LilyBlazorWebExamples.csproj
│   ├── Program.cs
│   ├── _Imports.razor
│   ├── Components/
│   │   ├── App.razor
│   │   ├── Routes.razor
│   │   ├── Layout/MainLayout.razor
│   │   └── Pages/ (13 page files)
│   └── wwwroot/
│       ├── css/app-shell.css (component styling comes from the runtime theme)
│       └── js/headless-interop.js
```

## Example Pages

| Page         | Route                   | Key Components                                                                         |
| ------------ | ----------------------- | -------------------------------------------------------------------------------------- |
| Home         | `/`                     | Links to all examples                                                                  |
| Contact Form | `/contact-form`         | Form, Field, TextInput, EmailInput, TextAreaInput, Select, Option, Button, ErrorSummary     |
| Dashboard    | `/dashboard`            | Card, Progress, ProgressCircle, Badge, Banner, DataTable                               |
| Dialog Flow  | `/dialog-flow`          | Dialog, AlertDialog, Drawer, Tooltip, Button                                           |
| File Upload  | `/file-upload-form`     | FileUpload, Progress, Button, Alert, Badge, Form, Field                                |
| Navigation   | `/navigation-and-menus` | NavigationMenu, MenuBar, ToolBar, HamburgerMenu, DropdownMenu, Separator               |
| Page Layout  | `/page-layout`          | Header, Footer, BreadcrumbNav, Sidebar, NavigationMenu                                 |
| Rating       | `/rating-and-feedback`  | FiveStarRatingPicker, FiveStarRatingView, FiveFaceRatingPicker, NetPromoterScorePicker |
| Search       | `/search-and-filter`    | Combobox, SearchInput, TextInput, TagGroup, Tag, DataTable, Badge                      |
| Settings     | `/settings-page`        | SwitchButton, RadioGroup, RadioInput, Select, Fieldset, Banner                         |
| Tabs         | `/tabbed-interface`     | TabBar, TabBarButton, AccordionNav, AccordionList, AccordionListItem, Badge            |
| Tasks        | `/task-management`      | TaskList, TaskListItem, TextInput, CheckboxInput, Badge, Progress                      |
| Timeline     | `/timeline-and-cards`   | TimelineList, TimelineListItem, Card, DateRange, ReviewDate, SummaryList               |

## Blazor Translation Patterns

| React                 | Blazor                                                                 |
| --------------------- | ----------------------------------------------------------------------- |
| `useState(val)`       | `private type field = val;`                                             |
| `onChange={fn}`       | `@onchange="@((ChangeEventArgs e) => field = e.Value?.ToString() ?? "")"` (native `value`/`checked` attribute — see below) |
| `onClick={() => ...}` | `@onclick="() => ..."`                                                  |
| `{cond && <X/>}`      | `@if (cond) { <X /> }`                                                  |
| `{items.map(...)}`    | `@foreach (var i in items) { ... }`                                     |
| `setTimeout(fn, ms)`  | `await Task.Delay(ms); StateHasChanged();`                              |
| `setInterval(fn, ms)` | `System.Timers.Timer` + `InvokeAsync(StateHasChanged)`                  |

## Key Component APIs

**Most `lily-design-system-blazor-headless` components do NOT declare `Value`/`ValueChanged`, `Checked`/`CheckedChanged`, or `OnSubmit`.** `TextInput`, `EmailInput`, `TelInput`, `DateInput`, `TextAreaInput`, `Select`, `Option`, `RadioInput`, `CheckboxInput`, `Form`, `Field`, `Fieldset`, `SummaryListItem`, and most others declare only `Label`/`CssClass`/`ChildContent`/`AdditionalAttributes` — thin wrappers around the native element. Passing a PascalCase `Value=`/`ValueChanged=`/`OnSubmit=` compiles (it lands in `AdditionalAttributes`) but wires nothing — this silently broke `ContactForm.razor`, `SettingsPage.razor`, `RatingAndFeedback.razor`, `SearchAndFilter.razor`, and `TaskManagement.razor` until P7-T8 fixed them (see `CHANGELOG.md`). Use the **native-attribute idiom** instead — lowercase `value="@x"` / `checked="@x"` / `name="@x"` plus `@onchange`/`@oninput`, and `novalidate @onsubmit="Handler"` on `Form` — because Razor directive attributes always compile to their fixed lowercase DOM event name and splat correctly regardless of the component's declared parameters. `BookAnAppointment.razor` is the canonical reference for this idiom across every field type it uses.

A few components genuinely DO declare a real bindable pair, where `@bind-X`/`XChanged` works as written: `SwitchButton` (`Checked`/`CheckedChanged`, invoked on click), `Combobox` (`Value`/`ValueChanged` and `Open`/`OpenChanged`; its `ChildContent` is the listbox's option elements only — it renders its own `<input role="combobox">`), and `AccordionCheckbox` (`Checked`/`CheckedChanged`). Check `lily-design-system-blazor-headless`'s own `AGENTS.md` before assuming either way for any other component.

- **CSS**: Each component outputs its kebab-case base class (e.g., `"form"`, `"field"`, `"button"`) which NHS CSS targets
- **Tooltip**: Is a sibling element, not a wrapper. Use `aria-describedby` on trigger, `Visible`/`VisibleChanged` to toggle
- **AccordionListItem**: Renders `<details>`, requires `<summary>` as first child
- **TagInput.Onadd**: Is `string` type, not a callback. Use `TextInput` with `@onkeydown` wrapper for tag-add functionality
