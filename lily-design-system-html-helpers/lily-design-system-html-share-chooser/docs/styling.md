# Styling — `<share-chooser>`

The package ships **no CSS at all**, including the list's positioning.
Everything below is a starting point to copy, not something the package
applies.

## Class hooks

| Hook | Element |
| ---- | ------- |
| `.share-chooser` | Rendered root `<div>`. Your `class` attribute is appended here. |
| `.share-chooser-button` | The trigger `<button>`. |
| `.share-chooser-icon` | The `aria-hidden` glyph `<span>`. |
| `.share-chooser-list` | The `<ul>`. Carries `hidden` when closed. |
| `.share-chooser-list-item` | Each `<li>`. |
| `.share-chooser-target` | Each destination `<a>`. Also `[data-target-id]`. |
| `.share-chooser-copy` | The copy `<button>`, when `copy-label` is set. |
| `.share-chooser-status` | The polite live region `<p>`. |

The custom element itself (`share-chooser`) is an unstyled inline element
until you give it a `display`.

## Minimum viable CSS

Without this the list renders in normal flow, pushing the page around
when it opens.

```css
share-chooser { display: inline-block; }

.share-chooser {
  position: relative;
  display: inline-block;
}

.share-chooser-list {
  position: absolute;
  inset-block-start: 100%;
  inset-inline-start: 0;
  z-index: 10;
  margin: 0;
  padding: 0;
  list-style: none;
  min-inline-size: max-content;
}

/* Re-assert the closed state. The rule above sets `display` on a
   `[hidden]` element, which would otherwise win and show the list. */
.share-chooser-list[hidden] {
  display: none;
}
```

That last rule is the one people miss. `hidden` is only
`display: none` at the UA-stylesheet level, so any `display` you set
overrides it.

## Logical properties

`inset-inline-start` rather than `left` means the dropdown aligns
correctly under RTL without a second rule — worth keeping if you pair
this with `locale-chooser`, which sets `dir` on the document root.

## The status region

Do **not** hide it with `display: none` or `visibility: hidden`: both
remove it from the accessibility tree, and the copy outcome stops being
announced. Either style it as visible text, or hide it visually only:

```css
.share-chooser-status {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
```

Showing it visibly is friendlier — a "Link copied" confirmation helps
everyone, not only screen-reader users. If you do, reserve its space or
accept a small reflow, since it is empty until something happens.

## Focus

Focus lands on real items, so the default focus ring works. Do not
remove it:

```css
.share-chooser-button:focus-visible,
.share-chooser-target:focus-visible,
.share-chooser-copy:focus-visible {
  outline: 3px solid var(--theme-color-focus, currentColor);
  outline-offset: 2px;
}
```

## Making the items look alike

The list mixes `<a>` and `<button>`, which have very different UA
defaults. Level them:

```css
.share-chooser-target,
.share-chooser-copy {
  display: block;
  inline-size: 100%;
  padding: 0.5rem 0.75rem;
  font: inherit;
  color: inherit;
  text-align: start;
  text-decoration: none;
  background: none;
  border: 0;
  cursor: pointer;
}
```

## Glyph sizing

The ↪ arrow's optical weight varies between font families and can read
small next to body text. The root `themes/` stylesheets already handle
this; if you are not using them:

```css
.share-chooser-icon {
  font-size: 1.15em;
  line-height: 1;
}
```

## Theme tokens

If you are using the Lily reference themes, the hooks are already
styled — do not restyle them here. Otherwise the usual custom
properties apply:

```css
.share-chooser-list {
  background: var(--theme-color-surface, #fff);
  border: 1px solid var(--theme-color-border, #d8dde0);
  border-radius: var(--theme-radius-md, 0.25rem);
}
```
