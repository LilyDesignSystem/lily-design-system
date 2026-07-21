# Conventions — Lily Nunjucks Helpers

Working rules for every helper in this catalog. The
[shared/](./shared/) files inherit from the Lily-wide
`AGENTS/headless.md`, `internationalization.md`, and `theme.md`; this
file lists the Nunjucks-specific decisions layered on top.

## File shape per helper

```
lily-design-system-nunjucks-<name>/
├── spec/index.md                  ← single source of truth, numbered with §
├── AGENTS.md                ← fast-index pointer for agents
├── AGENTS/                  ← per-helper topic agent files
│   ├── api.md
│   ├── lifecycle.md
│   ├── accessibility.md
│   ├── testing.md
│   └── ssr.md
├── CLAUDE.md                ← `@AGENTS.md`
├── index.md                 ← comprehensive human-readable guide
├── {kebab-name}.njk         ← Nunjucks macro file
├── {kebab-name}.client.js   ← runtime ES module
├── {kebab-name}.test.ts     ← vitest spec
├── CHANGELOG.md
├── docs/                    ← topic-by-topic deep-dives
└── examples/                ← runnable `.njk` templates
```

## Macro file shape

Every macro file follows this template:

```njk
{#
  HelperName macro — one-line description.

  HTML tag: <root-element>
  CSS class: kebab-case
  Companion runtime: kebab-name.client.js

  Params (single `opts` object):
    name1 — type, required-ness. Purpose.
    name2 — type. Purpose.
    …

  Usage:
    {% from "./kebab-name.njk" import camelCaseName %}
    {{ camelCaseName({label: "…", …}) }}

  Then load kebab-name.client.js once and call autoInit().

  Spec: spec/index.md §4.1, §4.2.
#}
{%- macro camelCaseName(opts) -%}
{%- set defaultedKey = opts.defaultedKey | default("default-value") -%}
{%- set requiredKey = opts.requiredKey -%}
<root-element
  class="kebab-name{% if opts.classes %} {{ opts.classes }}{% endif %}"
  role="…"
  aria-label="{{ opts.label }}"
  data-lily-kebab-name-root
  data-lily-kebab-name-config="{{ defaultedKey }}"
  {%- if opts.attributes %}{% for k, v in opts.attributes %} {{ k }}="{{ v }}"{% endfor %}{% endif %}
>
{%- for entry in opts.items -%}
  <!-- per-entry markup -->
{%- endfor -%}
</root-element>
{%- endmacro -%}
```

Indentation uses 2 spaces. Whitespace control (`{%-` / `-%}`) is
applied so the output has no spurious leading / trailing whitespace.

## Client.js file shape

```js
// HelperName client-side runtime.
//
// Pairs with kebab-name.njk. See spec/index.md §4.3 (client.js exports),
// §5 (behaviour).

/** Pure helpers — exported for consumer reuse and tests. */
export function pureHelper(arg) { /* … */ }

/**
 * Wire one rendered HelperName select.
 *
 * @param {HTMLElement} root - The [data-lily-kebab-name-root] node.
 * @param {{onChange?: (slug:string)=>void, target?: HTMLElement|null}=} opts
 * @returns {{setValue: (v:string) => void, destroy: () => void}}
 */
export function initHelperName(root, opts = {}) {
    if (typeof document === "undefined" || !root) {
        return { setValue: () => {}, destroy: () => {} };
    }
    // …
}

/** Find every [data-lily-kebab-name-root] and wire it. */
export function autoInit(opts = {}) {
    if (typeof document === "undefined") return [];
    const roots = Array.from(
        document.querySelectorAll("[data-lily-kebab-name-root]"),
    );
    return roots.map((root) => initHelperName(root, opts));
}
```

The split exists so consumers can import either `autoInit()` (the
common case) or `initHelperName(root)` (when they already have a
reference to a single root, e.g. inside another component's
lifecycle).

## Single `opts` parameter

Every macro takes one `opts` object — no positional arguments, no
spread of named keyword arguments. This matches the Lily Nunjucks
convention used in the headless library
([`lily-design-system-nunjucks-headless/AGENTS/nunjucks.md`](../../lily-design-system-nunjucks-headless/AGENTS/nunjucks.md))
and lets consumers compose options via plain JavaScript objects in
Eleventy data files:

```js
// _data/themeChooserOptions.js
export default {
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark", "abyss"],
};
```

```njk
{{ themeChooser(themeChooserOptions) }}
```

## camelCase macro / kebab-case path / kebab-case class

| Aspect              | Convention                                     | Example                |
| ------------------- | ---------------------------------------------- | ---------------------- |
| Macro name          | camelCase (Nunjucks rejects hyphens in idents) | `themeChooser`          |
| File path           | kebab-case                                     | `theme-chooser.njk`     |
| Client.js path      | kebab-case + `.client.js`                      | `theme-chooser.client.js` |
| Root CSS class      | kebab-case                                     | `theme-chooser`         |
| Sub-element classes | kebab-case derivatives                         | `theme-chooser-option`  |
| `data-*` hooks      | `data-lily-<kebab>-…`                          | `data-lily-theme-chooser-root` |

## `data-lily-*` hook attributes

Each macro emits a small set of `data-lily-*` attributes on the
root element that describe the select's configuration. The
companion `*.client.js` reads them on `initHelperName(root)`:

- `data-lily-{name}-root` — identifies the root for `autoInit()`.
- `data-lily-{name}-{kebab-cased-opt}="{value}"` — one per non-empty
  configuration option (storage key, default value, etc.).
- `data-lily-{name}` on the managed `<link>` (theme chooser only)
  serves as a discriminator when multiple selects coexist.

Boolean opts are serialised as the strings `"true"` / `"false"`.
String opts are emitted verbatim (so `themesUrl` round-trips with
its trailing slash if the consumer supplied one).

## Server / client split

The macro renders the markup; the client.js owns the runtime
lifecycle. Specifically:

| Concern                       | Macro | client.js |
| ----------------------------- | ----- | --------- |
| ARIA, role, class hooks       | ✓     | —         |
| Initial `checked` from `value`| ✓     | —         |
| `data-lily-*` configuration   | ✓     | —         |
| Per-option `lang` (locale)    | ✓     | —         |
| `localStorage` read / write   | —     | ✓         |
| `navigator.languages`         | —     | ✓         |
| `document.head` `<link>` swap | —     | ✓         |
| `data-theme` / `lang` / `dir` | —     | ✓         |
| `onChange` callback           | —     | ✓         |

The macro emits zero `<script>` tags; the client.js never emits
HTML. The contract between them is the `data-lily-*` attributes
plus the kebab-case class hooks.

## Class / style fall-through

Macros never invent classes that aren't in the spec. Consumers add
extra classes via `opts.classes` (which the macro appends to the
root) and arbitrary attributes via `opts.attributes` (an object
spread onto the root). Other attribute names are deliberately not
allow-listed; if a consumer wants `id="my-select"`, they pass
`attributes: { id: "my-select" }`.

## Custom rendering

The default macro body emits a sensible default (a native
`<select>` for both helpers). When a consumer needs different
markup, they have two choices:

1. **Caller block** — the macro can be wrapped with `{% call %}` so
   the caller's markup replaces the default option rendering. The
   macro exposes its computed state (resolved value, label
   resolver, etc.) via the `caller()` invocation. See each
   helper's `docs/custom-rendering.md` for the per-helper API.
2. **Use the client.js only** — skip the macro entirely and write
   raw markup with the same `data-lily-*` attributes by hand. The
   client.js doesn't care where the markup came from.

## SSR

Nunjucks **is** the server side. The macro is pure — it never reads
`process.env`, file systems outside the configured loader paths, or
any global state. The client.js wraps every DOM access in a
`typeof document !== "undefined"` guard so importing it in a
non-browser context is safe.

If you need cookie-based persistence for flicker-free first paint,
read the cookie in your Nunjucks host (Eleventy, Express,
Cloudflare Workers) and pass the value to the macro via `opts.value`.

## What never lives in the helper

- Bundled CSS, fonts, icons, or images.
- A locale-aware default for `label` / `placeholder` / `error`.
- Routing, data fetching, persistence wrappers, network calls.
- Animations or transitions.
- Inline `<style>` or `<script>` in the macro output.

Everything visual and locale-specific is the consumer's. See
[`shared/headless-principles.md`](./shared/headless-principles.md).

## Naming

- Class hooks are kebab-case derivatives of the macro name:
  `theme-chooser`, `theme-chooser-option`.
- Data attributes the consumer / CSS may want to observe use
  `data-*` (e.g. `data-theme`, `data-lily-theme-chooser`).
- Don't introduce new ARIA attributes — use the platform's.
