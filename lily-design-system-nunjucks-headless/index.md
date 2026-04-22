# Lily Design System - Nunjucks Headless

A headless Nunjucks component library with 364 components. All
components are Nunjucks macros that render semantic HTML; they have no
built-in styles, are fully accessible (WCAG 2.2 AAA), and are
internationalisation-ready.

**Headless** means zero CSS, zero styles, zero opinions about
appearance. You provide all styling and all behaviour. Components
provide structure, semantics, accessibility, and macro ergonomics.

Inspired by the [NHS.UK frontend](https://github.com/nhsuk/nhsuk-frontend)
design system's Nunjucks macro pattern.

## Features

- 364 headless Nunjucks macros
- One macro per component, in its own directory, at
  `components/{component}/macro.njk` — the NHS.UK layout
- WCAG 2.2 AAA accessibility
- ARIA attributes and roles
- Internationalisation-ready (no hardcoded strings)
- Works with any CSS framework or custom styles
- No bundled JavaScript — you wire up the behaviour

## Usage

Install the package (once published):

```bash
pnpm add lily-design-system-nunjucks-headless
```

Configure Nunjucks with the components path:

```js
import nunjucks from "nunjucks";

nunjucks.configure([
  "node_modules/lily-design-system-nunjucks-headless",
  "views",
], {
  autoescape: true,
});
```

Import and call macros:

```njk
{% from "components/button/macro.njk" import button %}

{{ button({
  text: "Save",
  type: "submit",
  label: "Save changes",
  classes: "my-custom-class"
}) }}
```

### Button

```njk
{% from "components/button/macro.njk" import button %}
{{ button({ text: "Click me", type: "button" }) }}
```

Renders:

```html
<button class="button" type="button" aria-label="">Click me</button>
```

### Breadcrumb navigation

```njk
{% from "components/breadcrumb-nav/macro.njk" import breadcrumbNav %}
{% from "components/breadcrumb-list/macro.njk" import breadcrumbList %}
{% from "components/breadcrumb-list-item/macro.njk" import breadcrumbListItem %}

{% call breadcrumbNav({ label: "Breadcrumb" }) %}
  {% call breadcrumbList() %}
    {{ breadcrumbListItem({ html: '<a href="/">Home</a>' }) }}
    {{ breadcrumbListItem({ html: '<a href="/products">Products</a>' }) }}
    {{ breadcrumbListItem({ text: "Widget Pro", current: true }) }}
  {% endcall %}
{% endcall %}
```

### Grail layout

```njk
{% from "components/grail-layout/macro.njk" import grailLayout %}
{% from "components/grail-layout-top-header/macro.njk" import grailLayoutTopHeader %}
{% from "components/grail-layout-left-aside/macro.njk" import grailLayoutLeftAside %}
{% from "components/grail-layout-center-main/macro.njk" import grailLayoutCenterMain %}
{% from "components/grail-layout-right-aside/macro.njk" import grailLayoutRightAside %}
{% from "components/grail-layout-bottom-footer/macro.njk" import grailLayoutBottomFooter %}

{% call grailLayout() %}
  {% call grailLayoutTopHeader() %}Header{% endcall %}
  {% call grailLayoutLeftAside() %}Left{% endcall %}
  {% call grailLayoutCenterMain() %}Main{% endcall %}
  {% call grailLayoutRightAside() %}Right{% endcall %}
  {% call grailLayoutBottomFooter() %}Footer{% endcall %}
{% endcall %}
```

## Macro conventions

All macros take a single `params` options object. Shared keys:

| Param        | Type   | Purpose                                                 |
| ------------ | ------ | ------------------------------------------------------- |
| `text`       | string | Plain text content (escaped)                            |
| `html`       | string | Raw HTML content (rendered via `\| safe`)               |
| `label`      | string | Accessible name (ARIA label)                            |
| `id`         | string | Element id                                              |
| `classes`    | string | Consumer-provided additional CSS classes                |
| `attributes` | object | Arbitrary additional HTML attributes as key/value pairs |

Component-specific params (`href`, `value`, `type`, `name`, etc.) are
added on top and mirror the underlying HTML element.

Macro names are camelCase; the file path and the root CSS class stay
kebab-case. For example:

- directory: `components/breadcrumb-list-item/`
- file: `components/breadcrumb-list-item/macro.njk`
- macro identifier: `breadcrumbListItem`
- root CSS class: `breadcrumb-list-item`

## Styling

Because components are headless you provide all styling. Every
component renders a semantic CSS class on its root element, matching
the component's kebab-case name.

### With plain CSS

```css
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}

.alert[data-type="error"] {
  border: 1px solid red;
  background: #fff0f0;
}
```

### With Tailwind

```njk
{{ button({
  text: "Save",
  classes: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
}) }}
```

## Accessibility

All components follow WCAG 2.2 AAA:

- **Semantic HTML** — `<button>`, `<nav>`, `<dialog>`, `<table>`, etc.
- **ARIA** — roles, labels, states, and properties
- **Keyboard** — correct element choice means default keyboard
  semantics work; macros don't block default behaviour
- **Screen readers** — aria-labels, aria-live, role="alert", etc.

## Internationalisation

No strings are hardcoded in any component. All user-facing text comes
through macro params (`text`, `label`, etc.). Labels, placeholders,
and error messages are all configurable by the consumer.

## Related projects

- [Lily Design System](../) — parent project
- [HTML Headless](../lily-design-system-html-headless/)
- [Svelte Headless](../lily-design-system-svelte-headless/)
- [React Headless](../lily-design-system-react-headless/)
- [Vue Headless](../lily-design-system-vue-headless/)
- [Blazor Headless](../lily-design-system-blazor-headless/)

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0, or contact us for more.

## Contact

Joel Parker Henderson (joel@joelparkerhenderson.com)
