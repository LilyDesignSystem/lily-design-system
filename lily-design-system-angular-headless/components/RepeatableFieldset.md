# RepeatableFieldset

The "add another" pattern: a fieldset of identical item fieldsets a person adds to and removes from (tasks.md P29-T10). The
canonical contract, with every prop, is `components/repeatable-fieldset/index.md`.

## Usage

```html
<lily-repeatable-fieldset
  legend="Medicines"
  [(items)]="items"
  [newItem]="newItem"
  [itemLegend]="itemLegend"
  addLabel="Add another medicine"
  [removeLabel]="removeLabel"
  ><ng-template
    let-item
    let-index="index"
    >…</ng-template
  ></lily-repeatable-fieldset
>
```
