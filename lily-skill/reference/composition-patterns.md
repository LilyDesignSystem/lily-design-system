# Composition patterns

Lily components snap together into a handful of recurring shapes. These are
condensed from `AGENTS/components.md`; every example uses concrete demo
strings, but they flow through the same prop names a real consumer would
localise (see the internationalisation rule: no hardcoded user-facing
strings inside a component — the *examples* below supply the strings, the
components themselves never do).

## Form: `Form` → `Field` → `{Label, Input, Hint, ErrorMessage}`

```tsx
// React
<Form label="Contact" onSubmit={handleSubmit}>
  <Field label="Name" required error={errors.name}>
    <TextInput label="Name" value={name} onChange={setName} />
  </Field>
  <ErrorSummary title="There is a problem">
    <ul>{errorList}</ul>
  </ErrorSummary>
  <Button type="submit">Submit</Button>
</Form>
```

```svelte
<!-- Svelte -->
<Form label="Contact" onsubmit={handleSubmit}>
  <Field label="Name" required error={errors.name}>
    <TextInput label="Name" bind:value={name} />
  </Field>
  <ErrorSummary title="There is a problem">
    <ul>{#each errorList as e}<li>{e}</li>{/each}</ul>
  </ErrorSummary>
  <Button type="submit">Submit</Button>
</Form>
```

## Navigation: `*Nav` → `*List` → `*ListItem`

```html
<!-- Plain HTML -->
<nav class="breadcrumb-nav" aria-label="Breadcrumb">
  <ol class="breadcrumb-list">
    <li class="breadcrumb-list-item"><a href="/">Home</a></li>
    <li class="breadcrumb-list-item" aria-current="page">Page</li>
  </ol>
</nav>
```

The same three-level shape (`*Nav`/`*List`/`*ListItem`) covers
AccordionNav, ChatNav, ContentsNav, PaginationNav, SectionNav, and TreeNav —
only the semantics of what's inside each `*ListItem` change.

## Table: `Table` → `Head`/`Body` → `Row` → `TH`/`TD`

```tsx
<DataTable label="Users">
  <DataTableHead>
    <DataTableRow>
      <DataTableTH>Name</DataTableTH>
    </DataTableRow>
  </DataTableHead>
  <DataTableBody>
    <DataTableRow>
      <DataTableTD>Ada Lovelace</DataTableTD>
    </DataTableRow>
  </DataTableBody>
</DataTable>
```

The same shape underlies `Table`, `CalendarTable`, `DataTable`, and
`KanbanTable`. `GanttTable` is the one exception — its sub-elements are
spelled with plain HTML names (`GanttTableThead`, `GanttTableTbody`, …)
instead of the `*TableHead`/`*TableBody` convention.

## Page shell: `GrailLayout` (the five-region "holy grail" layout)

```tsx
<GrailLayout>
  <GrailLayoutTopHeader>…</GrailLayoutTopHeader>
  <GrailLayoutLeftAside>…</GrailLayoutLeftAside>
  <GrailLayoutCenterMain>…</GrailLayoutCenterMain>
  <GrailLayoutRightAside>…</GrailLayoutRightAside>
  <GrailLayoutBottomFooter>…</GrailLayoutBottomFooter>
</GrailLayout>
```

## Bigger, worked examples

The example apps' composed pages are the best full-length references — each
wires several component families together against a real page: a
`book-an-appointment` five-step wizard (StepList, RadioGroup, DateInput,
Select, SummaryList, ErrorSummary, SuccessPanel), a `dashboard` (Card,
Progress, Badge, Banner, DataTable), a `settings-page` (SwitchButton,
RadioGroup, Fieldset, Banner), and more. Browse any framework's example
app under `/{page-name}` for the full markup.
