# Lily Design System™ Nunjucks headless identifiers

`@lilydesignsystem/nunjucks-headless-identifiers`: the 188 national personal identifier components of the Lily Design System catalog for Nunjucks, an `-input` and
a `-view` for each of 94 identifier types across more than 50 countries (health numbers, national identity numbers, tax
numbers, passports). It is the add-on to [`@lilydesignsystem/nunjucks-headless`](../lily-design-system-nunjucks-headless/), which
has the other 473 components.

```sh
pnpm add @lilydesignsystem/nunjucks-headless-identifiers
```

```js
// Add both packages to the loader path, then import a macro by its slug.
const nunjucks = require("nunjucks");
const { templatesDir } = require("@lilydesignsystem/nunjucks-headless-identifiers");
nunjucks.configure([templatesDir /*, the nunjucks-headless templatesDir */]);
```

```njk
{% from "united-kingdom-national-health-service-number-input/macro.njk" import unitedKingdomNationalHealthServiceNumberInput %}
{{ unitedKingdomNationalHealthServiceNumberInput({ label: "NHS number", name: "nhs" }) }}
```

Like the headless library it is unstyled: semantic HTML, ARIA and behaviour only. Each input renders
`autocomplete="off"` and `spellcheck="false"`, so the browser neither saves the value nor sends it to a spellchecker.
The formats, normalisation and validation rules are in [spec/national-identifiers](../spec/national-identifiers/index.md).

Why a separate package: [spec/headless-identifiers](../spec/headless-identifiers/index.md). Spec:
[spec/index.md](spec/index.md). Agents: [AGENTS.md](AGENTS.md).

---

Lily™ and Lily Design System™ are trademarks.
