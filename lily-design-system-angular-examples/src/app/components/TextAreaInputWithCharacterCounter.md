# TextAreaInputWithCharacterCounter

a multi-line text area input with a caption below that is a character counter "[number] of [maximum] characters"

This is the Angular headless implementation. See `components/text-area-input-with-character-counter/index.md`
in the canonical repo root for the cross-framework documentation.

`counterTemplate` has no default: the words are the consumer's.

## Selector

```html
<lily-text-area-input-with-character-counter
  label="Notes"
  [maxLength]="200"
  counterTemplate="{count} of {max} characters"
  [(value)]="notes"
/>
```

## Files

- `TextAreaInputWithCharacterCounter.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `TextAreaInputWithCharacterCounter.spec.ts` — vitest + TestBed render test
