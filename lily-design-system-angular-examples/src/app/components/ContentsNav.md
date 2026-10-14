# ContentsNav

a contents navigation area

This is the Angular headless implementation. See `components/contents-nav/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-contents-nav></lily-contents-nav>
```

## Files

- `ContentsNav.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `ContentsNav.spec.ts` — vitest + TestBed render test

## Scrollspy

Set `spy` to mark the table-of-contents link for the section in view. The links are your own `<a href="#id">` elements.

```html
<lily-contents-nav label="On this page" [spy]="true" [offset]="64" [(active)]="section">
  <ol>
    <li><a href="#introduction">Introduction</a></li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</lily-contents-nav>
```

Inputs: `spy`, `offset` (px, default 0), `root` (element, default the viewport), `current` (default `"true"`); two-way `[(active)]`.

- **Which section is current:** the last one whose top has passed the activation line (`offset` px below the top of the
  scroller). At the bottom of the page the last section is current; above the first section, the first is.
- **What is set:** `aria-current` (default `"true"`) and `data-active` on that link, and `data-descendant-active` on each
  enclosing `<li>`. Style the highlight with more than colour (WCAG 1.4.1). There is no live region: scrolling announces nothing.
- **Clicks:** the clicked link becomes current at once and stays so until the scroll settles (`scrollend`, or 1 s).
- **Not done for you:** smooth scrolling (CSS `scroll-behavior` inside `prefers-reduced-motion: no-preference`), a fixed
  header's offset (`scroll-margin-top` on the targets plus the same `offset`), moving focus, and updating the URL.

