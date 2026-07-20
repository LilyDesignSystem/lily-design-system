# Styling

`<locale-select>` ships **no CSS at all**. Everything visual is yours,
applied to the class hooks the element emits into the light DOM. There
is no Shadow DOM, so ordinary page CSS reaches every part with no
piercing selectors and no custom-property plumbing.

## The list has no positioning until you give it some

This is the first thing to get right, and the most common omission.
The rendered `<ul class="locale-select-list">` is a normal block
element. Without positioning it sits in the document flow and shoves
the rest of the page down every time the list opens.

The minimum that makes it a dropdown:

```css
.locale-select {
  position: relative;
  display: inline-block;
}

.locale-select-list {
  position: absolute;
  z-index: 10;
  inset-inline-start: 0;  /* not `left` — see below */
  top: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  min-width: max-content;
}
```

Use **logical properties** (`inset-inline-start`, `padding-inline`,
`margin-inline`) throughout rather than `left` / `right`. This control
writes `dir="rtl"` to the document root when an RTL locale is picked,
which means your own dropdown will be mirrored by the very control it
belongs to. Physical properties survive that flip in the wrong
direction; logical ones follow it for free. Getting this wrong is
uniquely visible here: pick Arabic and watch the menu detach from its
button.

## Class hooks

Five hooks, all kebab-case, all stable contracts:

| Hook | Element | Notes |
| ---- | ------- | ----- |
| `.locale-select` | the `<div>` root | Also carries whatever you passed in `class`. |
| `.locale-select-button` | the trigger `<button type="button">` | Carries `aria-label`, `aria-haspopup`, `aria-expanded`, `aria-controls`. |
| `.locale-select-icon` | the glyph `<span>` | `aria-hidden="true"`. Absent if you override `renderButtonContent()`. |
| `.locale-select-list` | the `<ul role="listbox">` | `hidden` when closed. |
| `.locale-select-option` | each `<li role="option">` | Carries its own `lang` attribute. |

There is also a hidden `<input type="hidden">` for form participation.
It is not stylable and does not need to be.

## State hooks

Two state selectors that mean **different things**. Conflating them is
the most common styling bug in this control:

| Selector | Meaning | Lifetime |
| -------- | ------- | -------- |
| `[data-active]` | the keyboard-highlighted option | follows the arrow keys; **gone when the list closes** |
| `[aria-selected="true"]` | the applied locale | survives closing; there is always exactly one |

Give each its own signal, and do not rely on colour alone (WCAG
1.4.1) — the active option should also be distinguishable by
something non-chromatic:

```css
.locale-select-option[data-active] {
  background: var(--surface-accent, #eef);
  outline: 2px solid currentColor;
  outline-offset: -2px;
}

.locale-select-option[aria-selected="true"] {
  font-weight: 700;
}

.locale-select-option[aria-selected="true"]::before {
  content: "✓ ";
}
```

Note the checkmark is *inside* the option's `lang` scope, which is
harmless for a symbol. If you use a word instead ("current"), wrap it
so it does not inherit the option's language and get mispronounced.

## Attribute hooks

`aria-expanded` on the button is the natural hook for open-state
styling — no extra class needed:

```css
.locale-select-button[aria-expanded="true"] {
  background: var(--surface-raised, #f4f4f4);
}
```

## Styling option labels across scripts

Every option carries `lang`, which you can style against. This matters
more here than in any other Lily helper: a language list is
intrinsically multi-script, and a font stack tuned for Latin text will
render Arabic, Devanagari, or Han glyphs at visibly wrong sizes or
fall back to a system default mid-list.

```css
/* Per-script font tuning, keyed off the lang the element already writes. */
.locale-select-option:lang(ar),
.locale-select-option:lang(fa),
.locale-select-option:lang(he) {
  font-size: 1.08em;   /* Arabic/Hebrew x-heights run small at the same px */
  line-height: 1.8;
}

.locale-select-option:lang(ja),
.locale-select-option:lang(ko),
.locale-select-option:lang(zh) {
  font-family: var(--font-cjk, system-ui);
}
```

Give the list a generous `line-height` overall. Scripts with tall
ascenders and deep descenders (Devanagari, Thai, Vietnamese with
stacked diacritics) clip against a tight one, and clipping a
language's name in a language picker is a bad failure.

Do **not** try to set `direction` on individual options yourself. Each
option's `lang` gives the browser what it needs to apply the Unicode
bidi algorithm to that text run; adding explicit `direction` per option
usually makes mixed-script labels worse, not better. See
[rtl.md](./rtl.md).

## A minimal worked example

A complete, self-contained set that positions the list, styles both
state hooks distinctly, respects RTL, and keeps focus visible:

```css
.locale-select {
  position: relative;
  display: inline-block;
  font-family: system-ui, sans-serif;
}

.locale-select-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5ch;
  padding: 0.4rem 0.6rem;
  border: 1px solid #767676;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  line-height: 1;
}

.locale-select-button:focus-visible {
  outline: 3px solid #ffdd00;
  outline-offset: 0;
  box-shadow: 0 0 0 5px #0b0c0c;
}

.locale-select-icon {
  font-size: 1.15em;
}

.locale-select-list {
  position: absolute;
  top: calc(100% + 4px);
  inset-inline-start: 0;
  z-index: 10;
  margin: 0;
  padding: 0.25rem 0;
  list-style: none;
  min-width: max-content;
  max-height: 60vh;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #b1b4b6;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.18);
}

.locale-select-list:focus-visible {
  outline: 3px solid #ffdd00;
}

.locale-select-option {
  padding: 0.4rem 2rem 0.4rem 0.75rem;
  line-height: 1.6;
  cursor: pointer;
  white-space: nowrap;
}

.locale-select-option[data-active] {
  background: #1d70b8;
  color: #fff;
}

.locale-select-option[aria-selected="true"] {
  font-weight: 700;
}

.locale-select-option[aria-selected="true"]::after {
  content: "✓";
  margin-inline-start: 0.75rem;
  float: inline-end;
}
```

### The `hidden` trap

The element closes the list with the `hidden` attribute. Any
`display` declaration that targets the list unconditionally overrides
it, because `hidden` is only a UA-stylesheet `display: none`:

```css
/* WRONG — the list is now permanently visible. */
.locale-select-list { display: block; }

/* Right — re-assert hidden, or scope the display rule. */
.locale-select-list { display: block; }
.locale-select-list[hidden] { display: none; }
```

The same trap catches `display: flex` and `display: grid`. If you set
any `display` on `.locale-select-list`, add the `[hidden]` guard on
the next line as a reflex.

## Targeting the host vs the rendered root

Two different elements, and the distinction is load-bearing:

```
<locale-select label="…" locales="…">   ← the host (your attributes live here)
  <div class="locale-select">           ← the rendered root (class hook lives here)
```

The `class` attribute you pass lands on the **rendered root**, not the
host. Style `.locale-select` for anything visual. Target the host
element itself only for layout concerns that must apply before
upgrade:

```css
/* Reserve space so the page doesn't reflow when the element upgrades. */
locale-select {
  display: inline-block;
  min-height: 2.25rem;
  min-width: 2.5rem;
}
```

Custom elements are `display: inline` by default, which is rarely what
you want around a button.

## Showing the active locale

The closed button is a bare glyph, so the active locale is not visible
anywhere — an accessibility gap called out in
[accessibility.md](./accessibility.md). The usual fix is a sibling
element you render and update yourself:

```html
<div class="locale-status">
  <locale-select id="ls" label="Choose language" locales="en,fr,ar"></locale-select>
  <span id="locale-name" aria-live="polite"></span>
</div>
```

```ts
const el = document.querySelector("#ls") as LocaleSelect;
const out = document.querySelector("#locale-name")!;
const paint = () => {
  out.textContent = el.labelFor(el.value);
  out.setAttribute("lang", el.tagFor(el.value));
};
el.addEventListener("localechange", paint);
paint();
```

Setting `lang` on the status text matters: it is a language name
rendered as an endonym, so it needs its own language for correct
pronunciation, exactly as the options do.

### Visually-hidden variant

If the design has no room for visible text, keep the live region for
screen-reader users only. Use the standard clip pattern rather than
`display: none` or `visibility: hidden`, both of which remove the text
from the accessibility tree entirely:

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
```

## Long option lists

A real locale list can run to dozens of entries. Cap the height and
let it scroll — the element already calls `scrollIntoView({ block:
"nearest" })` on the active option as the arrow keys move, so keyboard
navigation stays in view automatically:

```css
.locale-select-list {
  max-height: 60vh;
  overflow-y: auto;
  overscroll-behavior: contain;  /* don't scroll the page at the ends */
}
```

Do not add `scroll-behavior: smooth` to the list. Smooth scrolling
fights the synchronous `scrollIntoView` call during fast arrow-key
repeat and during typeahead, and lands the user somewhere unintended.

## Reduced motion

If you animate the list open, gate it. Headless Lily components never
auto-animate; any motion here is yours to make optional:

```css
@media (prefers-reduced-motion: no-preference) {
  .locale-select-list { transition: opacity 120ms ease; }
}
```

## Don'ts

- **Don't style `[data-active]` and `[aria-selected]` identically.**
  They are different states and users need to tell them apart.
- **Don't use physical `left` / `right`.** This control flips `dir`;
  logical properties are not optional here.
- **Don't set `display` on the list without an `[hidden]` guard.**
- **Don't remove focus outlines** on the button or the `<ul>`. Focus
  moves to the `<ul>` while the list is open — if it has no visible
  focus style, keyboard users lose the control entirely.
- **Don't add `tabindex` to options.** Focus belongs on the `<ul>`;
  the active option is conveyed by `aria-activedescendant`. Making
  options tabbable breaks the APG listbox pattern.
- **Don't rely on the glyph's size being stable across platforms.**
  The globe is a bare codepoint from the system font stack; give the
  button a `min-width` so its box does not jump between platforms.

## Custom-element vs class specificity

`locale-select` (element selector) and `.locale-select` (class
selector) have different specificity — 0-0-1 vs 0-1-0. When a rule on
the host and a rule on the root both apply to the same visual concern,
the class wins. Keep host rules to layout (`display`, sizing) and root
rules to appearance and you will not have to think about it.
