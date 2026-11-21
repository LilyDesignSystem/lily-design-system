# Recipes

Small, copy-paste compositions of Lily™ catalog components: the layer between one component and a composed page
(tasks.md P22-T27, [spec/lessons/coss-ui](../spec/lessons/coss-ui/index.md) item 1).

Each recipe is `recipes/{component-slug}/{name}.html`: a front-matter block and a framework-neutral, semantic-HTML
snippet in the HTML catalog's markup. The directory is the recipe's own component; `components` lists every catalog
component it uses, so a recipe can be shown on each of their pages.

```html
---
title: "Field: required"
components: [field, label, text-input, hint]
tags: [form, required]
---

<div
  class="field"
  data-required="true"
>
  …
</div>
```

## Rules

- Compose catalog components only: every element's first class is a listed component, or a sub-class of one
  (`{slug}-…`).
- No new CSS, and no strings beyond realistic placeholder content, which a consumer replaces with their own words.
- Every control has an accessible name, and every `id` that `for`, `aria-labelledby`, `aria-describedby`,
  `aria-errormessage`, `aria-controls` or `href="#…"` names exists.
- An error message is linked from `aria-describedby` only once it is shown: a hidden element named there is still read
  out.
- `bin/check-recipes` (in `bin/test`) enforces all of these.

## The recipes

| Recipe                                                                            | Shows                                                                   |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [field/required](field/required.html)                                             | A required text field with a hint                                       |
| [field/disabled](field/disabled.html)                                             | A disabled field that says why it cannot change                         |
| [field/with-error](field/with-error.html)                                         | An error message linked with `aria-describedby` and `aria-errormessage` |
| [field/with-validity](field/with-validity.html)                                   | Native validation with `:user-invalid`, the error linked once shown     |
| [field/input-group](field/input-group.html)                                       | A number with a currency sign beside it                                 |
| [field/autocomplete](field/autocomplete.html)                                     | `autocomplete` tokens for names (WCAG 1.3.5)                            |
| [field/combobox](field/combobox.html)                                             | A labelled combobox with a hint                                         |
| [field/textarea](field/textarea.html)                                             | A text area with a hint                                                 |
| [field/select](field/select.html)                                                 | A labelled select                                                       |
| [field/checkbox](field/checkbox.html)                                             | One checkbox with its label                                             |
| [field/switch](field/switch.html)                                                 | A switch named by visible text                                          |
| [field/slider](field/slider.html)                                                 | A range with its scale explained in the hint                            |
| [field/number-field](field/number-field.html)                                     | A number with limits                                                    |
| [checkbox-group/select-all-that-apply](checkbox-group/select-all-that-apply.html) | Several checkboxes in a fieldset with a hint                            |
| [radio-group/one-choice](radio-group/one-choice.html)                             | One choice in a radio group                                             |
| [card/whole-card-link](card/whole-card-link.html)                                 | The whole card as one link, with a button that keeps its own target     |
| [form/complete-form](form/complete-form.html)                                     | An error summary linking to the field in error, and a submit button     |

Each component's page on the site lists the recipes that use it, and its `/r/{slug}.json` manifest has a `recipes`
array; `bin/generate-api-docs` reads the front matter above. Still to come (P22-T27): a `/recipes` index on the site.

---

Lily™ and Lily Design System™ are trademarks.
