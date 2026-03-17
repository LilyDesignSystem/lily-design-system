# Lily Design System - React Headless

A comprehensive headless React component library with 332 accessible, unstyled components for building design systems. Every component follows WCAG 2.2 AAA guidelines with full ARIA support, keyboard navigation, and internationalization readiness.

**Headless** means zero CSS, zero styles, zero opinions about appearance. You provide all styling. Components provide structure, semantics, accessibility, and behavior.

## Features

- 332 headless React components
- TypeScript with full type definitions
- WCAG 2.2 AAA accessibility compliance
- Full keyboard navigation support
- ARIA attributes and roles
- Internationalization-ready (no hardcoded strings)
- Zero dependencies beyond React
- Works with any CSS framework or custom styles

## Quick Start

### Install

```bash
pnpm install lily-design-system-react-headless
```

### Peer Dependencies

```json
{
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0"
}
```

### Basic Usage

```tsx
import { useState } from "react";
import Button from "lily-design-system-react-headless/components/Button";
import TextInput from "lily-design-system-react-headless/components/TextInput";
import Alert from "lily-design-system-react-headless/components/Alert";

function App() {
  const [name, setName] = useState("");

  return (
    <div>
      <TextInput
        label="Your name"
        value={name}
        onChange={setName}
        placeholder="Enter your name"
      />
      <Button onClick={() => alert(`Hello, ${name}!`)}>Greet</Button>
      {name && (
        <Alert type="success" heading="Greeting">
          Welcome, {name}!
        </Alert>
      )}
    </div>
  );
}
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
- Styled-components
- Any built-in appearance

### Component File Structure

Each component consists of three files:

```
components/
  Button.tsx        # Component implementation
  Button.test.tsx   # Tests (React Testing Library + Vitest)
  Button.md         # Documentation
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
| Kbd       | `<kbd>`      | `Kbd`                                        |
| Table     | `<table>`    | `DataTable`, `CalendarTable`                 |
| TableHead | `<thead>`    | `DataTableHead`                              |
| TableBody | `<tbody>`    | `DataTableBody`                              |
| TableFoot | `<tfoot>`    | `DataTableFoot`                              |
| TableCol  | `<th>`       | `DataTableCol`                               |
| TableRow  | `<tr>`       | `DataTableRow`                               |
| TableData | `<td>`       | `DataTableData`                              |
| Div       | `<div>`      | `PinInputDiv`, `PasswordInputOrTextInputDiv` |
| Meter     | `<meter>`    | `Meter`                                      |
| Progress  | `<progress>` | `Progress`                                   |
| Fieldset  | `<fieldset>` | `Fieldset`                                   |

### CSS Class Convention

Every component's root element includes a semantic CSS class matching its kebab-case name, plus any consumer-provided `className`:

```tsx
<Button className="my-custom">Click</Button>
// Renders: <button class="button my-custom">Click</button>
```

## Component Categories

### Navigation

| Component          | Description                                             |
| ------------------ | ------------------------------------------------------- |
| AccordionNav       | Navigation container for collapsible accordion sections |
| AccordionList      | Ordered list of accordion items                         |
| AccordionListItem  | One collapsible accordion item                          |
| ActionLink         | Hyperlink styled as an action trigger                   |
| BackLink           | Link to return to a previous page                       |
| BreadcrumbNav      | Breadcrumb trail navigation container                   |
| BreadcrumbList     | Ordered list of breadcrumb items                        |
| BreadcrumbListItem | One breadcrumb link in the trail                        |
| ContentsNav        | Table of contents navigation landmark                   |
| ContentsList       | Ordered list of contents items                          |
| ContentsListItem   | One link to a page section                              |
| NavigationMenu     | Site-wide navigation menu                               |
| PaginationNav      | Page navigation links container                         |
| PaginationList     | Ordered list of page links                              |
| PaginationListItem | One page link                                           |
| SkipLink           | Hidden link for keyboard users to skip to main content  |
| TabBar             | Group of tabs for switching content panels              |
| TabBarButton       | One tab button                                          |
| TreeMenu           | Hierarchical tree menu with expandable branches         |
| TreeNav            | Hierarchical navigation with expandable branches        |

### Forms & Inputs

| Component                   | Description                                                               |
| --------------------------- | ------------------------------------------------------------------------- |
| Button                      | Clickable button for actions                                              |
| ButtonInput                 | Input element of type button                                              |
| Citation                    | Acknowledges relevance of another's work to the topic                     |
| CheckboxInput               | Checkbox for toggling a boolean value                                     |
| CheckboxGroup               | Group component that manages a collection of checkboxes with shared state |
| Code                        | Inline code span for short code snippets                                  |
| CodeBlock                   | Block of formatted code with line numbers and highlighting                |
| ColorInput                  | Color value selector                                                      |
| Comment                     | Displays user discussions and user feedback                               |
| Combobox                    | Text input with dropdown filter list                                      |
| CurrencyInput               | Locale-aware currency input with automatic formatting                     |
| DateField                   | Labeled date input with validation                                        |
| DateInput                   | Date value input                                                          |
| DatetimeLocalInput          | Date and time input                                                       |
| EmailInput                  | Email address input                                                       |
| Field                       | Form field wrapper with label and error                                   |
| Fieldset                    | Group of related form fields                                              |
| FileInput                   | File selector input                                                       |
| Form                        | Form element for data collection                                          |
| Hero                        | Large box or image with title and description                             |
| HiddenInput                 | Hidden form data input                                                    |
| ImageFileInput              | Image file selector with preview                                          |
| ImageInput                  | Graphical submit button that displays an image                            |
| Input                       | Generic HTML input element                                                |
| Label                       | Label for a form input                                                    |
| MonthInput                  | Month and year selector                                                   |
| NumberInput                 | Numeric value input with validation                                       |
| Option                      | Option in a select dropdown                                               |
| Organization                | Organization container for organization-related information               |
| Person                      | Person container for person-related information                           |
| Place                       | Place container for place-related information                             |
| PasswordInput               | Password input with obscured text                                         |
| PasswordInputOrTextInputDiv | Password input with show/hide toggle                                      |
| PinInputDiv                 | Multi-digit PIN/OTP entry                                                 |
| PostalCodeInput             | Postal/ZIP code input                                                     |
| RadioGroup                  | Group of radio buttons                                                    |
| RadioInput                  | Single radio button                                                       |
| RangeInput                  | Slider for selecting a value in a range                                   |
| ResetInput                  | Form reset button                                                         |
| SearchInput                 | Search query input                                                        |
| Select                      | Dropdown select element                                                   |
| SelectWithExtras            | Enhanced select with search/groups                                        |
| SubmitInput                 | Form submit button                                                        |
| SwitchButton                | Toggle switch for on/off settings                                         |
| TagInput                    | Input for adding and removing tags                                        |
| TelInput                    | Telephone number input                                                    |
| TextInput                   | Single-line text input                                                    |
| Textarea                    | Multi-line text area                                                      |
| ThemePicker                 | Visual theme picker                                                       |
| ThemeSelect                 | Theme select dropdown                                                     |
| ThemeSelectOption           | One option in theme select                                                |
| TimeInput                   | Time value input                                                          |
| TimePickerInput             | Time picker with dropdown                                                 |
| UrlInput                    | URL input                                                                 |
| WeekInput                   | Week and year selector                                                    |

### Data Display

| Component                   | Description                               |
| --------------------------- | ----------------------------------------- |
| Avatar                      | Avatar indicator (image or text)          |
| AvatarImage                 | Avatar image (user photo)                 |
| AvatarGroup                 | Group of avatar components                |
| AvatarText                  | Avatar text (user initials)               |
| Badge                       | Small label for counts/statuses           |
| CalendarTable               | Calendar grid for dates                   |
| CalendarTableHead/Body/Foot | Calendar table sections                   |
| CalendarTableCol/Row/Data   | Calendar table cells                      |
| Card                        | Grouped content container                 |
| DataTable                   | Sortable data table grid                  |
| DataTableHead/Body/Foot     | Data table sections                       |
| DataTableCol/Row/Data       | Data table cells                          |
| GanttTable                  | Gantt chart schedule table                |
| GanttTableHead/Body/Foot    | Gantt table sections                      |
| GanttTableCol/Row/Data      | Gantt table cells                         |
| KanbanTable                 | Kanban board table                        |
| KanbanTableHead/Body/Foot   | Kanban table sections                     |
| KanbanTableCol/Row/Data     | Kanban table cells                        |
| Table                       | Table with rows and columns               |
| TableHead                   | Table thead                               |
| TableBody                   | Table tbody                               |
| TableFoot                   | Table tfoot                               |
| TableCol                    | Table column                              |
| TableRow                    | Table row                                 |
| TableData                   | Table data cell                           |
| Caption                     | Table/figure caption                      |
| SuperBanner                 | High-priority state banner for entire app |
| SummaryList                 | Key-value summary pairs                   |
| SummaryListItem             | One key-value pair                        |

### Feedback & Status

| Component                    | Description                                         |
| ---------------------------- | --------------------------------------------------- |
| Alert                        | Status message for feedback                         |
| AlertDialog                  | Modal for critical messages                         |
| Banner                       | Prominent message bar                               |
| CharacterCounter             | Character count for text fields                     |
| ErrorMessage                 | Form field error message                            |
| Event                        | Event container for event-related information       |
| ErrorSummary                 | Summary of validation errors                        |
| FiveFaceRatingView           | Read-only face rating display                       |
| FiveFaceRatingPicker         | 1-5 face rating selector                            |
| FiveFaceRatingPickerButton   | Face rating button                                  |
| FiveStarRatingView           | Read-only star rating display                       |
| FiveStarRatingPicker         | 1-5 star rating selector                            |
| FiveStarRatingPickerButton   | Star rating button                                  |
| Meter                        | Scalar value gauge                                  |
| MockupBrowser                | Box area that looks like a web browser              |
| MockupLaptop                 | Box area that looks like a laptop computer          |
| MockupPhone                  | Box area that looks like a mobile phone             |
| MockupTabletLandscape        | Box area that looks like a tablet in landscape mode |
| MockupTabletPortrait         | Box area that looks like a tablet in portrait mode  |
| MockupShell                  | Box area that looks like a terminal shell           |
| MockupWatch                  | Box area that looks like a smart watch              |
| MockupWindow                 | Box area that looks like a desktop window           |
| NetPromoterScoreView         | Read-only NPS display                               |
| NetPromoterScorePicker       | 0-10 NPS selector                                   |
| NetPromoterScorePickerButton | NPS button                                          |
| Progress                     | Horizontal progress bar                             |
| ProgressCircle               | Circular progress indicator                         |
| ProgressSpinner              | Indeterminate spinner                               |
| Toast                        | Auto-dismissing notification                        |

### Overlays & Panels

| Component       | Description                      |
| --------------- | -------------------------------- |
| Collapsible     | Expandable/collapsible container |
| ContextMenu     | Right-click context menu         |
| ContextMenuItem | One context menu item            |
| Details         | Disclosure widget                |
| Dialog          | Modal/non-modal dialog           |
| Drawer          | Edge-sliding panel               |
| DropdownMenu    | Button-triggered dropdown menu   |
| Expander        | Expandable content control       |
| FloatingPanel   | Panel floating above content     |
| HoverCard       | Card appearing on hover          |
| Popover         | Floating box anchored to trigger |
| Popup           | Temporary overlay                |
| Sheet           | Edge-sliding overlay panel       |
| Tooltip         | Descriptive text on hover/focus  |

### Layout & Structure

| Component               | Description                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| AspectRatioContainer    | Fixed aspect ratio container                                                              |
| Footer                  | Page/section footer                                                                       |
| Header                  | Page/section header                                                                       |
| GrailLayout             | Responsive web design structure with header, left aside, center main, right aside, footer |
| GrailLayoutTopHeader    | Grail layout top header full width                                                        |
| GrailLayoutLeftAside    | Grail layout left aside sidebar                                                           |
| GrailLayoutCenterMain   | Grail layout center main content                                                          |
| GrailLayoutRightAside   | Grail layout right aside sidebar                                                          |
| GrailLayoutBottomFooter | Grail layout bottom footer full width                                                     |
| Panel                   | Generic content panel                                                                     |
| Separator               | Horizontal/vertical divider                                                               |
| Sidebar                 | Side navigation panel                                                                     |
| SlideOutDrawer          | Side-sliding drawer                                                                       |
| Splitter                | Draggable panel resizer                                                                   |
| Resizable               | User-resizable container                                                                  |

### Content

| Component            | Description                                               |
| -------------------- | --------------------------------------------------------- |
| AiLabel              | Indicator of AI instances for AI explainability           |
| BeachBall            | Decorative animated element                               |
| Carousel             | Content slideshow                                         |
| Character            | Single character display                                  |
| ChatNav              | Navigation container for chat information                 |
| ChatList             | Ordered list of chat list item components                 |
| ChatListItem         | One chat list item, typically containing one chat message |
| ChatMessage          | Chat conversation message entry with author, time, etc.   |
| ClipboardCopyButton  | Copy-to-clipboard button                                  |
| Emoji                | Accessible emoji character                                |
| EmojiCharacterPicker | Emoji browser/picker                                      |
| Figure               | Self-contained figure with caption                        |
| Flair                | Decorative highlight element                              |
| Footnote             | Footnote reference and content                            |
| Icon                 | Icon container                                            |
| Image                | Accessible image element                                  |
| InsetText            | Indented distinguishing text                              |
| Kbd                  | Keyboard shortcuts and key combinations display           |
| QrCode               | QR code generator                                         |
| Skeleton             | Loading placeholder animation                             |
| Sparkline            | Inline data trend chart                                   |
| Notification         | Event notification message                                |
| SignaturePad         | Handwritten signature capture                             |

### Lists & Groups

| Component        | Description                                   |
| ---------------- | --------------------------------------------- |
| CheckList        | Checklist container                           |
| CheckListItem    | Checklist item with checkbox                  |
| DoList           | Encouraged-practice guideline list            |
| DoListItem       | One encouraged-practice item                  |
| DontList         | Discouraged-practice guideline list           |
| DontListItem     | One discouraged-practice item                 |
| Listbox          | Selectable options list                       |
| Loading          | Loading indicator (text, image, or animation) |
| Menu             | Actions/options list                          |
| MenuItem         | One menu item                                 |
| MenuBar          | Horizontal menu bar                           |
| MenuBarButton    | One menu bar item                             |
| SegmentGroup     | Mutually exclusive segment options            |
| SegmentGroupItem | One segment option                            |
| TagGroup         | Group of tags                                 |
| Tag              | Keyword label                                 |
| TaskList         | Task list container                           |
| TaskListItem     | Task item with checkbox                       |
| TimelineList     | Chronological events list                     |
| TimelineListItem | One timeline event                            |
| ToggleGroup      | Toggle button group                           |
| ToggleButton     | Pressable toggle button                       |
| TreeList         | Hierarchical expandable list                  |
| TreeListItem     | One item in a tree navigation list            |

### Toolbars & Actions

| Component           | Description                        |
| ------------------- | ---------------------------------- |
| CallToAction        | Prominent action prompt            |
| Command             | Command palette for search/execute |
| HamburgerMenu       | Mobile navigation toggle           |
| TaskBar             | Task shortcuts bar                 |
| TaskBarButton       | One task bar item                  |
| ToolBar             | Tool actions bar                   |
| ToolBarButton       | One tool bar action                |
| CalendarRangePicker | Date range picker                  |
| ColorPicker         | 2D color picker board              |
| ColorPickerButton   | Color swatch button                |

### Specialty

| Component                   | Description                                   |
| --------------------------- | --------------------------------------------- |
| CareCard                    | Medical care instruction card                 |
| Dial                        | Rotary dial value selector                    |
| DialGroup                   | Group of dial components                      |
| Diff                        | Side-by-side comparison of two items          |
| DigitalObjectIdentifierLink | Permanent DOI hyperlink to electronic source  |
| AngleSliderRangeInput       | Angle selection range input                   |
| DateRange                   | Start/end date range display                  |
| Editable                    | Inline-editable text element                  |
| EditableForm                | Inline editing form wrapper                   |
| FileDialog                  | File browser dialog                           |
| FileManager                 | File navigation manager                       |
| FileUpload                  | Drag-and-drop file upload                     |
| MedicalRecordRedBox         | Critical medical info box                     |
| ReviewDate                  | Content review date display                   |
| Slider                      | Draggable value selector                      |
| Sonner                      | Toast notification manager                    |
| Tile                        | Structured content grouping container         |
| Timer                       | Countdown/elapsed time display                |
| TimerButton                 | Button with auto-click timer                  |
| ThemePickerButton           | Picker button for selecting a visual theme    |
| ThemeView                   | Current theme display                         |
| Tour                        | Step-by-step guide                            |
| TourList                    | Tour steps list                               |
| TourListItem                | One tour step                                 |
| ScreenReaderSpan            | Visually hidden span for screen reader labels |
| ScrollArea                  | Scrollable container                          |
| ScrollBar                   | Custom scrollbar                              |
| WarningCallout              | Warning callout box                           |
| InformationCallout          | Informational callout box                     |

### Regional & Specialized

| Component                                        | Description                      |
| ------------------------------------------------ | -------------------------------- |
| PostalCodeView                                   | Postal/ZIP code display          |
| RedAmberGreenView/Picker/PickerButton            | RAG status display and selection |
| RedOrangeYellowGreenBlueView/Picker/PickerButton | Five-level color status          |
| UnitedKingdomNationalHealthServiceNumberInput    | UK NHS number input              |
| UnitedKingdomNationalHealthServiceNumberView     | UK NHS number display            |
| UnitedStatesSocialSecurityNumberInput            | US SSN input                     |
| UnitedStatesSocialSecurityNumberView             | US SSN display                   |
| MeasurementInstanceInput/View                    | Measurement value input/display  |
| MeasurementSystemInput/View                      | Measurement system input/display |
| MeasurementUnitInput/View                        | Measurement unit input/display   |

### Vital Signs

| Component                                            | Description                            |
| ---------------------------------------------------- | -------------------------------------- |
| VitalSignBloodPressureDiastolicAsMmhgView/Input      | Blood pressure diastolic in mmHg       |
| VitalSignBloodPressureSystolicAsMmhgView/Input       | Blood pressure systolic in mmHg        |
| VitalSignBodyFatAsPercentageView/Input               | Body fat percentage                    |
| VitalSignBodyTemperatureAsCelciusView/Input          | Body temperature in Celsius            |
| VitalSignCholesterolAsHdlMmolPerLitreView/Input      | Cholesterol HDL in mmol/L              |
| VitalSignCholesterolAsLdlMmolPerLitreView/Input      | Cholesterol LDL in mmol/L              |
| VitalSignHeartRateAsBeatsPerMinuteView/Input         | Heart rate in BPM                      |
| VitalSignHeartRateVariabilityView/Input              | Heart rate variability (HRV)           |
| VitalSignHeightAsCmView/Input                        | Height in centimetres                  |
| VitalSignRespiratoryRateAsBreathsPerMinuteView/Input | Respiratory rate in breaths per minute |
| VitalSignSleepScoreAs0To100View/Input                | Sleep score (0-100)                    |
| VitalSignTotalSleepTimeAsMinPerDayView/Input         | Total sleep time in minutes per day    |
| VitalSignVo2MaxAsMlPerKgPerMinuteView/Input          | VO2 max in mL/kg/min                   |
| VitalSignWaistCircumferenceAsCmView/Input            | Waist circumference in centimetres     |
| VitalSignWeightAsKgView/Input                        | Weight in kilograms                    |

## Usage Examples

See the `examples/` directory for comprehensive standalone examples:

| Example                                               | Components Used                                                                                        |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [ContactForm](examples/ContactForm.tsx)               | Form, Field, TextInput, EmailInput, Textarea, Select, Option, Button, ErrorSummary                     |
| [SettingsPage](examples/SettingsPage.tsx)             | SwitchButton, RadioGroup, RadioInput, Select, Separator, Fieldset, Button, Banner                      |
| [Dashboard](examples/Dashboard.tsx)                   | Card, Progress, ProgressCircle, Badge, Banner, DataTable, DataTableHead/Body/Row/Data                  |
| [PageLayout](examples/PageLayout.tsx)                 | SkipLink, Header, Footer, NavigationMenu, BreadcrumbNav/List/ListItem, Sidebar                         |
| [TabbedInterface](examples/TabbedInterface.tsx)       | TabBar, TabBarButton, AccordionNav/List/ListItem, Badge                                                |
| [DialogFlow](examples/DialogFlow.tsx)                 | Dialog, AlertDialog, Drawer, Button, Popover, Tooltip                                                  |
| [RatingAndFeedback](examples/RatingAndFeedback.tsx)   | FiveStarRatingPicker/View, FiveFaceRatingPicker, NetPromoterScorePicker, Textarea, Alert               |
| [FileUploadForm](examples/FileUploadForm.tsx)         | FileUpload, Progress, Button, Alert, Badge, Form, Field                                                |
| [TaskManagement](examples/TaskManagement.tsx)         | TaskList, TaskListItem, TextInput, CheckboxInput, Button, Badge, Progress                              |
| [NavigationAndMenus](examples/NavigationAndMenus.tsx) | NavigationMenu, MenuBar, MenuBarButton, ToolBar, ToolBarButton, HamburgerMenu, DropdownMenu, Separator |
| [TimelineAndCards](examples/TimelineAndCards.tsx)     | TimelineList, TimelineListItem, Card, Badge, DateRange, ReviewDate, SummaryList, SummaryListItem       |
| [SearchAndFilter](examples/SearchAndFilter.tsx)       | Combobox, SearchInput, TagInput, TagGroup, Tag, DataTable, DataTableHead/Body/Row/Data, Badge          |

### Form with Validation

```tsx
import { useState } from "react";
import Field from "./components/Field";
import TextInput from "./components/TextInput";
import EmailInput from "./components/EmailInput";
import Button from "./components/Button";
import ErrorSummary from "./components/ErrorSummary";

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (validate()) {
      // submit form
    }
  }

  return (
    <div>
      {Object.keys(errors).length > 0 && (
        <ErrorSummary title="Please fix the following errors">
          <ul>
            {Object.entries(errors).map(([field, msg]) => (
              <li key={field}>
                <a href={`#${field}`}>{msg}</a>
              </li>
            ))}
          </ul>
        </ErrorSummary>
      )}
      <Field label="Name" required error={errors.name}>
        <TextInput label="Name" value={name} onChange={setName} />
      </Field>
      <Field label="Email" required error={errors.email}>
        <EmailInput label="Email" value={email} onChange={setEmail} />
      </Field>
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
```

### Tabbed Interface

```tsx
import { useState } from "react";
import TabBar from "./components/TabBar";
import TabBarButton from "./components/TabBarButton";

function TabbedContent() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      <TabBar label="Content sections">
        <TabBarButton
          selected={activeTab === "overview"}
          controls="overview-panel"
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </TabBarButton>
        <TabBarButton
          selected={activeTab === "details"}
          controls="details-panel"
          onClick={() => setActiveTab("details")}
        >
          Details
        </TabBarButton>
      </TabBar>
      {activeTab === "overview" && (
        <div id="overview-panel">Overview content</div>
      )}
      {activeTab === "details" && <div id="details-panel">Details content</div>}
    </div>
  );
}
```

### Breadcrumb Navigation

```tsx
import BreadcrumbNav from "./components/BreadcrumbNav";
import BreadcrumbList from "./components/BreadcrumbList";
import BreadcrumbListItem from "./components/BreadcrumbListItem";

function Breadcrumbs() {
  return (
    <BreadcrumbNav label="Breadcrumb">
      <BreadcrumbList>
        <BreadcrumbListItem>
          <a href="/">Home</a>
        </BreadcrumbListItem>
        <BreadcrumbListItem>
          <a href="/products">Products</a>
        </BreadcrumbListItem>
        <BreadcrumbListItem current>Widget Pro</BreadcrumbListItem>
      </BreadcrumbList>
    </BreadcrumbNav>
  );
}
```

### Modal Dialog

```tsx
import { useState } from "react";
import Dialog from "./components/Dialog";
import Button from "./components/Button";

function ConfirmDelete() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Delete Item</Button>
      <Dialog open={open} label="Confirm Deletion" onChange={setOpen}>
        <p>Are you sure you want to delete this item?</p>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button
          onClick={() => {
            deleteItem();
            setOpen(false);
          }}
        >
          Delete
        </Button>
      </Dialog>
    </div>
  );
}
```

### Data Table

```tsx
import DataTable from "./components/DataTable";
import DataTableHead from "./components/DataTableHead";
import DataTableBody from "./components/DataTableBody";
import DataTableRow from "./components/DataTableRow";
import DataTableData from "./components/DataTableData";

function UserTable({ users }) {
  return (
    <DataTable label="Users">
      <DataTableHead>
        <DataTableRow>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
        </DataTableRow>
      </DataTableHead>
      <DataTableBody>
        {users.map((user) => (
          <DataTableRow key={user.id}>
            <DataTableData>{user.name}</DataTableData>
            <DataTableData>{user.email}</DataTableData>
            <DataTableData>{user.role}</DataTableData>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  );
}
```

### Star Rating

```tsx
import { useState } from "react";
import FiveStarRatingPicker from "./components/FiveStarRatingPicker";
import FiveStarRatingView from "./components/FiveStarRatingView";

function RatingExample() {
  const [rating, setRating] = useState(0);

  return (
    <div>
      <FiveStarRatingPicker
        label="Rate this product"
        value={rating}
        onChange={setRating}
      />
      <FiveStarRatingView label="Current rating" value={rating} />
    </div>
  );
}
```

### Accordion Navigation

```tsx
import { useState } from "react";
import AccordionNav from "./components/AccordionNav";
import AccordionList from "./components/AccordionList";
import AccordionListItem from "./components/AccordionListItem";

function FAQ() {
  return (
    <AccordionNav label="Frequently asked questions">
      <AccordionList>
        <AccordionListItem>
          <h3>What is a headless component?</h3>
          <p>
            A headless component provides behavior, accessibility, and structure
            without any visual styling. You supply all CSS.
          </p>
        </AccordionListItem>
        <AccordionListItem>
          <h3>Can I use Tailwind CSS?</h3>
          <p>
            Yes. Pass Tailwind classes via the className prop on every
            component. Any CSS framework works.
          </p>
        </AccordionListItem>
        <AccordionListItem>
          <h3>Is keyboard navigation supported?</h3>
          <p>All interactive components follow WAI-ARIA keyboard patterns.</p>
        </AccordionListItem>
      </AccordionList>
    </AccordionNav>
  );
}
```

### Settings with Toggle Switches

```tsx
import { useState } from "react";
import SwitchButton from "./components/SwitchButton";
import Separator from "./components/Separator";

function SettingsPanel() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div>
      <h2>Settings</h2>
      <SwitchButton
        label="Dark mode"
        checked={darkMode}
        onChange={setDarkMode}
      />
      <Separator />
      <SwitchButton
        label="Push notifications"
        checked={notifications}
        onChange={setNotifications}
      />
      <Separator />
      <SwitchButton
        label="Auto-save"
        checked={autoSave}
        onChange={setAutoSave}
      />
    </div>
  );
}
```

### Inline Editing

```tsx
import Editable from "./components/Editable";

function EditableProfile() {
  return (
    <div>
      <h2>Profile</h2>
      <div>
        <span>Name: </span>
        <Editable label="Edit name" value="Jane Doe" />
      </div>
      <div>
        <span>Title: </span>
        <Editable label="Edit title" value="Software Engineer" />
      </div>
    </div>
  );
}
```

### Checkbox Form

```tsx
import { useState } from "react";
import CheckboxInput from "./components/CheckboxInput";
import Button from "./components/Button";

function TermsForm() {
  const [accepted, setAccepted] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <form>
      <CheckboxInput
        label="I accept the terms and conditions"
        checked={accepted}
        onChange={setAccepted}
        required
      />
      <CheckboxInput
        label="Subscribe to newsletter"
        checked={newsletter}
        onChange={setNewsletter}
      />
      <Button type="submit" disabled={!accepted}>
        Sign Up
      </Button>
    </form>
  );
}
```

### Collapsible Sections

```tsx
import Collapsible from "./components/Collapsible";

function CollapsibleContent() {
  return (
    <div>
      <Collapsible summary="System requirements">
        <ul>
          <li>Node.js 18 or later</li>
          <li>React 18 or 19</li>
          <li>TypeScript 5.x</li>
        </ul>
      </Collapsible>
      <Collapsible summary="Installation steps">
        <ol>
          <li>Clone the repository</li>
          <li>Run pnpm install</li>
          <li>Import components as needed</li>
        </ol>
      </Collapsible>
    </div>
  );
}
```

### Progress Dashboard

```tsx
import ProgressCircle from "./components/ProgressCircle";
import Badge from "./components/Badge";
import Banner from "./components/Banner";

function Dashboard() {
  const tasksCompleted = 7;
  const tasksTotal = 10;
  const percent = Math.round((tasksCompleted / tasksTotal) * 100);

  return (
    <div>
      <Banner type="info">
        Sprint ends in 3 days. {tasksTotal - tasksCompleted} tasks remaining.
      </Banner>
      <div>
        <ProgressCircle label="Sprint progress" value={percent} />
        <Badge type="success">{percent}% complete</Badge>
      </div>
    </div>
  );
}
```

## API Patterns

### Common Props

Every component accepts these props:

| Prop           | Type              | Description                                                          |
| -------------- | ----------------- | -------------------------------------------------------------------- |
| `className`    | `string`          | Additional CSS classes (combined with the built-in kebab-case class) |
| `children`     | `React.ReactNode` | Child content (on container components)                              |
| `...restProps` | `unknown`         | Any additional HTML attributes are forwarded to the root element     |

### Controlled Components

Interactive components follow the controlled component pattern with `value` + `onChange`:

```tsx
// Text inputs: onChange receives the string value directly
<TextInput label="Name" value={name} onChange={setName} />
<EmailInput label="Email" value={email} onChange={setEmail} />
<Textarea label="Bio" value={bio} onChange={setBio} />

// Numeric inputs: onChange receives a number
<NumberInput label="Age" value={age} onChange={setAge} />
<RangeInput label="Volume" value={volume} onChange={setVolume} />

// Boolean inputs: onChange receives a boolean
<CheckboxInput label="Accept" checked={accepted} onChange={setAccepted} />
<SwitchButton label="Dark mode" checked={darkMode} onChange={setDarkMode} />
<ToggleButton label="Bold" pressed={bold} onChange={setBold} />

// Select: onChange receives the selected value string
<Select label="Country" value={country} onChange={setCountry}>
  <Option value="us">United States</Option>
  <Option value="uk">United Kingdom</Option>
</Select>
```

### Open/Close Components

Overlays and expandable components use `open` + `onChange`:

```tsx
<Dialog open={open} label="Title" onChange={setOpen}>...</Dialog>
<Drawer open={open} label="Menu" side="right" onChange={setOpen}>...</Drawer>
<Collapsible summary="Details" open={open} onChange={setOpen}>...</Collapsible>
<Popover label="Info" open={open} onChange={setOpen}>...</Popover>
```

### Paired Input/View Components

Several components come in interactive + read-only pairs:

| Interactive (Input/Picker) | Read-Only (View)          |
| -------------------------- | ------------------------- |
| `FiveStarRatingPicker`     | `FiveStarRatingView`      |
| `FiveFaceRatingPicker`     | `FiveFaceRatingView`      |
| `NetPromoterScorePicker`   | `NetPromoterScoreView`    |
| `RedAmberGreenPicker`      | `RedAmberGreenView`       |
| `PostalCodeInput`          | `PostalCodeView`          |
| `MeasurementInstanceInput` | `MeasurementInstanceView` |

### Composable Component Families

Many components form hierarchical families meant to be used together:

```tsx
// Navigation: Nav → List → ListItem
<BreadcrumbNav label="...">
  <BreadcrumbList>
    <BreadcrumbListItem>...</BreadcrumbListItem>
  </BreadcrumbList>
</BreadcrumbNav>

// Tables: Table → Head/Body/Foot → Row → Data
<DataTable label="...">
  <DataTableHead><DataTableRow><th>...</th></DataTableRow></DataTableHead>
  <DataTableBody><DataTableRow><DataTableData>...</DataTableData></DataTableRow></DataTableBody>
</DataTable>

// Forms: Form → Field → Input
<Form label="...">
  <Field label="..." error={error}>
    <TextInput label="..." value={v} onChange={setV} />
  </Field>
</Form>

// Grail Layout: GrailLayout → Top/Left/Center/Right/Bottom
<GrailLayout>
  <GrailLayoutTopHeader>…</GrailLayoutTopHeader>
  <GrailLayoutLeftAside>…</GrailLayoutLeftAside>
  <GrailLayoutCenterMain>…</GrailLayoutCenterMain>
  <GrailLayoutRightAside>…</GrailLayoutRightAside>
  <GrailLayoutBottomFooter>…</GrailLayoutBottomFooter>
</GrailLayout>

// Vital Signs: Group → Individual vital sign views or inputs
<VitalSignGroupView>
  <VitalSignHeartRateAsBeatsPerMinuteView>…</VitalSignHeartRateAsBeatsPerMinuteView>
  <VitalSignBloodPressureSystolicAsMmhgView>…</VitalSignBloodPressureSystolicAsMmhgView>
  <VitalSignBloodPressureDiastolicAsMmhgView>…</VitalSignBloodPressureDiastolicAsMmhgView>
</VitalSignGroupView>
```

## Styling Guide

Since components are headless, you provide all styling. Every component renders a semantic CSS class on its root element:

```tsx
// Component renders: <button class="button my-btn">
<Button className="my-btn">Click</Button>

// Component renders: <dialog class="dialog modal-lg">
<Dialog className="modal-lg" label="Title" open>Content</Dialog>
```

### With Tailwind CSS

```tsx
<Button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
  Save
</Button>

<Card className="border rounded-lg shadow-md p-6">
  <h3 className="text-lg font-bold">Title</h3>
  <p>Content</p>
</Card>

<Alert type="error" heading="Error" className="bg-red-50 border-l-4 border-red-500 p-4">
  Something went wrong.
</Alert>
```

### With CSS Modules

```tsx
import styles from "./MyComponent.module.css";

<TextInput className={styles.input} label="Name" value={name} onChange={setName} />
<Button className={styles.primaryButton}>Submit</Button>
```

### With Plain CSS

```css
/* Target built-in semantic classes */
.button {
  padding: 8px 16px;
  border-radius: 4px;
}
.alert {
  padding: 12px;
  border-left: 4px solid;
}
.alert[data-type="error"] {
  border-color: red;
  background: #fff0f0;
}
.alert[data-type="success"] {
  border-color: green;
  background: #f0fff0;
}
.dialog {
  max-width: 480px;
  border-radius: 8px;
}
```

### Data Attributes for Styling

Many components expose data attributes for CSS-based styling:

| Component            | Attribute                     | Values                                           |
| -------------------- | ----------------------------- | ------------------------------------------------ |
| Alert                | `data-type`                   | `info`, `success`, `warning`, `error`            |
| Badge                | `data-type`                   | `default`, `info`, `success`, `warning`, `error` |
| Banner               | `data-type`                   | `info`, `success`, `warning`, `error`            |
| ClipboardCopyButton  | `data-copied`                 | `true`, `false`                                  |
| AspectRatioContainer | `data-aspect-ratio-container` | ratio number                                     |

## Development

### Prerequisites

- Node.js 18+
- pnpm 9+

### Setup

```bash
git clone https://github.com/lily/lily-design-system-react-headless.git
cd lily-design-system-react-headless
pnpm install
```

### Testing

```bash
# Run all tests (332 files)
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Run tests with UI
pnpm run test:ui

# Run a specific component test
pnpm exec vitest run components/Button.test.tsx
```

### Tech Stack

- **React 19** with TypeScript
- **Vitest** for testing (not Jest)
- **React Testing Library** for component tests
- **@testing-library/user-event** for interaction simulation
- **jsdom** for DOM environment

### Testing Conventions

Tests use Vitest built-in matchers only. `@testing-library/jest-dom` is not used.

```tsx
// Correct — Vitest matchers
expect(el).toBeTruthy();
expect(el).toBeNull();
expect(el.getAttribute("role")).toBe("button");
expect(el.textContent).toContain("text");
expect(button.disabled).toBe(true);

// Incorrect — jest-dom matchers (not used in this project)
expect(el).toBeInTheDocument();
expect(el).toHaveAttribute("role");
expect(el).toHaveTextContent("text");
```

## Accessibility

All components follow WCAG 2.2 AAA guidelines:

- **Semantic HTML**: Proper element usage (`<button>`, `<nav>`, `<dialog>`, etc.)
- **ARIA attributes**: Roles, labels, states, and properties
- **Keyboard navigation**: Full keyboard support for all interactive components
- **Screen readers**: Proper announcements via aria-live, role="alert", etc.
- **Focus management**: Logical focus order and visible focus indicators
- **Error handling**: Accessible error messages linked via aria-errormessage

### WAI-ARIA Patterns

Components implement standard WAI-ARIA Authoring Practices patterns:

| Pattern     | Components                                          |
| ----------- | --------------------------------------------------- |
| Button      | Button, ToggleButton, SwitchButton                  |
| Dialog      | Dialog, AlertDialog                                 |
| Menu        | Menu, MenuItem, MenuBar, MenuBarButton, ContextMenu |
| Tabs        | TabBar, TabBarButton                                |
| Tree View   | TreeNav, TreeList, TreeListItem                     |
| Listbox     | Listbox, Combobox                                   |
| Grid        | DataTable, CalendarTable, GanttTable, KanbanTable   |
| Accordion   | AccordionNav, AccordionList, AccordionListItem      |
| Breadcrumb  | BreadcrumbNav, BreadcrumbList, BreadcrumbListItem   |
| Alert       | Alert, AlertDialog                                  |
| Disclosure  | Details, Collapsible, Expander                      |
| Separator   | Separator                                           |
| Meter       | Meter                                               |
| Progressbar | Progress, ProgressCircle                            |
| Slider      | Slider, SliderButton, RangeInput, Dial              |
| Switch      | SwitchButton                                        |
| Tooltip     | Tooltip                                             |

## Internationalization

No strings are hardcoded in any component. All user-facing text comes through props:

```tsx
// All text is consumer-provided — use your i18n library
<Button>{t("submit")}</Button>
<Alert type="error" heading={t("error.title")}>{t("error.message")}</Alert>
<Field label={t("form.name")} error={t("validation.required")}>
  <TextInput label={t("form.name")} value={name} onChange={setName} />
</Field>
<SkipLink label={t("navigation.skip_to_content")} />
```

## Contributing

### Adding a New Component

1. Create `components/ComponentName.tsx` with exported interface and default function
2. Create `components/ComponentName.test.tsx` following the test file pattern
3. Create `components/ComponentName.md` with props documentation

### Code Conventions

- All props interfaces end with `[key: string]: unknown` for rest props
- Default `className` to `""` in all components
- Use `...restProps` spread on the root element
- camelCase for all callback props (`onChange`, `onClose`, `onSubmit`)
- camelCase for HTML attributes in JSX (`autoComplete`, `tabIndex`, `htmlFor`)

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0, or contact us for more options.

## Contact

Joel Parker Henderson (joel@joelparkerhenderson.com)
