# Filter (Angular helper)

A headless filter builder for Angular: the user composes **conditions** (a field, an operator, a value) into **groups** joined by *and* / *or*, and the result comes out as **JSON, SQL, MongoDB, OData** or an in-memory **predicate**. It ships semantic HTML, ARIA and focus management, **no CSS**, and **no English**: every string is a prop.

Source: [lily-design-system](https://github.com/LilyDesignSystem/lily-design-system), package `@lilydesignsystem/angular-filter`. Contract: [spec/index.md](spec/index.md).

## Install

```sh
npm install @lilydesignsystem/angular-filter
```

## Quick start

```ts
import { Component, computed, signal } from "@angular/core";
import { Filter, EMPTY_FILTER, toSql, toPredicate, type FilterField, type FilterLabels } from "@lilydesignsystem/angular-filter";

@Component({
    selector: "app-people",
    imports: [Filter],
    template: `<lily-filter label="Filter people" [fields]="fields" [(value)]="filter" [labels]="labels" format="sql" dialect="postgres" />`,
})
export class People {
    readonly fields: FilterField[] = [
        { id: "name", label: "Name" },
        { id: "age", label: "Age", type: "number" },
        { id: "joined", label: "Joined", type: "date", column: "joined_on" },
        { id: "team", label: "Team", type: "select", options: [{ id: "red", label: "Red" }, { id: "blue", label: "Blue" }] },
        { id: "active", label: "Active", type: "boolean" },
    ];
    readonly labels: FilterLabels = { /* see Labels */ } as FilterLabels;
    readonly filter = signal(EMPTY_FILTER());
    readonly where = computed(() => toSql(this.filter(), this.fields, { dialect: "postgres" })); // { sql, params }
    readonly passes = computed(() => toPredicate(this.filter(), this.fields));                    // (row) => boolean
}
```

`labels` is required and has no default (see [Labels](#labels)).

## Fields and operators

| Type | Value | Operators |
| ---- | ----- | --------- |
| `text` (default) | text | contains, does not contain, equals, not equals, starts with, ends with, is empty, is not empty |
| `number` | number | equals, not equals, **greater than**, **at least** (lower limit), **less than**, **at most** (upper limit), **between**, not between, is empty, is not empty |
| `date` | ISO `YYYY-MM-DD` | the same as `number` — a date range is `between` |
| `select` | an option id | equals, not equals, **is one of**, **is none of**, is empty, is not empty |
| `boolean` | — | is true, is false, is empty, is not empty |

A field's `operators` can restrict the list (`operators: ["gte", "lte"]` for a limit-only field), `column` names it in SQL / MongoDB / OData, and `options` supplies a `select`'s choices.

## Output

All pure functions over the filter value — use them with or without the component:

| Function | Result |
| -------- | ------ |
| `toJson(filter, fields)` | plain, id-free `{ combinator, not?, rules: [...] }`, or `null` when empty; `fromJson` reads it back (reporting what it cannot) |
| `toSql(filter, fields, { dialect, inline })` | `{ sql, params }` — the `WHERE` condition without the word; values are **parameters** (`?`, `$1`, `@p1` by dialect) |
| `toMongo(filter, fields)` | a MongoDB query document |
| `toOData(filter, fields)` | an OData `$filter` expression |
| `toPredicate(filter, fields)` | `(row) => boolean` over rows keyed by field id; an empty filter passes every row |
| `formatFilter(filter, fields, format, dialect)` | any of them as display text (SQL with values inline) |

An **incomplete** condition (no value yet, a bad date, a range the wrong way round) is a normal state while the user types: it is shown, flagged by nothing, and **left out of every output** until it is finished. Dialects: `ansi`, `postgres`, `mysql`, `sqlite`, `mssql`.

### SQL safety

Values are always parameters. Column names come only from the declared `fields`, and must be plain identifiers (letters, digits, `_`, dots) or `toSql` throws `FilterError`. `LIKE` text has `%`, `_` and `\` escaped. `inline: true` writes the values into the text with quotes doubled — **for showing and logging only, never for running against a database**.

## Labels

```ts
const labels: FilterLabels = {
    rule: (n) => `Condition ${n}`,          group: (depth) => `Group, level ${depth}`,
    field: "Field",                          operator: "Operator",
    operatorName: (op) => names[op],         value: "Value", valueFrom: "From", valueTo: "To",
    combinator: "Match", and: "all", or: "any", not: "Not",
    addRule: "Add condition", addGroup: "Add group",
    removeRule: (n) => `Remove condition ${n}`, removeGroup: (depth) => `Remove group, level ${depth}`,
    // optional: choose, empty, output (names the text output), ruleAdded / ruleRemoved / groupAdded / groupRemoved (announcements)
};
```

## Behaviour

- Markup: a labelled `group` per level; each condition a `group` named by `labels.rule(n)` holding named `<select>`s and an input of the type's kind (`text`, `number`, `date`, a `<select>`, or a checkbox list for *is one of*); add and remove are real buttons.
- Focus: adding a condition focuses its field select; removing one returns focus to the group's *Add condition*.
- Announcements through a polite status region, only when the label is given.
- `readonly` shows the filter without controls to change it; `maxDepth` (default 3) bounds nesting.
- The value is immutable data: every change is a new object, and what did not change is shared, so `[(value)]` works with a signal, a store or a URL.

## Styling hooks

`filter`, `filter-group`, `filter-group-header`, `filter-combinator`, `filter-not`, `filter-rules`, `filter-item`, `filter-rule`, `filter-field`, `filter-operator`, `filter-value`, `filter-value-to`, `filter-choices`, `filter-choice`, `filter-add-rule-button`, `filter-add-group-button`, `filter-remove-rule-button`, `filter-remove-group-button`, `filter-empty`, `filter-output`, `filter-output-text`, `filter-status`; `data-depth`, `data-readonly`, `data-format`.

## Non-goals

Saved filters and persistence, a server round trip, free-text query parsing, locale-aware number and date entry (the consumer's input), and drawing — all the consumer's.
