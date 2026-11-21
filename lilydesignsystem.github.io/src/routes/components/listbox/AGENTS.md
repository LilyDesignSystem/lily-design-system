# Listbox

## Metadata

- Component: listbox
- PascalCase: Listbox
- Description: a list of selectable options with keyboard navigation
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <div>
- CSS class: .listbox
- Interactive: yes

## Key Behaviors

- Renders a `<div>` with `role="listbox"` and an accessible label.
- Uses reactive state to track the `listRef` element reference for querying child options.
- Keyboard navigation queries all child elements with `[role='option']` to build the navigable item list.
- Arrow keys wrap around: pressing ArrowDown on the last item moves focus to the first, and vice versa.
- Home and End keys jump to the first and last option respectively.
- Spreads `restProps` onto the container for consumer customization.

## ARIA

- `role="listbox"` -- identifies the container as a listbox widget for selecting from a list of options.
- `aria-label` -- provides an accessible name describing the purpose of the listbox.
- Child elements should use `role="option"` and optionally `aria-selected` to indicate selection state.

## Keyboard

- ArrowDown: Moves focus to the next option, wrapping to the first option from the last.
- ArrowUp: Moves focus to the previous option, wrapping to the last option from the first.
- Home: Moves focus to the first option.
- End: Moves focus to the last option.

## Props

- `label`: string (required) -- accessible name applied via `aria-label`.
- `children`: slot (required) -- option elements to render inside the listbox (should have `role="option"` and `tabindex="-1"`).
- `as`: string (default: `"div"`) -- the root element. The pickers set `"ul"` for their `<ul class="{helper}-list">`; Blazor and Nunjucks always render `<ul>`.
- `baseClass`: string (default: `"listbox"`) -- the base class token, replaced outright (not appended), for a helper whose contract needs its own class.
- `navigation`: `"roving-focus"` | `"active-descendant"` (default: `"roving-focus"`) -- options take focus in turn, or focus stays on the listbox and `aria-activedescendant` names the active option.
- `activeIndex`: number (default: `-1`; bindable) -- the active option in active-descendant mode; -1 is none.
- `clamp`: boolean (default: `false`) -- arrow keys stop at the first and last option instead of wrapping (active-descendant mode).
- `typeahead`: boolean (default: `false`) -- printable characters move to the next option whose label starts with them (active-descendant mode).
- `pageSize`: number (default: `10`) -- how far PageUp and PageDown move (active-descendant mode).
- `onActivate`: (index: number) => void -- Enter or Space on the active option (active-descendant mode).
- `onEscape`: () => void -- Escape pressed (active-descendant mode).
- `onTabOut`: (event: KeyboardEvent) => void -- Tab pressed, before focus moves; Tab is never prevented (active-descendant mode).
- `ref`: HTMLElement (bindable) -- the rendered root element.
- `...restProps`: unknown -- additional attributes spread onto the root element.

## Option groups

Long lists group their options under headings, as the WAI-ARIA APG grouped listbox does (tasks.md P40-T4). Groups are the
consumer's markup; no prop is needed:

- Wrap each group's options in an element with `role="group"`, labelled by its heading through `aria-labelledby`.
- The heading has `role="presentation"` and an `id`; it is not an option and is never focused or selected.
- The listbox finds options in document order through the groups, so ArrowDown on a group's last option moves to the next
  group's first, Home and End reach the first and last option of the whole list, and type-ahead searches every group.
- In a `<ul>` listbox (Nunjucks), each group is `<li role="presentation"><ul role="group" aria-labelledby="…">`, with the
  heading as its first `<li role="presentation">`.
- In Blazor, `OptionCount`, `OptionId` and `OptionLabel` count options across all groups by index.
- Keep group headings short and in the consumer's words; a list of a few options needs no groups.

```html
<div
  class="listbox"
  role="listbox"
  aria-label="Diagnosis codes"
>
  <div
    role="group"
    aria-labelledby="codes-common"
  >
    <div
      role="presentation"
      id="codes-common"
    >
      Common
    </div>
    <div
      role="option"
      tabindex="0"
      aria-selected="false"
    >
      Asthma
    </div>
    <div
      role="option"
      tabindex="-1"
      aria-selected="false"
    >
      Hypertension
    </div>
  </div>
  <div
    role="group"
    aria-labelledby="codes-recent"
  >
    <div
      role="presentation"
      id="codes-recent"
    >
      Recently used
    </div>
    <div
      role="option"
      tabindex="-1"
      aria-selected="false"
    >
      Migraine
    </div>
  </div>
</div>
```

## Native platform

- Decision: hand-rolled because the APG listbox needs aria-activedescendant mode, typeahead and rich option content, and the helpers compose it inside a popup; <select size> renders only text options
- Uses: none (svelte:element role="listbox"; roving tabindex or aria-activedescendant)
- Could use: <select size> / <select multiple>
- Notes: In-page; not itself an overlay. Watch, not adopted (2026-11-21, P23-T10): the focusgroup attribute could replace the scripted arrow-key focus, but it ships only in Chrome and Edge 150 (webstatus.dev, limited availability); Firefox has a positive position and no implementation, and WebKit lists concerns. Revisit when a second engine ships it.
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <div> element with class="listbox"
- [ ] Has aria-label attribute
- [ ] Has role="listbox"
- [ ] Keyboard navigation works correctly
- [x] Option groups: the keys cross groups and type-ahead searches every group, in every catalog
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .listbox in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/listbox.html
- WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
