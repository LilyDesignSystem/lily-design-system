# Accessibility — Lily HTML Helpers

The catalog inherits the Lily-wide accessibility commitments
documented in [`shared/headless-principles.md`](./shared/headless-principles.md)
and in the repo-root `AGENTS/accessibility.md`. This file lists the
custom-element-specific notes that are easy to miss.

## Standards

- **WCAG 2.2 AAA** is the target.
- **WAI-ARIA Authoring Practices 1.2** patterns are the reference.
- Semantic HTML first; ARIA only where the canonical helper's
  `spec/index.md` calls it out.

## Custom-element-specific gotchas

### Light DOM, not Shadow DOM

Shadow DOM creates an accessibility-tree boundary that affects
labelling. ARIA `aria-labelledby` cannot cross a closed shadow
boundary and is awkward across an open one. The catalog stays in
light DOM so consumer-supplied `aria-*` references work without
ceremony.

### One rendering shape across the catalog

All three helpers share one markup shape — an icon button that opens
an APG listbox — and one keyboard implementation:

| Helper | Rendering | Glyph | Keyboard comes from |
| ------ | --------- | ----- | ------------------- |
| `<theme-chooser>` | Icon button + `role="listbox"` dropdown | `◑` U+25D1 | The element's own JS handlers |
| `<locale-chooser>` | Icon button + `role="listbox"` dropdown | U+1F310 + VS15 | The element's own JS handlers |
| `<text-size-chooser>` | Icon button + `role="listbox"` dropdown | `A` U+0041 | The element's own JS handlers |

`<text-size-chooser>` was deliberately left as a native `<select>` when
the other two converted, and joined them afterwards. Its glyph is a
plain ASCII letter rather than a pictograph: U+1F5DB DECREASE FONT
SIZE SYMBOL has no real glyph in common font stacks and means
*decrease* rather than *size*, whereas "A" exists in every font,
inherits the page's typeface, and is the conventional affordance.

### `aria-label` on the rendered control, not on the custom element

The accessible name belongs on the rendered control, not on the
`<theme-chooser>` host. The host element has no role and is silent.

```html
<theme-chooser label="Theme">
    <!-- the host has no role; nothing announced. -->
    <div class="theme-chooser">
        <input type="hidden" name="theme" value="light" />
        <!-- the button is what the screen reader names. -->
        <button type="button" class="theme-chooser-button"
                aria-label="Theme" aria-haspopup="listbox"
                aria-expanded="false" aria-controls="theme-chooser-1-list">
            <span class="theme-chooser-icon" aria-hidden="true">&#9681;</span>
        </button>
        <ul class="theme-chooser-list" id="theme-chooser-1-list"
            role="listbox" aria-label="Theme" tabindex="-1" hidden>
            <!-- one <li role="option"> per theme -->
        </ul>
    </div>
</theme-chooser>
```

Both the button and the listbox carry `aria-label`. The glyph inside
the button is `aria-hidden="true"` so it can never become the
accessible name — an icon-only control has no visible text to fall
back on, which makes the consumer's `label` load-bearing in a way it
was not when the control was a native `<select>`.

### Custom listbox, not a native combobox

All three helpers implement the WAI-ARIA APG
listbox pattern in JavaScript: `aria-haspopup` / `aria-expanded` /
`aria-controls` on the button, `role="listbox"` on the `<ul>`,
`role="option"` + `aria-selected` on each `<li>`, and
`aria-activedescendant` on the `<ul>` while open. Focus sits on the
`<ul>`, never on the individual options.

This is a real accessibility tradeoff against the native `<select>`
these helpers used to render — the native element got platform
keyboard behaviour, mobile OS pickers, and battle-tested AT support
for free. Each package's `docs/accessibility.md` states the tradeoff
in full.

This now applies to all three helpers, `<text-size-chooser>` included.
It lands slightly harder there: a user who reaches for a text-size
control has, by definition, a visual or cognitive access need, and is
likelier than average to be on assistive technology. A native
`<select>` remains the better choice for some audiences — say so
plainly rather than treating the APG pattern as strictly better.

### CustomEvent and screen-reader announcements

`themechange` / `localechange` / `textsizechange` are **not** ARIA
live regions. They are change notifications for *consumer code*, not
for assistive technology. If you want the change announced, add a
`role="status"` or `aria-live` region elsewhere on the page and write
into it from your listener. Each package's `docs/accessibility.md`
documents that status region as the default pattern, because an
icon-only button conveys nothing about its current value when closed.

### Subclassing for custom rendering

Light DOM means no `<slot>`, so subclassing is the customisation
surface. There are two tiers, and they differ sharply in risk:

- **Override `renderButtonContent()`** to replace the glyph inside
  the button. The base class still builds the button and the
  listbox, so the aria wiring and the whole keyboard contract keep
  working. This is the safe path and the one to recommend.
- **Replace the rendering wholesale** (post-processing after
  `super.connectedCallback()`). The subclass then owns the entire
  accessibility tree *and* the keyboard contract, because the base
  class's handlers are bound to the DOM it built. Each package's
  `docs/custom-rendering.md` lists the invariants such a subclass
  must preserve.

## Keyboard

All three helpers implement the APG listbox
contract themselves — on the button, ArrowDown / Enter / Space open
(ArrowUp opens with the last option active); on the listbox, arrows
move the active option and clamp, Home / End jump to the ends,
Enter / Space select and close, Escape closes without changing the
value, Tab closes without stealing focus, and printable characters
run a 500 ms typeahead over the option labels. Each package's
`spec/index.md` carries the full table.

## Focus management

Selection changes never move focus elsewhere on the page (WCAG
3.2.2, On Input). The listbox helpers do move focus *within* the
control, which the APG listbox pattern requires: opening moves focus
to the `<ul>`, and selecting or cancelling returns it to the button.
Tab closes the list without pulling focus back, so it lands wherever
the user was headed. When wiring `themechange` to navigation
(`window.location = …`), preserve scroll position and avoid focus
jumps.

## Screen-reader pronunciation (locale chooser)

Each `<li role="option">` carries `lang="…"` so screen readers
switch pronunciation per option (WCAG 3.1.2, Language of Parts). The
button and the `<ul>` carry no `lang` — they are not
locale-specific. Custom subclasses must keep the per-option
attribute.

## Visible focus

The helpers ship no CSS; visible focus is the consumer's CSS
responsibility. Don't suppress `:focus` or `:focus-visible` in
consumer styles.

## Reduced motion

The helpers perform no animation. Theme CSS files that introduce
transitions on `data-theme` changes are responsible for honouring
`prefers-reduced-motion`.

## Testing for a11y

vitest + jsdom is enough for ARIA-attribute assertions:

```ts
const el = document.createElement("theme-chooser");
el.setAttribute("label", "Theme");
el.setAttribute("themes-url", "/t/");
el.setAttribute("themes", "light,dark");
document.body.appendChild(el);

const button = el.querySelector(".theme-chooser-button")!;
expect(button.getAttribute("aria-label")).toBe("Theme");
expect(button.getAttribute("aria-haspopup")).toBe("listbox");

const list = document.getElementById(button.getAttribute("aria-controls")!)!;
expect(list.getAttribute("role")).toBe("listbox");
expect(list.querySelectorAll('[role="option"]').length).toBe(2);
```

For full audits run axe-core in a real browser host (the example
`.html` files in `examples/` are the right targets). The catalog
has no built-in axe runner because the helpers ship no CSS — a
meaningful audit must run against the consumer's styled markup.

## What the host element should never do

- **Set `role` on the custom element itself.** The roles belong on
  the rendered button and listbox. Setting `role="combobox"` or
  `role="listbox"` on `<theme-chooser>` produces a duplicate
  announcement.
- **Hide the element with `display: none`.** Removes the entire
  rendered tree from the accessibility tree. Use a visually-hidden
  pattern when you need the control offscreen but still operable
  with assistive tech.
- **Style the listbox out of the flow with `display: none`.** The
  element manages the `hidden` attribute; consumer CSS that fights
  it will either leak the open list or hide it from AT while the
  element believes it is open.
- **Disable focus-ring styling.** The custom element does not set
  `outline: none`; consumer CSS must not either.
