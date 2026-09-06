---
name: lily-design-system-angular-headless-skill
description: Use when someone asks how to install or import Lily Design System's Angular headless components, wants the Angular-specific usage idiom (standalone components, element selectors, the tag+attribute-selector convention for list/table sub-elements), needs to know what's different about consuming Lily in an Angular app, or asks why a `*ListItem` or table sub-element component is used as `<li lily-breadcrumb-list-item>` instead of `<lily-breadcrumb-list-item>`.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — Angular headless usage

`lily-design-system-angular-headless` is the Angular implementation of the
Lily Design System's headless component library: the full 491-component
catalog (`components.tsv`), each shipped as a standalone Angular component
with zero CSS — semantic HTML, ARIA, and keyboard behaviour only. It is one
of the seven **full-catalog** headless libraries (HTML, Svelte, React, Vue,
Angular, Blazor, Nunjucks); unlike the partial Web Components catalog
(456/491, its full achievable scope), Angular ships the entire catalog.

Published to npm as `lily-design-system-angular-headless`:

```sh
pnpm add lily-design-system-angular-headless
```

```ts
import { Button, TextInput } from "lily-design-system-angular-headless";

@Component({
  standalone: true,
  imports: [Button, TextInput],
  template: `
    <lily-text-input label="Email" [(value)]="email" />
    <lily-button>Submit</lily-button>
  `,
})
export class MyForm {
  email = "";
}
```

## The Angular-specific idiom

- **Standalone components only** — no NgModules. Every component is
  imported directly into the consumer's own standalone component's
  `imports` array.
- **Signal-based inputs/outputs** — `input()`, `output()`, `model()` for
  two-way binding (`[(value)]="x"`).
- **`ChangeDetectionStrategy.OnPush`** on every component.
- **Element selectors** — most components declare `selector:
  "lily-{kebab-slug}"` and are used as their own dashed tag,
  e.g. `<lily-button>`, `<lily-breadcrumb-nav>`.

### The tag+attribute-selector exception (51 components)

Most Lily components are simple wrappers, so an element-selector custom tag
around their native element is harmless. But 51 components sit **between** a
parent and child with a required content-model relationship: the 20
`*ListItem` families (`BreadcrumbListItem`, `TreeListItem`, …), the 30 table
sub-elements across `Table`/`DataTable`/`CalendarTable`/`KanbanTable`/
`GanttTable` (`*TableHead`, `*TableBody`, `*TableRow`, `*TableTH`, `*TableTD`,
and the gantt `*Thead`/`*Tbody`/`*Tr`/`*TH`/`*TD` variants), and `Option`.
An `<ol>` containing `<lily-breadcrumb-list-item>` instead of a direct `<li>`
breaks the list/listitem parent-child relationship axe (and assistive
technology) expects — this was a real defect found and fixed
(angular-headless 0.3.0, a breaking change) via the library's own axe sweep.

These 51 components instead declare a **combined tag+attribute selector on
the native element itself** — e.g. `selector: "li[lily-breadcrumb-list-item]"`
— so the consumer writes the real HTML tag directly, with the Lily component
attached as an attribute:

```html
<ol lily-breadcrumb-list>
  <li lily-breadcrumb-list-item><a href="/">Home</a></li>
  <li lily-breadcrumb-list-item [current]="true">Page</li>
</ol>
```

```html
<table lily-table>
  <thead lily-table-head>
    <tr lily-table-row>
      <th lily-table-th [scope]="'col'">Name</th>
    </tr>
  </thead>
</table>
```

Two consequences worth remembering when writing this markup:

- Any attribute the host also binds (`class`, `scope`, `value`, …) **must**
  be passed through the component's input, never as a competing static HTML
  attribute — the host binding re-evaluates every change-detection cycle and
  overwrites a static attribute of the same name. `<th lily-table-th
  scope="col">` silently loses its scope; `<th lily-table-th
  [scope]="'col'">` is correct.
- Only the child needed this treatment — the parent container (`*List`,
  `*Table`, `*TableHead`/`Body`/`Foot`, `Select`) keeps the plain element
  selector.

## Theming and class hooks

Angular headless components follow the same theming contract as every other
Lily catalog: each root element carries a fixed kebab-case base class (e.g.
`.breadcrumb-nav`) plus the consumer's optional `className` input, and that
class is the *only* styling contract — no bundled CSS, fonts, icons, or
Angular Material dependency. Pair the class hooks with one of the 45
reference stylesheets under `themes/`, or write your own CSS against them.

## Naming, suffixes, and composition

The suffix→HTML-element mapping (`-button` → `<button>`, `-list-item` →
`<li>`, `-table` family → the table elements, …) and the compound name
families (`*List`/`*ListItem`, `*Nav`/`*List`/`*ListItem`, `*Picker`/
`*PickerButton`, table sub-elements, and more) are catalog-wide, not
Angular-specific — see `AGENTS/components.md` in the canonical monorepo (or
the equivalent reference in `lily-design-system-skill`) for the full
mapping and worked composition examples (Form, Grail layout, Navigation,
Table). This skill does not restate them.

## When NOT this skill

- For the `theme-picker`, `locale-picker`, `text-size-picker`,
  `motion-picker`, `share-picker`, and `date-time-picker` helpers (the
  `lily-design-system-angular-*-picker` packages) — use
  `lily-design-system-angular-helpers-skill` instead.
- For framework-agnostic Lily concepts, terminology, the headless-vs-example
  layers, or picking a framework — use `lily-design-system-skill`.
