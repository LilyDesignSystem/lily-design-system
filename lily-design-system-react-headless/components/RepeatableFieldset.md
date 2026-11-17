# RepeatableFieldset

The "add another" pattern: a fieldset of identical item fieldsets a person adds to and removes from (tasks.md P29-T10). The
canonical contract, with every prop, is `components/repeatable-fieldset/index.md`.

## Usage

```tsx
<RepeatableFieldset
  legend="Medicines"
  items={items}
  onItemsChange={setItems}
  newItem={() => ({ name: "" })}
  itemLegend={(n) => `Medicine ${n}`}
  addLabel="Add another medicine"
  removeLabel={(n) => `Remove medicine ${n}`}
  renderItem={(item, index) => (
    <MedicineFields
      item={item}
      index={index}
    />
  )}
/>
```
