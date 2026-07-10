# Custom rendering

The default macro body emits a native `<select>` with `<option>`
children. When you need a different visual — swatch buttons, a
flyout — the macro accepts a caller block via Nunjucks's `{% call %}`
syntax. Two patterns are supported:

1. **Caller block** — wrap the macro invocation with `{% call %}`
   and supply replacement markup for the option list.
2. **Hand-written markup + client.js** — skip the macro entirely
   and write the `<select>` by hand with the same `data-lily-*`
   hooks; the client.js doesn't care where the markup came from.

## Pattern 1: caller block

The shipped `theme-select.njk` is a one-shot emitter that doesn't
currently inspect `caller`. To take advantage of caller-block
custom rendering, copy the macro into your project, replace the
default `{% for slug in opts.themes %}` body with a call to
`caller()`, and pass the resolver helpers via a context object.

A self-contained caller-style variant looks like:

```njk
{% macro themeSelectCustom(opts) %}
<select
  class="theme-select{% if opts.classes %} {{ opts.classes }}{% endif %}"
  aria-label="{{ opts.label }}"
  name="{{ opts.name | default('theme') }}"
  data-lily-theme-select-root
  data-lily-theme-select-name="{{ opts.name | default('theme') }}"
  data-lily-theme-select-themes-url="{{ opts.themesUrl }}"
  data-lily-theme-select-extension="{{ opts.extension | default('.css') }}"
  data-lily-theme-select-storage-key="{{ opts.storageKey | default('') }}"
  data-lily-theme-select-default-value="{{ opts.defaultValue | default('') }}"
>
  {{ caller() if caller else "" }}
</select>
{% endmacro %}
```

Then in the template:

```njk
{% call themeSelectCustom({
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark", "abyss"],
    name: "theme"
}) %}
{% for slug in ["light", "dark", "abyss"] %}
<button
    type="button"
    class="theme-select-swatch"
    data-theme="{{ slug }}"
    aria-pressed="false"
>{{ slug | capitalize }}</button>
{% endfor %}
{% endcall %}
```

A small piece of JS wires the buttons:

```html
<script type="module">
    import { initThemeSelect } from "/path/to/theme-select.client.js";
    document
        .querySelectorAll("[data-lily-theme-select-root]")
        .forEach((root) => {
            const ctrl = initThemeSelect(root, {
                onChange(slug) {
                    root.querySelectorAll(".theme-select-swatch").forEach(
                        (b) => b.setAttribute(
                            "aria-pressed",
                            String(b.dataset.theme === slug),
                        ),
                    );
                },
            });
            root.querySelectorAll(".theme-select-swatch").forEach((b) =>
                b.addEventListener("click", () =>
                    ctrl.setTheme(b.dataset.theme),
                ),
            );
        });
</script>
```

This gives you full visual control while keeping the lifecycle
(apply, persist, link swap) in the helper.

## Pattern 2: `bodyCaller` opt

When you want to pass a partial that the macro itself invokes
(equivalent to a React render prop), the macro accepts an
`opts.bodyCaller` key whose value is a string of pre-rendered
HTML. The macro injects it verbatim:

```njk
{# In a separate template file: #}
{% macro swatchBody(themes) %}
{% for slug in themes %}
<button type="button" class="theme-select-swatch" data-theme="{{ slug }}">
    {{ slug | capitalize }}
</button>
{% endfor %}
{% endmacro %}

{# In your page: #}
{% set body = swatchBody(["light", "dark", "abyss"]) %}
{{ themeSelect({
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark", "abyss"],
    bodyCaller: body
}) }}
```

The macro is shipped with the `<option>` default for now; to use
this `bodyCaller` pattern, copy the macro and replace the
`{% for slug in opts.themes %}…{% endfor %}` block with
`{{ opts.bodyCaller | safe if opts.bodyCaller else defaultBody }}`.

## Pattern 3: hand-written markup

The client.js doesn't require the macro at all. Write the
`<select>` by hand:

```html
<select
    class="theme-select"
    aria-label="Theme"
    name="theme"
    data-lily-theme-select-root
    data-lily-theme-select-themes-url="/assets/themes/"
    data-lily-theme-select-storage-key="my-app:theme"
>
    <option class="theme-select-option" value="light">Light</option>
    <option class="theme-select-option" value="dark">Dark</option>
</select>
```

Wire it the same way as Pattern 1.

## What the rendering should *not* do

- Don't mutate `document.head` or `data-theme` from the caller
  block — let the client.js own that lifecycle.
- Don't add a competing `name` to your controls — share the one on
  the macro (passed via `data-lily-theme-select-name`).
- Don't render outside the `<select>`; the client.js assumes
  the active root is the select.

## Why Nunjucks doesn't have render props

Nunjucks templates are strings; they don't pass first-class
functions. The `{% call %}` block is the language's idiomatic
escape hatch for "let the caller supply markup". The other
framework helpers in this catalog (Svelte snippets, React render
props, Vue scoped slots) all bottom out to the same DOM contract
— the markup hands the consumer access to a function that calls
`setTheme(slug)`.

---

Lily™ and Lily Design System™ are trademarks.
