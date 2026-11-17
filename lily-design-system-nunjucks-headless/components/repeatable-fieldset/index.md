# RepeatableFieldset

The "add another" pattern: a fieldset of identical item fieldsets a person adds to and removes from (tasks.md P29-T10). The
canonical contract, with every prop, is `components/repeatable-fieldset/index.md`.

## Usage

```njk
{{ repeatableFieldset({ legend: "Medicines", name: "medicines", addLabel: "Add another medicine", items: [{ legend: "Medicine 1", removeLabel: "Remove medicine 1", html: fields }] }) }}
```
