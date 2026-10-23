# MiddleTruncation

A string shortened in the middle to fit its container, keeping the start and the end; the full text stays in the accessibility tree.

Full documentation: [components/middle-truncation/index.md](../../../components/middle-truncation/index.md).

## Server rendering

A server cannot measure a width, so the macro renders the markup contract only: the full text in `.middle-truncation-visual` (`aria-hidden`) and in `.middle-truncation-full`, with `data-ellipsis`, `data-strategy` and `data-end`. The browser does the shortening: include the script from `html-headless`'s `middle-truncation.html` (it reads these attributes) or use the Web Components element. With neither, the full text is shown. To shorten on the server, pass `shortened`.

## Params

- `text` (required), `ellipsis` (required, no default), `strategy` (`"even"` | `"fixed-end"` | `"min-end"`, default `"even"`), `end`, `shortened`, `id`, `classes`, `attributes`

## Usage

```njk
{% from "components/middle-truncation/macro.njk" import middleTruncation %}
{{ middleTruncation({ text: "quarterly-report-final-version-3.pdf", ellipsis: "…", strategy: "min-end", end: 6 }) }}
```

## Files

- `macro.njk` — the macro
- `macro.test.js` — vitest + jsdom tests
- `macro.stories.ts` — Storybook story
