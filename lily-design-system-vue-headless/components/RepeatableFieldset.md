# RepeatableFieldset

The "add another" pattern: a fieldset of identical item fieldsets a person adds to and removes from (tasks.md P29-T10). The
canonical contract, with every prop, is `components/repeatable-fieldset/index.md`.

## Usage

```vue
<RepeatableFieldset
  legend="Medicines"
  v-model:items="items"
  :new-item="() => ({ name: '' })"
  :item-legend="(n) => `Medicine ${n}`"
  add-label="Add another medicine"
  :remove-label="(n) => `Remove medicine ${n}`"
><template #item="{ item, index }">…</template></RepeatableFieldset>
```
