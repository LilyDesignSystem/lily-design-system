# ContentsLink

one table of contents link

This is the Angular headless implementation. See `components/contents-link/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-contents-link></lily-contents-link>
```

## Files

- `ContentsLink.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `ContentsLink.spec.ts` — vitest + TestBed render test

## Count

`countLabel` (with an optional `count`) shows a visible, localised count inside the link, after the text, so the link's
accessible name includes it; `count` sets `data-count` (and `data-complete` at 0). The count is text, never colour alone
(WCAG 1.4.1), and an `aria-label` replaces the whole name, so include the count in it if you set one.
See the canonical `components/contents-link/index.md`.
