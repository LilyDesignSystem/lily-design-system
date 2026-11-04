## Components

The canonical catalog of 607 components lives in [components.tsv](../components.tsv) — tab-separated rows of `slug	PascalCase	description`. Read that file for the full listing rather than maintaining a duplicate here.

Use the bin tools to query the catalog programmatically:

- `bin/list-components-as-kebab-case` — one slug per line
- `bin/list-components-as-pascal-case` — one PascalCase name per line

## Component patterns for file name and HTML tag

### Suffix → HTML Element Mapping

| Suffix      | Element      | Example                                                      |
| ----------- | ------------ | ------------------------------------------------------------ |
| article     | `<article>`  |                                                              |
| aside       | `<aside>`    | GrailLayoutLeftAside, GrailLayoutRightAside                  |
| button      | `<button>`   | Button, ToggleButton, SwitchButton                           |
| dialog      | `<dialog>`   | Dialog, AlertDialog, FileDialog                              |
| div         | `<div>`      | PinInputDiv, PasswordInputOrTextInputDiv                     |
| fieldset    | `<fieldset>` | Fieldset                                                     |
| figure      | `<figure>`   | Figure                                                       |
| footer      | `<footer>`   | Footer                                                       |
| header      | `<header>`   | Header                                                       |
| input       | `<input>`    | TextInput, DateInput, EmailInput                             |
| kbd         | `<kbd>`      |                                                              |
| mark        | `<mark>`     | Mark                                                         |
| list        | `<ol>`       | CheckList, TaskList (DoList/DontList use `<ul>`)             |
| list-item   | `<li>`       | CheckListItem, TaskListItem                                  |
| main        | `<main>`     | GrailLayoutCenterMain                                        |
| meter       | `<meter>`    | Meter                                                        |
| nav         | `<nav>`      | BreadcrumbNav, TreeNav                                       |
| option      | `<option>`   | Option, ThemeSelectOption                                    |
| picker      | `<div>`      | ColorPicker, FiveStarRatingPicker                            |
| picture     | `<picture>`  | Picture                                                      |
| progress    | `<progress>` | Progress                                                     |
| select      | `<select>`   | Select, ThemeSelect                                          |
| span        | `<span>`     | Flair, Character                                             |
| table       | `<table>`    | Table, DataTable, CalendarTable                              |
| table-thead | `<thead>`    | GanttTableThead (gantt-table only)                           |
| table-tbody | `<tbody>`    | GanttTableTbody (gantt-table only)                           |
| table-tfoot | `<tfoot>`    | GanttTableTfoot (gantt-table only)                           |
| table-tr    | `<tr>`       | GanttTableTr (gantt-table only)                              |
| table-th    | `<th>`       | TableTH, DataTableTH                                         |
| table-td    | `<td>`       | TableTD, DataTableTD                                         |
| table-head  | `<thead>`    | TableHead, DataTableHead, CalendarTableHead, KanbanTableHead |
| table-body  | `<tbody>`    | TableBody, DataTableBody, CalendarTableBody, KanbanTableBody |
| table-foot  | `<tfoot>`    | TableFoot, DataTableFoot, CalendarTableFoot, KanbanTableFoot |
| table-row   | `<tr>`       | TableRow, DataTableRow, CalendarTableRow, KanbanTableRow     |

## Component name patterns

- `*Bar` `*BarButton`
  - ActionBar ActionBarButton
  - MenuBar MenuBarButton
  - TabBar TabBarButton
  - TaskBar TaskBarButton
  - ToolBar ToolBarButton
- `*Group` `*GroupItem`
  - SegmentGroup SegmentGroupItem
- `*Guide` `*GuideList` `*GuideListItem`
  - Tour TourList TourListItem
- `*List` `*ListItem`
  - CheckList CheckListItem
  - CollectionList CollectionListItem
  - ContentsList ContentsListItem
  - DescriptionList DescriptionListItem
  - DocumentList DocumentListItem
  - DoList DoListItem
  - DontList DontListItem
  - IconList IconListItem
  - PaginationList PaginationListItem
  - SectionList SectionListItem
  - StepList StepListItem
  - SummaryList SummaryListItem
  - ValidationList ValidationListItem
- `*Nav` `*List` `*ListItem`
  - AccordionNav AccordionList AccordionListItem
  - BreadcrumbNav BreadcrumbList BreadcrumbListItem
  - ChatNav ChatList ChatListItem
  - ContentsNav ContentsList ContentsListItem
  - PaginationNav PaginationList PaginationListItem
  - SectionNav SectionList SectionListItem
  - TreeNav TreeList TreeListItem
- `*Select` `*SelectOption`
  - ThemeSelect ThemeSelectOption
- `*Menu` `*MenuItem`
  - ContextMenu ContextMenuItem
  - Menu MenuItem
- `*Input` `*Link`
  - TelInput TelLink
  - EmailInput EmailLink
- `*Picker` `*PickerButton`
  - ColorPicker ColorPickerButton
  - FiveFaceRatingPicker FiveFaceRatingPickerButton
  - FiveStarRatingPicker FiveStarRatingPickerButton
  - NetPromoterScorePicker NetPromoterScorePickerButton
  - RedAmberGreenPicker RedAmberGreenPickerButton
  - RedOrangeYellowGreenBluePicker RedOrangeYellowGreenBluePickerButton
- `*Input` `*View`
  - PostalCodeInput PostalCodeView
  - MeasurementInstanceInput MeasurementInstanceView
- ContainerWith*
  - ContainerWithFixedWidth
  - ContainerWithFluidWidth
- Table sub-elements: `*TableHead` `*TableBody` `*TableFoot` `*TableRow` `*TableTH` `*TableTD`
  - Table TableHead TableBody TableFoot TableRow TableTH TableTD
  - CalendarTable CalendarTableHead CalendarTableBody CalendarTableFoot CalendarTableRow CalendarTableTH CalendarTableTD
  - DataTable DataTableHead DataTableBody DataTableFoot DataTableRow DataTableTH DataTableTD
  - KanbanTable KanbanTableHead KanbanTableBody KanbanTableFoot KanbanTableRow KanbanTableTH KanbanTableTD
- Table sub-elements (gantt uses HTML element names directly): `*TableThead` `*TableTbody` `*TableTfoot` `*TableTr` `*TableTh` `*TableTd`
  - GanttTable GanttTableThead GanttTableTbody GanttTableTfoot GanttTableTr GanttTableTH GanttTableTD

## Component composition patterns

### Form pattern: Form → Field → Input

```tsx
<Form
  label="Contact"
  onSubmit={handleSubmit}
>
  <Field
    label="Name"
    required
    error={errors.name}
  >
    <TextInput
      label="Name"
      value={name}
      onChange={setName}
    />
  </Field>
  <ErrorSummary title="Errors">
    <ul>...</ul>
  </ErrorSummary>
  <Button type="submit">Submit</Button>
</Form>
```

### Grail layout pattern

```tsx
<GrailLayout>
  <GrailLayoutTopHeader>...</GrailLayoutTopHeader>
  <GrailLayoutLeftAside>...</GrailLayoutLeftAside>
  <GrailLayoutCenterMain>...</GrailLayoutCenterMain>
  <GrailLayoutRightAside>...</GrailLayoutRightAside>
  <GrailLayoutBottomFooter>...</GrailLayoutBottomFooter>
</GrailLayout>
```

### Navigation pattern: Nav → List → ListItem

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

### Chart pattern: figure → graphic (+ data table)

The seventeen chart components (every `*-chart` slug, plus `heatmap-chart-with-year-of-days`) share one shape. The graphic is the only thing inside `role="img"`; the
accessible table is a **sibling**, because `role="img"` makes its descendants presentational.

```tsx
<GaugeChart
  label="Speed: 72 of 100"
  dataTable={<table>…</table>}
>
  <svg viewBox="0 0 120 80">…</svg>
</GaugeChart>
// <figure class="gauge-chart">
//   <div class="gauge-chart-graphic" role="img" aria-label="…"><svg>…</svg></div>
//   <div class="gauge-chart-data-table"><table>…</table></div>   (only when supplied)
// </figure>
```

### Tool-call pattern: ToolCall → name + status in the summary, input / output / error in the body

```tsx
<ToolCall status="running" open>
  {/* summary slot */}
  <ToolCallName>search_web</ToolCallName>
  <ToolCallStatus status="running">Running</ToolCallStatus>
  {/* body */}
  <ToolCallInput label="Input"><pre>{"query": "weather"}</pre></ToolCallInput>
  <ToolCallError>The tool timed out.</ToolCallError>   {/* role="alert": open the call on error */}
</ToolCall>
```

### Chat input pattern: ChatComposer

`<ChatComposer label sendLabel stopLabel value busy onSend onStop />` — Enter sends, Shift+Enter inserts a line
break, Enter during IME composition is ignored; one button is send, or stop while `busy`. Put attachments or a
model picker in the default slot; show the conversation with `ChatNav`/`ChatList`/`ChatMessage`; announce a
streaming reply with `StreamingText`.

### Choice-chip pattern: RadioGroup / CheckboxGroup + real inputs

Chips that pick one option or several are a _look_, not a new component: use `RadioGroup` (one choice) or
`CheckboxGroup` (several), with a real input inside each label, and let CSS draw the chip. The inputs keep form
submission, `required`, form reset, keyboard (arrows within a radio group, Tab between checkboxes) and the accessible
name for free.

```tsx
<RadioGroup label="Delivery">
  <label class="choice-chip">
    <input
      type="radio"
      name="delivery"
      value="post"
    />{" "}
    Post
  </label>
  <label class="choice-chip">
    <input
      type="radio"
      name="delivery"
      value="collect"
    />{" "}
    Collect
  </label>
</RadioGroup>
```

Style the label (`:has(input:checked)` for the selected state, `:has(input:focus-visible)` for the focus ring) and
hide the input visually without removing it — clip it, never `display: none` or `hidden`, which take it out of the
form and the accessibility tree. For removable chips, use `TagInput`.

### Summary card pattern: Card → title + header actions + SummaryList

A composition of `Card` and `SummaryList`, not a component: the card title, optional header actions, and a summary list in the body.

```tsx
<Card>
  <h3>Personal details</h3>
  <a href="/name">
    Change<ScreenReaderSpan> name</ScreenReaderSpan>
  </a>
  <SummaryList label="Personal details">
    <SummaryListItem>…</SummaryListItem>
  </SummaryList>
</Card>
```

- Each action's accessible name says what it changes ("Change name"), through consumer-supplied text in a `ScreenReaderSpan`.
- Action targets are at least 24 by 24 CSS pixels, or spaced (WCAG 2.5.8).
- A missing value links to the question that answers it, not to a "Change" link.
- Earlier answers are pre-filled when the user returns through a change link (WCAG 3.3.7).
- Card titles are short and unique; header actions are about two words each, two or three at most.

### Logo slot pattern

A composition, not a component: the adopter's own mark in a link to the home page, at the start of the page header. Lily ships no
logo.

```html
<a
  href="/"
  data-lily-logo
>
  <svg
    role="img"
    aria-label="Example Organisation"
    viewBox="0 0 160 40"
  >
    …
  </svg>
</a>
```

- The accessible name is the organisation's name (`<img alt>` or `<svg role="img" aria-label>`), never "logo". A linked logo names
  the organisation and so, by convention, the home page it leads to; keep the visible text, if any, inside the name (WCAG 2.5.3).
- A logotype is exempt from text contrast (WCAG 1.4.3); the page around it is not.
- Each theme's shared "Logo slot" section reads `--lily-logo-clear-space` (padding around the mark) and `--lily-logo-min-size` (its
  smallest inline size). Both are unset by default and set by the adopter or a theme, because national and local guidelines
  disagree on clear space; Lily hard-codes none.
- Never put a body's logo, crest or mark in a theme ([visual-identity.md](visual-identity.md)).
- Example: `pages/logo-slot.html` in the HTML examples app, with `e2e/logo-slot.spec.ts`.

### Patient banner pattern

A labelled `<section aria-label>` holding a `dl` of consumer-supplied items (name, date of birth, national identifier shown with its `-view` component, gender, adverse reactions); no field truncated or hidden at a narrow width. Not a component and not named `patient-header` (the suffix table maps `-header` to `<header>`). Details: [`medical-banner`](../components/medical-banner/index.md).

### Table pattern: Table → Head/Body → Row → TH/TD

```tsx
<DataTable label="Users">
  <DataTableHead>
    <DataTableRow>
      <DataTableTH>Name</DataTableTH>
    </DataTableRow>
  </DataTableHead>
  <DataTableBody>
    <DataTableRow>
      <DataTableTD>Item</DataTableTD>
    </DataTableRow>
  </DataTableBody>
</DataTable>
```

### Mobile bottom navigation pattern: NavigationMenu fixed to the bottom

A composition on `navigation-menu`, not a component: on a narrow viewport the app's main navigation becomes a bar fixed to
the bottom of the viewport. It is navigation, so its items are real links in a `<nav>`, not a `tab-bar` tablist; use
`tab-bar` only when the items switch panels on the same page.

```tsx
<NavigationMenu
  label="Main navigation"
  class="bottom-navigation"
>
  <ul>
    <li>
      <a
        href="/"
        aria-current="page"
      >
        Home
      </a>
    </li>
    <li>
      <a href="/appointments">Appointments</a>
    </li>
    <li>
      <a href="/messages">Messages</a>
    </li>
    <li>
      <a href="/account">Account</a>
    </li>
  </ul>
</NavigationMenu>
```

- At most five items; move the rest to a "More" page or the page's own menu.
- Every item has visible text, not an icon alone; an icon beside the text is decorative (`aria-hidden="true"`).
- The current item's link carries `aria-current="page"`.
- The consumer's CSS fixes the bar (`position: fixed; inset-block-end: 0`) only on narrow viewports, with a `rem` breakpoint,
  and sets `--lily-fixed-bar-block-end` on the root (`:root` or `html`) to the bar's block size, so the themes' "Focus not
  obscured" section turns it into `scroll-padding-block` and a focused control is never hidden behind the bar (WCAG 2.2 SC
  2.4.11). Unset it where the bar is not fixed.
- Targets are at least 24 by 24 CSS pixels (WCAG 2.5.8), and the bar respects `env(safe-area-inset-bottom)`.
- Source: the DHCW Design System's mobile bottom navigation ([spec/dhcw-design-system-lessons](../spec/dhcw-design-system-lessons/index.md), catalog gaps).
