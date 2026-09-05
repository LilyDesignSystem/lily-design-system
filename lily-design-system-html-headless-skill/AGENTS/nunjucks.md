## Nunjucks

- [Nunjucks](https://mozilla.github.io/nunjucks/)
- [Nunjucks templating](https://mozilla.github.io/nunjucks/templating.html)
- [Nunjucks API docs](https://mozilla.github.io/nunjucks/api.html)

### Component layout

Each component lives in its own directory:

- `components/{component-kebab-case}/macro.njk` — the Nunjucks macro
- `components/{component-kebab-case}/macro.test.js` — the Vitest render test

Macro names are camelCase (Nunjucks does not allow hyphens in identifiers).
File paths and CSS classes stay kebab-case.

### Macro signature

Each macro accepts a single `params` options object. Shared param keys:

- `text` — plain text content (escaped)
- `html` — raw HTML content (rendered via `| safe`)
- `label` — accessible name (aria-label or aria-labelledby target)
- `classes` — consumer-provided extra CSS classes appended to the base class
- `attributes` — object of extra HTML attributes as key/value pairs
- …component-specific params

### Configure Nunjucks

Configure Nunjucks with paths to the Lily components directory and any
view folder you use:

```js
nunjucks.configure([
  'components',
  '<YOUR-VIEWS-FOLDER>'
])
```

### Import and call a macro

```njk
{% from "components/button/macro.njk" import button %}

{{ button({
  text: "Submit",
  label: "Submit the contact form"
}) }}
```

### Macro template

```njk
{# components/{component-kebab-case}/macro.njk #}
{%- macro componentCamelCase(params) -%}
<tag
  class="component-kebab-case {{ params.classes | default('') }}"
  {%- if params.id %} id="{{ params.id }}"{% endif %}
  {%- if params.label %} aria-label="{{ params.label }}"{% endif %}
  {%- if params.attributes %}{% for k, v in params.attributes %} {{ k }}="{{ v }}"{% endfor %}{% endif %}
>
  {%- if params.html -%}
    {{ params.html | safe }}
  {%- else -%}
    {{ params.text }}
  {%- endif -%}
</tag>
{%- endmacro -%}
```

### Security

Sanitise any HTML passed to `params.html` to protect against cross-site
scripting (XSS).
