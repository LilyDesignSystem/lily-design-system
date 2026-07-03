## Components

The canonical catalog of 490 components lives in [components.tsv](../components.tsv) — tab-separated rows of `slug	PascalCase	description`. Read that file for the full listing rather than maintaining a duplicate here.

Use the bin tools to query the catalog programmatically:

- `bin/list-components-as-kebab-case` — one slug per line
- `bin/list-components-as-pascal-case` — one PascalCase name per line

## Component patterns for file name and HTML tag

### Suffix → HTML Element Mapping

| Suffix     | Element      | Example                                          |
| ---------- | ------------ | ------------------------------------------------ |
| article    | `<article>`  |                                                  |
| aside      | `<aside>`    | GrailLayoutLeftAside, GrailLayoutRightAside      |
| button     | `<button>`   | Button, ToggleButton, SwitchButton               |
| dialog     | `<dialog>`   | Dialog, AlertDialog, FileDialog                  |
| div        | `<div>`      | PinInputDiv, PasswordInputOrTextInputDiv         |
| fieldset   | `<fieldset>` | Fieldset                                         |
| figure     | `<figure>`   | Figure                                           |
| footer     | `<footer>`   | Footer                                           |
| header     | `<header>`   | Header                                           |
| input      | `<input>`    | TextInput, DateInput, EmailInput                 |
| kbd        | `<kbd>`      |                                                  |
| list       | `<ol>`       | CheckList, TaskList (DoList/DontList use `<ul>`) |
| list-item  | `<li>`       | CheckListItem, TaskListItem                      |
| main       | `<main>`     | GrailLayoutCenterMain                            |
| meter      | `<meter>`    | Meter                                            |
| nav        | `<nav>`      | BreadcrumbNav, TreeNav                           |
| option     | `<option>`   | Option, ThemeSelectOption                        |
| picker     | `<div>`      | ColorPicker, FiveStarRatingPicker                |
| progress   | `<progress>` | Progress                                         |
| select     | `<select>`   | Select, ThemeSelect                              |
| span       | `<span>`     | Flair, Character                                 |
| table      | `<table>`    | Table, DataTable, CalendarTable                  |
| table-thead | `<thead>`   | GanttTableThead (gantt-table only)               |
| table-tbody | `<tbody>`   | GanttTableTbody (gantt-table only)               |
| table-tfoot | `<tfoot>`   | GanttTableTfoot (gantt-table only)               |
| table-tr    | `<tr>`      | GanttTableTr (gantt-table only)                  |
| table-th    | `<th>`      | TableTH, DataTableTH                             |
| table-td    | `<td>`      | TableTD, DataTableTD                             |
| table-head  | `<thead>`   | TableHead, DataTableHead, CalendarTableHead, KanbanTableHead |
| table-body  | `<tbody>`   | TableBody, DataTableBody, CalendarTableBody, KanbanTableBody |
| table-foot  | `<tfoot>`   | TableFoot, DataTableFoot, CalendarTableFoot, KanbanTableFoot |
| table-row   | `<tr>`      | TableRow, DataTableRow, CalendarTableRow, KanbanTableRow |

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
<Form label="Contact" onSubmit={handleSubmit}>
  <Field label="Name" required error={errors.name}>
    <TextInput label="Name" value={name} onChange={setName} />
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
