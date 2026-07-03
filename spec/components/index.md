# Components

> Lily Design System specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Lily defines a canonical catalog of 490 components in a single tab-separated file (`components.tsv`), each named and shaped by deterministic suffix-to-HTML-element and compound-name rules, composed via stable parent/child patterns, and documented per component through a fixed nine-section contract.

## Scope

This topic is the single reference for the Lily component catalog and its naming, composition, and documentation rules. It covers:

- The canonical catalog (`components.tsv`) and how to query it.
- The suffix → HTML element mapping that fixes each component's root tag.
- The compound component name patterns (`*Bar`/`*BarButton`, `*List`/`*ListItem`, etc.).
- The composition patterns that snap components together (Form, Grail layout, Navigation, Table).
- The per-component documentation contract: required files and the nine-section `index.md` order, quality standards, and the example-app demo strategy.

Out of scope here: the headless implementation contract ([headless](../headless/index.md)), accessibility rules ([accessibility](../accessibility/index.md)), i18n rules ([internationalization](../internationalization/index.md)), theming ([theme](../theme/index.md)), example apps ([examples](../examples/index.md)), and the helper composition templates ([helpers](../helpers/index.md)).

## Principles and rules

- **One canonical source.** `components.tsv` is authoritative. `AGENTS/components.md` and `index.md` mirror it; the per-framework implementations and per-component docs derive from it. Never maintain a second copy of the catalog.
- **Deterministic markup.** A component's root HTML element is fixed by its slug suffix (see the mapping table). The canonical HTML tag for each component is also recorded in `components/{slug}/AGENTS.md` under "HTML tag" as the single source of truth.
- **Semantic HTML first.** Choose the most specific element (`<button>`, `<dialog>`, `<nav>`, `<figure>`, `<table>`, …) before reaching for `<div>` or `<span>`. ARIA augments only where native semantics fall short.
- **Stable contracts.** Slugs, PascalCase names, base classes, and inner sub-classes are stable across versions. Consumers rely on them; do not rename or remove between versions.
- **Consistent voice.** All 490 component docs follow the same nine-section order and the same headless, framework-agnostic, i18n-clean voice.
- **Count is exact.** The catalog holds exactly 490 components. Any change to the count is a catalog change that must propagate across all 14 implementation subprojects.

## The canonical catalog

The catalog lives in [`components.tsv`](../../components.tsv) at the repo root: 490 tab-separated rows, three columns per row:

```
slug    PascalCaseName    description
```

For example:

```
accordion-checkbox    AccordionCheckbox    a checkbox option that reveals an accordion panel when checked
accordion-link        AccordionLink        an accordion link
accordion-list        AccordionList        an accordion ordered list of list item components
```

- **slug** — kebab-case identifier (e.g., `breadcrumb-list-item`), used for directory names, CSS class hooks, and route paths.
- **name** — PascalCase identifier (e.g., `BreadcrumbListItem`), used for component symbols in every framework.
- **description** — one-sentence summary; the same sentence opens each component's `index.md`.

**Mirrors.** [`AGENTS/components.md`](../../AGENTS/components.md) carries the naming/mapping/composition rules (but points to the TSV for the listing); the repo-root `index.md` provides a linked listing. The seven headless libraries and seven example apps each implement all 490 entries.

**Querying the catalog.** Use the `bin/` tools rather than re-parsing the TSV by hand:

- [`bin/list-components-as-kebab-case`](../../bin/list-components-as-kebab-case) — one slug per line.
- [`bin/list-components-as-pascal-case`](../../bin/list-components-as-pascal-case) — one PascalCase name per line.

See the [tooling](../tooling/index.md) topic for the full script inventory.

**Category overview.** The catalog spans ~60 functional groups: accordion, action, alert/dialog, avatar, banner/callout, breadcrumb, button, calendar, card, chart, chat, code, color, container/layout, contents, data table, date/time, description/summary lists, drawer/sheet/panel, editorial, emoji, email/tel, error/validation, feature flags, file, footer/header, form, gantt, go-to, grail layout, government, healthcare identifiers, hero/mockup/pictogram, interactive controls, kanban, list patterns, measurement, media, menu, notification/toast, overlay, pagination, password/PIN, picker/rating, progress, radio/checkbox, scroll/resize, search/combobox, section navigation, semantic entities, special text, statistic, step/tour/task list, table, tabs, theme, timer, toolbar/taskbar, tree, editable, currency/number/URL, and miscellaneous. The TSV is authoritative for exact membership and counts.

The most recent batches (May 2026) added 80 national personal identifier components (40 identifier types × `-input` + `-view` across 30+ countries) plus five discourse/medical components (`question`, `answer`, `addressograph-box`, `barcode-image`, `draft`); `qr-code` was renamed `qr-code-image`. See [national-identifiers](../national-identifiers/index.md) for the identifier set.

## Suffix → HTML element mapping

The slug suffix fixes the root HTML element. This is the canonical mapping:

| Suffix         | Element      | Example                                                       |
| -------------- | ------------ | ------------------------------------------------------------- |
| `article`      | `<article>`  |                                                               |
| `aside`        | `<aside>`    | GrailLayoutLeftAside, GrailLayoutRightAside                   |
| `button`       | `<button>`   | Button, ToggleButton, SwitchButton                            |
| `dialog`       | `<dialog>`   | Dialog, AlertDialog, FileDialog                               |
| `div`          | `<div>`      | PinInputDiv, PasswordInputOrTextInputDiv                      |
| `fieldset`     | `<fieldset>` | Fieldset                                                      |
| `figure`       | `<figure>`   | Figure                                                        |
| `footer`       | `<footer>`   | Footer                                                        |
| `header`       | `<header>`   | Header                                                        |
| `input`        | `<input>`    | TextInput, DateInput, EmailInput                              |
| `kbd`          | `<kbd>`      | Kbd                                                           |
| `list`         | `<ol>`       | CheckList, TaskList (DoList/DontList use `<ul>`)              |
| `list-item`    | `<li>`       | CheckListItem, TaskListItem                                   |
| `main`         | `<main>`     | GrailLayoutCenterMain                                         |
| `meter`        | `<meter>`    | Meter                                                         |
| `nav`          | `<nav>`      | BreadcrumbNav, TreeNav                                        |
| `option`       | `<option>`   | Option, ThemeSelectOption                                     |
| `picker`       | `<div>`      | ColorPicker, FiveStarRatingPicker                            |
| `progress`     | `<progress>` | Progress                                                      |
| `select`       | `<select>`   | Select, ThemeSelect                                           |
| `span`         | `<span>`     | Flair, Character                                              |
| `table`        | `<table>`    | Table, DataTable, CalendarTable                              |
| `table-head`   | `<thead>`    | TableHead, DataTableHead, CalendarTableHead, KanbanTableHead |
| `table-body`   | `<tbody>`    | TableBody, DataTableBody, CalendarTableBody, KanbanTableBody |
| `table-foot`   | `<tfoot>`    | TableFoot, DataTableFoot, CalendarTableFoot, KanbanTableFoot |
| `table-row`    | `<tr>`       | TableRow, DataTableRow, CalendarTableRow, KanbanTableRow     |
| `table-th`     | `<th>`       | TableTH, DataTableTH                                          |
| `table-td`     | `<td>`       | TableTD, DataTableTD                                          |
| `table-thead`  | `<thead>`    | GanttTableThead (gantt-table only)                           |
| `table-tbody`  | `<tbody>`    | GanttTableTbody (gantt-table only)                           |
| `table-tfoot`  | `<tfoot>`    | GanttTableTfoot (gantt-table only)                           |
| `table-tr`     | `<tr>`       | GanttTableTr (gantt-table only)                              |

Note the two table dialects: most table families use the `-head`/`-body`/`-foot`/`-row`/`-th`/`-td` suffixes, while the Gantt family uses HTML-name suffixes (`-thead`/`-tbody`/`-tfoot`/`-tr`) directly.

## Component name patterns

Compound components follow stable name patterns. The PascalCase prefix is shared; the suffix marks the part.

- **`*Bar` + `*BarButton`** — ActionBar/ActionBarButton, MenuBar/MenuBarButton, TabBar/TabBarButton, TaskBar/TaskBarButton, ToolBar/ToolBarButton.
- **`*Group` + `*GroupItem`** — SegmentGroup/SegmentGroupItem.
- **`*Guide`-style tour** — Tour/TourList/TourListItem.
- **`*List` + `*ListItem`** — CheckList, CollectionList, ContentsList, DescriptionList, DocumentList, DoList, DontList, IconList, PaginationList, SectionList, StepList, SummaryList, ValidationList (each with its `*ListItem`).
- **`*Nav` + `*List` + `*ListItem`** — AccordionNav, BreadcrumbNav, ChatNav, ContentsNav, PaginationNav, SectionNav, TreeNav (each with its `*List` and `*ListItem`).
- **`*Select` + `*SelectOption`** — ThemeSelect/ThemeSelectOption.
- **`*Menu` + `*MenuItem`** — Menu/MenuItem, ContextMenu/ContextMenuItem.
- **`*Input` + `*Link`** — TelInput/TelLink, EmailInput/EmailLink.
- **`*Input` + `*View`** — PostalCodeInput/PostalCodeView, MeasurementInstanceInput/MeasurementInstanceView, and the national-identifier `*-input`/`*-view` pairs.
- **`*Picker` + `*PickerButton`** — ColorPicker, FiveFaceRatingPicker, FiveStarRatingPicker, NetPromoterScorePicker, RedAmberGreenPicker, RedOrangeYellowGreenBluePicker, ThemeSelect (each with its `*PickerButton`).
- **`ContainerWith*`** — ContainerWithFixedWidth, ContainerWithFluidWidth.
- **Table sub-elements** (`*TableHead`/`*TableBody`/`*TableFoot`/`*TableRow`/`*TableTH`/`*TableTD`) — Table, CalendarTable, DataTable, KanbanTable.
- **Gantt sub-elements** (HTML names directly: `*TableThead`/`*TableTbody`/`*TableTfoot`/`*TableTr`/`*TableTH`/`*TableTD`) — GanttTable.

## Composition patterns

Small components snap into larger patterns. Canonical templates also live in [`AGENTS/components-helpers/`](../../AGENTS/components-helpers/) for Avatar, CalendarTable, DataTable, GanttTable, GrailLayout, and KanbanTable; see the [helpers](../helpers/index.md) topic.

### Form: Form → Field → Input

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

### Grail layout: five-region page shell

```tsx
<GrailLayout>
  <GrailLayoutTopHeader>...</GrailLayoutTopHeader>
  <GrailLayoutLeftAside>...</GrailLayoutLeftAside>
  <GrailLayoutCenterMain>...</GrailLayoutCenterMain>
  <GrailLayoutRightAside>...</GrailLayoutRightAside>
  <GrailLayoutBottomFooter>...</GrailLayoutBottomFooter>
</GrailLayout>
```

### Navigation: Nav → List → ListItem

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

This shape applies to breadcrumbs, contents, pagination, sections, tree, chat, and accordion navigation.

### Table: Table → Head/Body → Row → TH/TD

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

## Per-component documentation

### Required files per component directory

Each `components/{slug}/` directory carries:

- `index.md` — human-readable component documentation (nine-section order below).
- `README.md` — symlink to `index.md`.
- `AGENTS.md` — canonical machine-readable metadata (HTML tag, ARIA, keyboard contract, props).
- `CLAUDE.md` — loads `AGENTS.md`.
- `spec/index.md` — spec-driven per-component plan + tasks (replaces the older split `plan.md` / `tasks.md`).

`bin/test` verifies that every component directory and every subproject has its required files. See [testing](../testing/index.md).

### Nine-section `index.md` order

Each `components/{slug}/index.md` includes these sections, in this order:

1. **Title** — PascalCase name.
2. **Description** — one-sentence summary matching the `components.tsv` row.
3. **When to Use** — 3–5 positive-guidance bullets (right choice, user need served, fitting contexts).
4. **When Not to Use** — 2–4 bullets that name a specific Lily alternative, plus anti-patterns and contexts where it does not belong.
5. **Usage** — realistic code example using semantic HTML with proper ARIA; concrete English demo strings flow through the same prop names a consumer would localise.
6. **Props / Slots / Parameters** — name, type, required, description.
7. **ARIA** — roles, states, properties used.
8. **Keyboard** — table of key + action.
9. **References** — links to WAI-ARIA APG, NHS UK, MDN, etc.

### Quality standards

- Lily is headless: guidance is framework-agnostic.
- NHS research informs but does not dictate: adapt for the headless context.
- "When Not to Use" always names specific Lily alternatives.
- Code examples use semantic HTML with proper ARIA.
- No hardcoded user-facing strings in examples — use realistic placeholder content.
- Consistent voice across all 490 components.

### Example-app demo strategy

Each `/components/{slug}` page in an example app renders the component's metadata, a live styled demo with sample data, a usage code snippet, and an import statement. Demo HTML is generated from the slug suffix:

| Suffix pattern              | Demo rendered                                          |
| --------------------------- | ------------------------------------------------------ |
| `*-input`                   | labeled input with appropriate `type`                  |
| `*-button`                  | button element with sample text                        |
| `*-nav`                     | nav element with `aria-label`                          |
| `*-list`                    | ordered list with sample items                         |
| `*-list-item`               | list item with sample content                          |
| `*-table`                   | table with head/body/row structure                     |
| `*-table-head/body/foot/row/td/th` | corresponding table sub-element                 |
| `*-view`                    | span with `role="img"` and sample data                 |
| `*-picker`                  | div with `role="radiogroup"` and sample options        |
| `*-picker-button`           | button within a picker                                 |
| `*-link`                    | anchor element with `href`                             |
| `*-menu`                    | div with `role="menu"`                                 |
| `*-menu-item`               | div with `role="menuitem"`                             |
| standalone                  | semantic HTML based on component type                  |

Each framework injects the generated demo HTML via its native escape hatch: HTML/JS `element.innerHTML`, Svelte `{@html}`, React `dangerouslySetInnerHTML`, Vue `v-html`, Blazor `MarkupString`, Nunjucks `{{ demo | safe }}`. See [examples](../examples/index.md) and [frameworks](../frameworks/index.md).

## Acceptance criteria

- [ ] `components.tsv` holds exactly 490 rows of `slug\tPascalCase\tdescription`.
- [ ] Every component's root HTML element matches the suffix → element mapping and its `components/{slug}/AGENTS.md` "HTML tag" field.
- [ ] Every compound component follows the documented name patterns; no orphan parts.
- [ ] Every `components/{slug}/` has `index.md`, `README.md` (symlink), `AGENTS.md`, `CLAUDE.md`, and `spec/index.md`.
- [ ] Every `index.md` follows the nine-section order with separate "When to Use" and "When Not to Use" sections.
- [ ] Every "When Not to Use" section names a specific Lily alternative.
- [ ] `bin/list-components-as-kebab-case` and `-as-pascal-case` enumerate all 490 entries.
- [ ] `bin/test` passes for the catalog, all components, and all subprojects.
- [ ] Each example app's `/components/{slug}` page renders a suffix-appropriate live demo for every component.

## Related topics

- [overview](../overview/index.md) — the design system at a glance.
- [headless](../headless/index.md) — the unstyled implementation contract these components follow.
- [helpers](../helpers/index.md) — canonical composition templates for compound components.
- [accessibility](../accessibility/index.md) — ARIA and keyboard rules the catalog enforces.
- [internationalization](../internationalization/index.md) — text-prop naming used in component APIs.
- [theme](../theme/index.md) — how themes style the class hooks these components expose.
- [examples](../examples/index.md) — the demo pages that render each catalog entry.
- [frameworks](../frameworks/index.md) — per-framework implementation notes.
- [national-identifiers](../national-identifiers/index.md) — the 80 `-input`/`-view` identifier components.
- [tooling](../tooling/index.md) — `bin/` scripts that list and scaffold catalog entries.
- [testing](../testing/index.md) — how `bin/test` and per-framework suites verify the catalog.

## Sources

- [`components.tsv`](../../components.tsv) — canonical 490-row catalog.
- [`AGENTS/components.md`](../../AGENTS/components.md) — suffix mapping, name patterns, composition patterns.
- [`AGENTS/components-helpers/`](../../AGENTS/components-helpers/) — composition templates (avatar, calendar-table, data-table, gantt-table, grail-layout, kanban-table).
- [`spec/index.md`](../index.md) — §5 catalog, §6 naming, §7 composition, §8 per-component documentation.
- [`bin/list-components-as-kebab-case`](../../bin/list-components-as-kebab-case), [`bin/list-components-as-pascal-case`](../../bin/list-components-as-pascal-case) — catalog query tools.
