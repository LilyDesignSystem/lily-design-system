# Filter — specification

`@lilydesignsystem/svelte-filter` 0.1.0 (2026-10-17). A headless filter builder and the serializers that make its result usable.

## 1. Goal

Let a user build a filter from typed conditions — a text field, a number range, a date range, an upper or lower limit, a choice — grouped with *and* / *or* / *not*, and hand the result to whatever applies it: a SQL `WHERE`, a MongoDB query, an OData `$filter`, JSON for an API, or a predicate for rows already in memory (the data grid's `rowFilter`, the kanban board's `filter`, the Gantt chart's and calendar's `filter`).

## 2. Scope

In: the model (§3), the editing functions (§4), validation (§5), the five outputs (§6–§9), the component (§10).
Out: persistence, parsing a typed query string, locale-aware entry, network. Styling, fonts and icons: none shipped.

## 3. The model

A filter is a `FilterGroup { type: "group", id, combinator: "and" | "or", not?, children }`; a child is a `FilterGroup` or a `FilterRule { type: "rule", id, field, operator, value?, value2? }`. Fields are `FilterField { id, label, type?, options?, column?, operators? }`; `type` is `text` (default), `number`, `date`, `select` or `boolean`.

Operators (stable ids, English-free): `contains`, `not-contains`, `equals`, `not-equals`, `starts-with`, `ends-with`, `gt`, `gte`, `lt`, `lte`, `between`, `not-between`, `in`, `not-in`, `is-empty`, `is-not-empty`, `is-true`, `is-false`. `gte` and `lte` are the lower and upper limits. `valueArity(op)` is 0, 1, 2 (a range) or `"many"` (a list). Dates are ISO `YYYY-MM-DD` strings; numbers are numbers; no locale is assumed.

## 4. Editing

Pure and immutable: `createRule(fields, fieldId?)`, `createGroup(combinator, children)`, `addNode(root, parentId, node)`, `updateNode(root, id, change)`, `removeNode(root, id)`, `changeField` (resets values; keeps an operator the new field also offers), `changeOperator` (drops values the new arity does not need; keeps a list only for `in` / `not-in`), `rulesOf`. Nodes that did not change are shared, not copied.

## 5. Validation

`ruleIssue(rule, fields)` is `undefined` or one of `unknown-field`, `unknown-operator`, `missing-value`, `invalid-value`, `range-order`, `unknown-option`. Number values must be finite numbers, dates real ISO dates (`2026-02-31` is not one), a select's value an option id, a range ordered low to high. `normalise(group, fields)` drops rules with an issue, then groups left empty, and returns `null` when nothing is left. **Every output is made from the normalised tree**: an unfinished condition is a normal state while typing and never reaches an output.

## 6. JSON

`toJson` → `{ combinator, not?: true, rules: [...] }` where a rule is `{ field, operator, value?, value2? }` (values only where the operator takes them); `null` when empty. No ids. `fromJson(json, fields)` returns `{ group, errors }` with fresh ids, reporting each node it cannot read (`$.rules[1]: invalid-value`) rather than guessing; the round trip of `toJson` output is exact.

## 7. SQL

`toSql(group, fields, { dialect = "ansi", inline = false })` → `{ sql, params }`: the condition without `WHERE`; `{ sql: "", params: [] }` when empty.

- **Values are parameters**: `?` (ansi, mysql, sqlite), `$1` (postgres), `@p1` (mssql). Booleans are `1` / `0` for mssql and sqlite.
- **Identifiers** are quoted per dialect (`"x"`, `` `x` ``, `[x]`), come only from the declared fields' `column ?? id`, and must match `^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*$` or `toSql` throws `FilterError` — a column name is never quoted around.
- **Text** matches case-insensitively: `ILIKE` (postgres) or `LOWER(col) LIKE LOWER(?)`, with `%`, `_` and `\` in the value escaped and `ESCAPE '\'` (written `'\\'` for MySQL, whose string literals escape the backslash). `equals` on text compares `LOWER` both sides.
- Ranges are `BETWEEN` / `NOT BETWEEN`; lists `IN (?, ?)`; *is empty* is `IS NULL` (text: `IS NULL OR = ''`).
- Nesting is parenthesised; a negated group is `NOT (…)`.
- `inline: true` writes values into the text with single quotes doubled, for display and logging only — documented, tested, never for execution.

## 8. MongoDB

`toMongo` → a query document: `$and` / `$or` of the parts (a lone part is not wrapped), `$nor: [body]` for a negated group, `{ $regex, $options: "i" }` for text (value regex-escaped), `$gte`/`$lte` for between, `$in`/`$nin`, `null` / `""` for empty. `{}` when empty. `column` names the key.

## 9. OData and predicate

`toOData` → a `$filter` string (`contains(tolower(name),tolower('x'))`, `age ge 1 and age le 5`, `not (…)`, strings with quotes doubled, dates as bare ISO literals); `""` when empty. `toPredicate` → `(row) => boolean` over rows keyed by field id: text is case- and diacritic-blind (the shared `foldText`), numbers compare numerically, dates and everything else as text (ISO dates sort as text), a missing value matches only the negative operators (`not-equals`, `not-between`, `is-empty`, …); an empty filter passes every row. `formatFilter(group, fields, format, dialect)` renders any output as display text.

## 10. The component

`<Filter label fields bind:value labels onChange? format? dialect? maxDepth? readonly? />`.

- **Markup**: root `div.filter[role=group][aria-label]`; each level `div.filter-group[role=group]` named `labels.group(depth)` with a header (`select.filter-combinator`, `label.filter-not`, a remove button for nested groups), `ul.filter-rules` of `li.filter-item`, and `div.filter-group-actions` (add condition, add group). A condition is `div.filter-rule[role=group]` named `labels.rule(n)` — the number is its place in reading order across the whole filter — holding `select.filter-field`, `select.filter-operator`, the value editor, and `button.filter-remove-rule-button`.
- **Value editors** follow the field: `input[type=text|number|date].filter-value`, `select.filter-value` for one choice, `div.filter-choices[role=group]` of checkboxes for *is one of*, two inputs (`.filter-value`, `.filter-value-to`; named `labels.valueFrom` / `valueTo`) for a range, none for operators without a value.
- **State** is the immutable `value` (bindable) and `onChange(group)`; every edit is a new object. Changing the field or operator follows §4.
- **Focus**: adding a condition focuses its field select; adding a group focuses its first condition; removing returns focus to the group's *Add condition*.
- **Announcements** (polite status region, only for labels that are given): `ruleAdded(n)`, `ruleRemoved(n)`, `groupAdded(depth)`, `groupRemoved(depth)`.
- **`format`** (with `labels.output`) shows the filter as text in a named group (`pre.filter-output-text`, `data-format`), recomputed from the normalised tree; `dialect` applies to SQL.
- **`readonly`**: controls are disabled / read-only and add and remove buttons are not rendered. **`maxDepth`** (default 3) removes *Add group* at the deepest level.
- **i18n**: every string is in `labels`; operator names come from `labels.operatorName(op, field)`; there is no default English and no default locale.
- **SSR-safe**, no browser APIs outside event handlers and focus.

## 11. Acceptance

Tests §8.1–§8.29 in `Filter.test.ts`; the model's tests in `filter-model.test.ts` (operators, editing, validation, predicate, JSON round trip, the SQL dialects, quoting, escaping and the injection cases, MongoDB, OData); `search-text.test.ts` for the shared text folding.

## 12. Sources

- [OWASP SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) — parameterised values, identifier allow-listing.
- [WAI-ARIA APG: Grouping and landmarks](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/) — named groups for repeated controls.
- [OData 4.01 URL conventions: `$filter`](https://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part2-url-conventions.html).
- [MongoDB query operators](https://www.mongodb.com/docs/manual/reference/operator/query/).

## 13. Language and direction

`ALL_OPERATORS` lists every operator id so an app can assert that its `labels.operatorName` names them all in each language (an unnamed operator would show its id). The component is tested with a complete Chinese bundle (no English word in anything a user reads or hears, other than the code in the output) and right to left (the same controls in the same order; no physical `left` / `right` in an inline style; the builder is native `<select>`s, inputs and buttons, so the browser handles their direction and there is no arrow-key model to flip).

