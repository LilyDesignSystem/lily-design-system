# RepeatableFieldset

The "add another" pattern: a fieldset of identical item fieldsets a person adds to and removes from (tasks.md P29-T10). The
canonical contract, with every prop, is `components/repeatable-fieldset/index.md`.

## Usage

```razor
<RepeatableFieldset TItem="Medicine" Legend="Medicines" @bind-Items="items" NewItem="() => new Medicine()" ItemLegend="n => $\"Medicine {n}\"" AddLabel="Add another medicine" RemoveLabel="n => $\"Remove medicine {n}\""><ItemTemplate>…</ItemTemplate></RepeatableFieldset>
```
