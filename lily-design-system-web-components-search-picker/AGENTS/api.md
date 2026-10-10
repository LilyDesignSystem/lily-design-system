# API — `<lily-search-picker>` (HTML helper)

Canonical table: [`../spec/index.md` §4](../spec/index.md#4-public-api).
This file is the agent-facing summary.

## Attributes → properties

| Attribute      | Property      | Type   | Default                      |
| -------------- | ------------- | ------ | ---------------------------- |
| `label`        | `label`       | string | `""` (required in practice)  |
| `input-label`  | `inputLabel`  | string | `""` (required in practice)  |
| `submit-label` | `submitLabel` | string | `""` (required in practice)  |
| `placeholder`  | `placeholder` | string | none — no attribute rendered |
| `value`        | `value`       | string | `""` — see below             |
| `action`       | `action`      | string | `"/"`                        |
| `class`        | —             | string | `""`                         |

Writing a property writes the attribute; reading reads it — except
`value`, which follows native `<input>` semantics: the attribute seeds,
typing and property writes change only the live value.

## Property-only

| Member                  | Notes                                                  |
| ----------------------- | ------------------------------------------------------ |
| `navigate(href)`        | Default `location.assign(href)`.                       |
| `onSearch(query, href)` | Fires before the `search` event and before navigating. |

## Read-only and methods

`open`, `panelId`; `openPanel()`, `closePanel(refocus = true)`,
`renderButtonContent()` (override to replace the icon).

## Event

`search` — bubbling, composed `CustomEvent<{ query, href }>`.
