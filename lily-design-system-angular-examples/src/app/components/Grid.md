# Grid

a CSS grid layout container with configurable columns and gap

This is the Angular headless implementation. See `components/grid/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-grid></lily-grid>
```

## Inputs

- `columns`: number | string (default `12`) -- equal columns, or a `grid-template-columns` string
- `minColumnWidth`: string (optional CSS length) -- fluid mode: `repeat(auto-fit, minmax(min(W, 100%), 1fr))`; wins over `columns`
- `gap`: string (default `"1rem"`)

```html
<lily-grid minColumnWidth="12rem"></lily-grid>
```

In a 120px container this is one column with no overflow (the `min(W, 100%)` cap).

## Files

- `Grid.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `Grid.spec.ts` — vitest + TestBed render test
