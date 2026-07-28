# Custom rendering

The macro owns the root `<div>`, the hidden input, the button's ARIA
attributes, and the listbox. The one thing it hands over is the
**button's glyph**. Three levels of customisation are available,
in increasing order of how much you take on:

1. **Caller block** — replace the glyph with your own icon. The
   supported, recommended path.
2. **CSS only** — keep the default glyph and restyle everything.
3. **Hand-written markup + client.js** — skip the macro entirely and
   emit the DOM contract yourself.

## Pattern 1: caller block (the glyph override)

Nunjucks templates are strings and cannot pass first-class
functions, so `{% call %}` is the language's equivalent of
"children". The macro checks `caller` and, when present, renders the
block body **inside the button** in place of the default
`<span class="theme-picker-icon">`:

```njk
{% from "../theme-picker.njk" import themePicker %}

{% call themePicker({
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark", "abyss"],
    storageKey: "lily:theme"
}) %}
    <svg class="my-glyph" width="16" height="16"
         aria-hidden="true" focusable="false">
        <use href="#icon-palette"></use>
    </svg>
{% endcall %}
```

Everything else is unchanged: the options are still rendered from
`opts.themes`, the keyboard contract still works, and
`autoInit()` still wires it.

Two rules:

- **Mark the glyph `aria-hidden="true"`** (and `focusable="false"`
  on SVG). The button is icon-only, so its accessible name must keep
  coming from `aria-label`. A visible-text glyph would be read out
  ahead of, or instead of, the label.
- **Do not nest an interactive element** inside the button — no
  nested `<button>`, `<a>`, or anything focusable.

The caller block does **not** render options. That was the old
native-`<select>` behaviour; a `{% call %}` body emitting
`<option>` elements now produces invalid markup inside a
`<button>` and no working choices.

## Pattern 2: CSS only

Most "custom rendering" requests are really styling requests, and
the class hooks cover them without forking anything:

| Hook                     | Element                           |
| ------------------------ | --------------------------------- |
| `.theme-picker`         | Root `<div>`                      |
| `.theme-picker-button`  | The trigger                       |
| `.theme-picker-icon`    | The default glyph `<span>`        |
| `.theme-picker-list`    | The `<ul role="listbox">`         |
| `.theme-picker-option`  | Each `<li role="option">`         |
| `[aria-expanded="true"]` | Open state, on the button         |
| `[data-active]`          | The keyboard cursor, on an option |
| `[aria-selected="true"]` | The applied theme, on an option   |

```css
.theme-picker {
  position: relative;
  display: inline-block;
}
.theme-picker-list {
  position: absolute;
  inset-inline-start: 0;
  z-index: 1;
}
.theme-picker-list[hidden] {
  display: none;
}
.theme-picker-option[data-active] {
  background: Highlight;
}
.theme-picker-option[aria-selected="true"]::after {
  content: "\2713";
}
```

The client toggles the `hidden` attribute on the list, so let
`hidden` win rather than overriding it with `display` rules that
leave a closed list in the accessibility tree.

## Pattern 3: hand-written markup

The client.js doesn't require the macro at all — it reads the DOM
contract. Emit it yourself and `initThemePicker` will wire it:

```html
<div
  class="theme-picker"
  data-lily-theme-picker-root
  data-lily-theme-picker-name="theme"
  data-lily-theme-picker-themes-url="/assets/themes/"
  data-lily-theme-picker-extension=".css"
  data-lily-theme-picker-storage-key="my-app:theme"
>
  <input
    type="hidden"
    name="theme"
    value="light"
    data-lily-theme-picker-input
  />
  <button
    type="button"
    class="theme-picker-button"
    aria-label="Theme"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-controls="my-theme-list"
    data-lily-theme-picker-button
  >
    <span class="theme-picker-icon" aria-hidden="true">&#9681;</span>
  </button>
  <ul
    class="theme-picker-list"
    id="my-theme-list"
    role="listbox"
    aria-label="Theme"
    tabindex="-1"
    hidden
    data-lily-theme-picker-list
  >
    <li
      class="theme-picker-option"
      id="my-theme-option-0"
      role="option"
      aria-selected="true"
      data-value="light"
    >
      Light
    </li>
    <li
      class="theme-picker-option"
      id="my-theme-option-1"
      role="option"
      aria-selected="false"
      data-value="dark"
    >
      Dark
    </li>
  </ul>
</div>
```

The parts the client.js requires:

- `[data-lily-theme-picker-root]` — the element you pass to
  `initThemePicker`, carrying the `data-lily-theme-picker-*` config.
- `[data-lily-theme-picker-button]` — the trigger. Without it,
  `initThemePicker` returns a no-op controller.
- `[data-lily-theme-picker-list]` — the listbox. Also required.
- `[role="option"]` children with `data-value="{slug}"`. Their text
  content is the typeahead corpus; their `id`s feed
  `aria-activedescendant`, so every id must be unique in the
  document.
- `[data-lily-theme-picker-input]` — optional. When present, the
  client mirrors the applied slug into its `value`.

You are then on the hook for the parts the macro would have got
right: unique ids, `aria-controls` matching the list id,
`aria-selected` on exactly one option, and the pre-filled hidden
input.

## What custom rendering should _not_ do

- Don't mutate `document.head` or `data-theme` yourself — let the
  client.js own that lifecycle.
- Don't attach your own open/close or keyboard handlers. The
  client.js owns them; a second handler will double-toggle.
- Don't add a second element with the same `name` — share the one
  the macro emits.
- Don't reuse a `name` across two instances without also passing
  distinct `id`s; the listbox and option ids are derived from `id`,
  which defaults to `theme-picker-{name}`.

## Custom rendering does not fix the no-JS gap

None of these patterns make the control work without JavaScript.
Open/close, focus movement, and the keyboard contract all live in
`theme-picker.client.js`, and hand-written markup has exactly the
same limitation as macro-rendered markup: the button does nothing
until the module runs. The pre-filled hidden input is the only
no-JS affordance. See [ssr.md](./ssr.md).

---

Lily™ and Lily Design System™ are trademarks.
