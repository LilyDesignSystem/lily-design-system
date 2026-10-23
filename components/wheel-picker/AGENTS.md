# WheelPicker

## Metadata

- Component: wheel-picker
- PascalCase: WheelPicker
- Description: a vertical single-select listbox where the selection follows the cursor, for choosing one of a short list by scrolling or typing
- Status: experimental — implemented and unit-tested in all nine headless catalogs (2026-10-23); Blazor and plain HTML/Nunjucks differ, see index.md
- HTML tag: <div>
- CSS class: .wheel-picker
- Interactive: yes

## Key Behaviors

- Renders `<div class="wheel-picker">` holding `<div class="wheel-picker-list" role="listbox" aria-orientation="vertical" aria-label tabindex="0" aria-activedescendant>` of `<div class="wheel-picker-option" role="option" aria-selected aria-disabled? data-value>`
- Selection follows the cursor (APG listbox, "selection follows focus"): moving to an option chooses it; there is no separate commit key
- Disabled options are skipped by every move and cannot be chosen
- Arrow keys clamp at the ends, or wrap with `loop`; Home, End, PageUp and PageDown never wrap
- Type-ahead: letters typed within 700 ms form a prefix and move to the next enabled option whose label starts with it (diacritics and case ignored); a repeated letter cycles
- Clicking an enabled option chooses it and focuses the list
- Choosing the option already held is a no-op: no change callback, no event
- Keeps the chosen option centred by setting the list's `scrollTop` (never the page, never animated)
- With `name`, a hidden input carries the value for a form
- The key model is `shared/wheel-picker.ts` (`nextWheelIndex`, `wheelTypeaheadIndex`, `nextWheelPrefix`)

## ARIA

- `role="listbox"` with `aria-label`, `aria-orientation="vertical"` and `aria-activedescendant` naming the chosen option; `aria-disabled="true"` when disabled
- Each option: `role="option"`, `aria-selected`, `aria-disabled="true"` when disabled
- DOM focus stays on the listbox; the cursor is `aria-activedescendant`

## Keyboard

- ArrowDown / ArrowUp: choose the next / previous enabled option (wrap only with `loop`)
- Home / End: choose the first / last enabled option
- PageDown / PageUp: move by `pageSize` enabled options, clamped
- Printable character: type-ahead over the labels
- Tab: leaves the control

## Props

- `class`: string (default: `""`) -- appended to the base class
- `label`: string (required) -- accessible name
- `options`: `{ value: string, label: string, disabled?: boolean }[]` (required)
- `value`: string (default: `""`) -- the chosen option's value; bindable (Svelte `bind:value`, Vue `v-model`, Angular `[(value)]`, Blazor `@bind-Value`, React controlled with `onChange`)
- `loop`: boolean (default: false)
- `pageSize`: number (default: 5)
- `disabled`: boolean (default: false) -- not focusable; ignores keys and clicks
- `name`: string -- adds a hidden input
- `onChange`: `(value: string) => void` -- once per change (React, Svelte); `change` event in Web Components, Alpine and HTML
- `...restProps`: HTML attributes -- spread onto the root `<div>`

## Acceptance Criteria

- [ ] Renders a <div> with class="wheel-picker" first in its class list, holding a role="listbox" with aria-orientation="vertical"
- [ ] Exactly one option is aria-selected (none for an unknown value) and aria-activedescendant names it
- [ ] Arrow, Home, End and Page keys move the choice and skip disabled options
- [ ] Loop wraps arrows only; Home, End and Page never wrap
- [ ] Type-ahead chooses the matching enabled option
- [ ] Handled keys call preventDefault (Blazor excepted, see index.md)
- [ ] Choosing the held option is a no-op
- [ ] A disabled picker is not focusable and ignores keys and clicks
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.wheel-picker` in css-style-sheet-template.css
- Key model: shared/wheel-picker.ts
- [WAI-ARIA APG: Listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
- Origin: the chanhdai.com / sv-chanhdai `wheel-picker` ([chanhdai-lessons](../../spec/chanhdai-lessons/index.md) item 12)
