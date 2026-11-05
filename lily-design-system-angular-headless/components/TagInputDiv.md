# TagInputDiv

an input for adding and removing tags

This is the Angular headless implementation. See `components/tag-input-div/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-tag-input-div label="Tags" [(value)]="text" (added)="tags.push($event)">
  @for (tag of tags; track tag) {
    <span class="tag">{{ tag }}</span>
  }
</lily-tag-input-div>
```

Projected content is the consumer's tags, rendered before the field.

## Files

- `TagInputDiv.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `TagInputDiv.spec.ts` — vitest + TestBed render test
