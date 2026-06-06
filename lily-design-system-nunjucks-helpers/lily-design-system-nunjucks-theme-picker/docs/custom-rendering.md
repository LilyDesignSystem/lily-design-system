# Custom rendering

The default macro body emits a row of native radio inputs. When you
need a different visual — swatch buttons, a `<select>`, a flyout —
the macro accepts a caller block via Nunjucks's `{% call %}`
syntax. Two patterns are supported:

1. **Caller block** — wrap the macro invocation with `{% call %}`
   and supply replacement markup for the option list.
2. **Hand-written markup + client.js** — skip the macro entirely
   and write the `<fieldset>` by hand with the same `data-lily-*`
   hooks; the client.js doesn't care where the markup came from.

## Pattern 1: caller block

The shipped `theme-picker.njk` is a one-shot emitter that doesn't
currently inspect `caller`. To take advantage of caller-block
custom rendering, copy the macro into your project, replace the
default `{% for slug in opts.themes %}` body with a call to
`caller()`, and pass the resolver helpers via a context object.

A self-contained caller-style variant looks like:

```njk
{% macro themePickerCustom(opts) %}
<fieldset
  class="theme-picker{% if opts.classes %} {{ opts.classes }}{% endif %}"
  role="radiogroup"
  aria-label="{{ opts.label }}"
  data-lily-theme-picker-root
  data-lily-theme-picker-name="{{ opts.name | default('theme') }}"
  data-lily-theme-picker-themes-url="{{ opts.themesUrl }}"
  data-lily-theme-picker-extension="{{ opts.extension | default('.css') }}"
  data-lily-theme-picker-storage-key="{{ opts.storageKey | default('') }}"
  data-lily-theme-picker-default-value="{{ opts.defaultValue | default('') }}"
>
  {{ caller() if caller else "" }}
</fieldset>
{% endmacro %}
```

Then in the template:

```njk
{% call themePickerCustom({
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark", "abyss"],
    name: "theme"
}) %}
{% for slug in ["light", "dark", "abyss"] %}
<button
    type="button"
    class="theme-picker-swatch"
    data-theme="{{ slug }}"
    aria-pressed="false"
>{{ slug | capitalize }}</button>
{% endfor %}
{% endcall %}
```

A small piece of JS wires the buttons:

```html
<script type="module">
    import { initThemePicker } from "/path/to/theme-picker.client.js";
    document
        .querySelectorAll("[data-lily-theme-picker-root]")
        .forEach((root) => {
            const ctrl = initThemePicker(root, {
                onChange(slug) {
                    root.querySelectorAll(".theme-picker-swatch").forEach(
                        (b) => b.setAttribute(
                            "aria-pressed",
                            String(b.dataset.theme === slug),
                        ),
                    );
                },
            });
            root.querySelectorAll(".theme-picker-swatch").forEach((b) =>
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
<button type="button" class="theme-picker-swatch" data-theme="{{ slug }}">
    {{ slug | capitalize }}
</button>
{% endfor %}
{% endmacro %}

{# In your page: #}
{% set body = swatchBody(["light", "dark", "abyss"]) %}
{{ themePicker({
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark", "abyss"],
    bodyCaller: body
}) }}
```

The macro is shipped with the radio default for now; to use this
`bodyCaller` pattern, copy the macro and replace the
`{% for slug in opts.themes %}…{% endfor %}` block with
`{{ opts.bodyCaller | safe if opts.bodyCaller else defaultBody }}`.

## Pattern 3: hand-written markup

The client.js doesn't require the macro at all. Write the
fieldset by hand:

```html
<fieldset
    class="theme-picker"
    role="radiogroup"
    aria-label="Theme"
    data-lily-theme-picker-root
    data-lily-theme-picker-themes-url="/assets/themes/"
    data-lily-theme-picker-storage-key="my-app:theme"
>
    <button type="button" data-theme="light" aria-pressed="false">Light</button>
    <button type="button" data-theme="dark"  aria-pressed="false">Dark</button>
</fieldset>
```

Wire it the same way as Pattern 1.

## What the rendering should *not* do

- Don't mutate `document.head` or `data-theme` from the caller
  block — let the client.js own that lifecycle.
- Don't add a competing `name` to your inputs — share the one on
  the macro (passed via `data-lily-theme-picker-name`).
- Don't render outside the `<fieldset>`; the client.js assumes
  the active root is the fieldset.

## Why Nunjucks doesn't have render props

Nunjucks templates are strings; they don't pass first-class
functions. The `{% call %}` block is the language's idiomatic
escape hatch for "let the caller supply markup". The other
framework helpers in this catalog (Svelte snippets, React render
props, Vue scoped slots) all bottom out to the same DOM contract
— the markup hands the consumer access to a function that calls
`setTheme(slug)`.
