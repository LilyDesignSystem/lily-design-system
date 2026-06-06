# Accessibility — Lily HTML Helpers

The catalog inherits the Lily-wide accessibility commitments
documented in [`shared/headless-principles.md`](./shared/headless-principles.md)
and in the repo-root `AGENTS/accessibility.md`. This file lists the
custom-element-specific notes that are easy to miss.

## Standards

- **WCAG 2.2 AAA** is the target.
- **WAI-ARIA Authoring Practices 1.2** patterns are the reference.
- Semantic HTML first; ARIA only where the canonical helper's
  `spec.md` calls it out.

## Custom-element-specific gotchas

### Light DOM, not Shadow DOM

Shadow DOM creates an accessibility-tree boundary that affects
labelling. ARIA `aria-labelledby` cannot cross a closed shadow
boundary and is awkward across an open one. The catalog stays in
light DOM so consumer-supplied `aria-*` references work without
ceremony.

### `aria-label` on the rendered fieldset, not on the custom element

The accessible name belongs on the rendered `<fieldset
role="radiogroup">`, not on the `<theme-picker>` host. Screen
readers announce the fieldset (with its role and label); the host
element is silent.

```html
<theme-picker label="Theme">
    <!-- the host has no role; nothing announced. -->
    <fieldset role="radiogroup" aria-label="Theme">
        <!-- this is what the screen reader names. -->
    </fieldset>
</theme-picker>
```

If a consumer wants the host to be announced too, they can add an
ARIA role to the host (`role="group"`) — but the rendered fieldset
already provides the canonical announcement, so the addition is
usually redundant.

### Native radio inputs

The radiogroup contract is delivered by `<fieldset
role="radiogroup">` + native `<input type="radio">`. The platform
implements roving tabindex, arrow keys, Space, and Tab semantics
correctly across screen readers. The custom element does not add
any JS keyboard handlers.

### CustomEvent and screen-reader announcements

`themechange` / `localechange` are **not** ARIA live regions. They
are change notifications for *consumer code*, not for assistive
technology. If you want the theme change announced, add a
`role="status"` or `aria-live` region elsewhere on the page and
write into it from your `themechange` listener.

### Subclassing for custom rendering

When subclassing the element class to render a different visual
(swatch buttons, `<select>` dropdown), the subclass becomes
responsible for the accessibility tree:

- Keep `role="radiogroup"` on the outer container, OR
- Drop the radio semantics entirely and use `aria-pressed` on a
  button group, OR
- Use a native `<select>` (which carries the combobox role).

The default rendering's native radios cover the WAI-ARIA APG
Radio Group pattern; subclasses must match the same accessibility
contract or document the deviation.

## Keyboard

Native `<input type="radio">` provides Tab / Shift+Tab / Arrow /
Space / Home / End for free. None of the helpers add keyboard
handlers; subclasses that swap the markup become responsible for
the keyboard contract.

## Focus management

The helpers never call `.focus()` automatically. Changing the
selection does not move focus elsewhere on the page (WCAG 3.2.2,
On Input). When wiring `themechange` to navigation
(`window.location = …`), preserve scroll position and avoid focus
jumps.

## Screen-reader pronunciation (locale picker)

Each `<label>` carries `lang="…"` so screen readers switch
pronunciation per option (WCAG 3.1.2, Language of Parts). Custom
subclasses must keep this attribute on the rendered element.

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
const el = document.createElement("theme-picker");
el.setAttribute("label", "Theme");
el.setAttribute("themes-url", "/t/");
el.setAttribute("themes", "light,dark");
document.body.appendChild(el);

const fs = el.querySelector("fieldset")!;
expect(fs.getAttribute("role")).toBe("radiogroup");
expect(fs.getAttribute("aria-label")).toBe("Theme");
```

For full audits run axe-core in a real browser host (the example
`.html` files in `examples/` are the right targets). The catalog
has no built-in axe runner because the helpers ship no CSS — a
meaningful audit must run against the consumer's styled markup.

## What the host element should never do

- **Set `role` on the custom element itself.** The role belongs on
  the rendered fieldset. Setting `role="radiogroup"` on
  `<theme-picker>` produces two radiogroup announcements.
- **Hide the element with `display: none`.** Removes the entire
  rendered tree from the accessibility tree. Use a visually-hidden
  pattern when you need the picker offscreen but still operable
  with assistive tech.
- **Disable focus-ring styling.** The custom element does not set
  `outline: none`; consumer CSS must not either.
