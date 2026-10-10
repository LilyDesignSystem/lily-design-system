# SSR and the first paint

Nunjucks **is** the server side. The macro produces a static HTML string
at render time; the browser parses and paints it;
`search-picker.client.js` then takes over for the interaction.

## What works without JavaScript

Nothing, and it is worth being exact about why:

- **The panel cannot be opened.** It is rendered with the `hidden`
  attribute and nothing server-side removes it. The icon button has no
  handler, so clicking it, or pressing `Enter` / `Space` on it, does
  nothing.
- **Even if the form were reachable, it would not produce `/?<query>`.**
  A native GET submission sends `name=value` pairs, and the field
  deliberately carries no `name` — the canonical contract is the bare
  query, which only script can produce.

This matches the canonical Svelte helper, whose panel is also closed on
first render. If your site needs search to work without JavaScript,
render your own always-visible `<form role="search">` with a named field
(and accept the `/?q=foo` shape that native forms produce).

## The macro is pure

Rendering reads nothing ambient — no `document`, `localStorage`, or
`navigator` — and emits deterministic ids derived from `name` / `id`, so
the same call produces byte-identical output on every render. Two
instances on one page need distinct `name`s or explicit `id`s.

## Wiring into a host

Make `search-picker.njk` resolvable by your environment's loader (for
example by adding `node_modules/@lilydesignsystem/nunjucks-search-picker/dist`
to the search path), serve the client module, and call `autoInit()` once
after the markup is in the document:

```njk
{% from "search-picker.njk" import searchPicker %}
{{ searchPicker({label: "Search this site", inputLabel: "Search terms", submitLabel: "Search"}) }}

<script type="module">
    import { autoInit } from "/js/search-picker.client.js";
    autoInit();
</script>
```

Markup inserted later (client-side routing, fragments) is wired with
`initSearchPicker(root, opts)`; call the returned `destroy()` before
removing it.
