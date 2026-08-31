# Naming conventions and catalog reference

Condensed from the canonical `AGENTS/components.md` and `components.tsv` in
the monorepo. Load this file when a question needs the full suffix table or
the compound name-family patterns, rather than the short list in SKILL.md.

## Suffix → HTML element mapping

| Suffix | Element | Example |
| --- | --- | --- |
| `-article` | `<article>` | |
| `-aside` | `<aside>` | GrailLayoutLeftAside |
| `-button` | `<button>` | Button, ToggleButton, SwitchButton |
| `-dialog` | `<dialog>` | Dialog, AlertDialog, FileDialog |
| `-div` | `<div>` | PinInputDiv |
| `-fieldset` | `<fieldset>` | Fieldset |
| `-figure` | `<figure>` | Figure |
| `-footer` | `<footer>` | Footer |
| `-header` | `<header>` | Header |
| `-input` | `<input>` | TextInput, DateInput, EmailInput |
| `-kbd` | `<kbd>` | |
| `-list` | `<ol>` | CheckList, TaskList (DoList/DontList use `<ul>`) |
| `-list-item` | `<li>` | CheckListItem, TaskListItem |
| `-main` | `<main>` | GrailLayoutCenterMain |
| `-meter` | `<meter>` | Meter |
| `-nav` | `<nav>` | BreadcrumbNav, TreeNav |
| `-option` | `<option>` | Option, ThemeSelectOption |
| `-picker` | `<div>` | ColorPicker, FiveStarRatingPicker |
| `-progress` | `<progress>` | Progress |
| `-select` | `<select>` | Select, ThemeSelect |
| `-span` | `<span>` | Flair, Character |
| `-table` | `<table>` | Table, DataTable, CalendarTable |
| `-table-head`/`-body`/`-foot`/`-row`/`-th`/`-td` | `<thead>`/`<tbody>`/`<tfoot>`/`<tr>`/`<th>`/`<td>` | TableHead, DataTableRow, … |
| `-table-thead`/`-tbody`/`-tfoot`/`-tr`/`-th`/`-td` | same, HTML-spelled | GanttTable's sub-elements only |

## Compound name-family patterns

- `*Bar` `*BarButton` — ActionBar/ActionBarButton, MenuBar/MenuBarButton, TabBar/TabBarButton, TaskBar/TaskBarButton, ToolBar/ToolBarButton
- `*Group` `*GroupItem` — SegmentGroup/SegmentGroupItem
- `*Guide` `*GuideList` `*GuideListItem` — Tour/TourList/TourListItem
- `*List` `*ListItem` — CheckList, CollectionList, ContentsList, DescriptionList, DocumentList, DoList, DontList, IconList, PaginationList, SectionList, StepList, SummaryList, ValidationList (each with a matching `*ListItem`)
- `*Nav` `*List` `*ListItem` — AccordionNav, BreadcrumbNav, ChatNav, ContentsNav, PaginationNav, SectionNav, TreeNav (each a three-level family)
- `*Select` `*SelectOption` — ThemeSelect/ThemeSelectOption
- `*Menu` `*MenuItem` — ContextMenu/ContextMenuItem, Menu/MenuItem
- `*Input` `*Link` — TelInput/TelLink, EmailInput/EmailLink
- `*Picker` `*PickerButton` — ColorPicker, FiveFaceRatingPicker, FiveStarRatingPicker, NetPromoterScorePicker, RedAmberGreenPicker, RedOrangeYellowGreenBluePicker
- `*Input` `*View` — PostalCodeInput/PostalCodeView, MeasurementInstanceInput/MeasurementInstanceView
- `ContainerWith*` — ContainerWithFixedWidth, ContainerWithFluidWidth
- Table sub-elements — `*TableHead`/`*TableBody`/`*TableFoot`/`*TableRow`/`*TableTH`/`*TableTD` on Table, CalendarTable, DataTable, KanbanTable; GanttTable spells its own sub-elements with plain HTML names (`*TableThead`, `*TableTbody`, …)

## Catalog by category (491 components)

| Category | Count | Examples |
| --- | --- | --- |
| Content | 149 | Byline, Headline, ContentBlock, FeaturePhoto, Scroller* |
| National personal identifiers | 92 | 46 identifier types × `-input`/`-view` across 30+ countries |
| Forms | 55 | TextInput, Field, ErrorSummary, Fieldset, RadioGroup |
| Navigation | 53 | BreadcrumbNav, TabBar, AccordionNav, PaginationNav |
| Lists | 39 | CheckList, SummaryList, TaskList, TreeList |
| Tables | 36 | DataTable, CalendarTable, GanttTable, KanbanTable |
| Links | 16 | TelLink, EmailLink, AccordionLink |
| Pickers | 14 | ColorPicker, FiveStarRatingPicker, NetPromoterScorePicker |
| Overlays | 14 | Dialog, AlertDialog, Drawer, Tooltip |
| Media | 8 | VideoPlayer, Figure, TileMap |
| Buttons | 8 | Button, ToggleButton, SwitchButton |
| Data visualisation | 7 | Meter, Progress, ProgressCircle |

The authoritative source is `components.tsv` in the canonical repo (one row
per component: slug, PascalCase name, description) — this table is a
snapshot for orientation, not a substitute for it.
