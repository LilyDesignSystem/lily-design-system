# Lessons from ShardsUI (planned work)

## Summary

Four improvements to Lily, plus open questions, proposed 2026-10-21 from a
review of [ShardsUI](https://shardsui.com/): an unstyled, accessible set of
35 Svelte 5 components "adapted from Base UI", beta (`v0.1.0-beta.2`, "expect
API change, and bugs"). It is the base that
[coss ui-svelte](https://cossui-svelte.com/docs) builds on, so this topic is
the companion to [coss-ui-lessons](../coss-ui-lessons/index.md); the items
here are about the *component contracts* (state vocabulary, menu parts,
documented defaults), where that topic's are about the surface around them.
Nothing here is built yet: each item is an open acceptance criterion below.

## Scope

### In scope

The four items below, each with a deliverable, a source of truth and a check,
and the open questions that need a maintainer decision.

### Explicitly out of scope

- Catalog parity: ShardsUI has 35 components, Lily 581.
- Copying ShardsUI's beta API churn; Lily's stable sub-class rule stays.
- Portals and JavaScript positioning: Lily's popups are positioned by
  consumer CSS (the themes use CSS anchor positioning).

## Limits of the review

Only ShardsUI's home page and its Menu page were readable. Its quick-start
and overview pages returned 404, and a search found nothing independent about
it, so its maintainer, testing, styling guide and animation guide are
unknown. Do not cite ShardsUI for anything beyond the Menu page and the
component list.

What the Menu page showed: a part-per-role structure (Root, Trigger, Portal,
Backdrop, Positioner, Popup, Arrow, Viewport, Item, LinkItem, Group,
GroupLabel, RadioGroup, RadioItem, CheckboxItem, indicators, Submenu parts), a
documented default for every behavioural prop, state published as data
attributes, and positioning published as CSS variables.

## The items

### 1. One state data-attribute vocabulary

ShardsUI exposes every part's state as data attributes (`data-open` /
`data-closed`, `data-highlighted`, `data-checked` / `data-unchecked`,
`data-disabled`, `data-popup-open`, `data-side`, `data-align`). Lily uses
`data-open`, `data-active`, `data-selected`, `data-expanded` and others
unevenly: building the Alpine overlays showed `data-open` on some parts and
not on their siblings.

- **Deliverable:** one vocabulary in `AGENTS/headless.md` and the
  [headless](../headless/index.md) topic: `data-open` / `data-closed` for
  disclosure state, `data-highlighted` for the roving/active item,
  `data-checked` / `data-unchecked`, `data-disabled`, `data-side` /
  `data-align` for placed popups. ARIA remains the assistive-technology
  signal; these are for consumer CSS and JS only, as the root rule says.
- **Migration:** an audit table of today's attributes per component; renames
  are breaking, so keep the old attribute alongside the new one for one minor
  release and list both in each component's `AGENTS.md`.
- **Check:** a `bin/check-data-attributes` that fails on an attribute outside
  the vocabulary (an allow-list file for per-component exceptions).

### 2. Missing menu parts

Lily's menu family is flat: `menu`, `menu-item`, `menu-group`, `menu-bar`,
`dropdown-menu`, `context-menu`. ShardsUI's has checkbox items, radio
groups and items, group labels, link items and separators.

- **Deliverable:** `menu-checkbox-item` (`role="menuitemcheckbox"`),
  `menu-radio-group` + `menu-radio-item` (`role="menuitemradio"`),
  `menu-group-label` (labels a `role="group"`), `menu-link-item` (a real
  `<a>`, so middle-click and copy-link work) and `menu-separator`
  (`role="separator"`). Contracts follow the WAI-ARIA APG menu pattern.
- **Reach:** catalog entries in `components.tsv` first, then all eight
  headless libraries via `bin/new-component`; the Alpine plugin's
  `lilyMenu` / `lilyDropdownMenu` items must handle the checked and radio
  roles.
- **Check:** per-component unit tests plus the standard coverage matrix.

### 3. Document behaviour defaults as props

ShardsUI states a default for every behavioural option: `loopFocus` (true),
`closeOnClick` (true for items, false for checkbox and radio items),
`openOnHover` (false), `delay` (100 ms), `closeDelay` (0), `modal` (true),
`highlightItemOnHover` (true).

- **Deliverable:** in each interactive component's `AGENTS.md` Props section,
  list every behavioural option with its default, even when Lily hard-codes it
  today (wrap-around focus, close on select). A hard-coded behaviour is
  documented as "fixed"; an option is added only when a real consumer needs
  it.
- **Why:** an agent or maintainer cannot tell from the docs whether
  `loopFocus` is configurable or fixed.
- **Check:** extend `bin/generate-api-docs` to fail when an interactive
  component's keyboard section mentions wrapping, closing or delay without a
  matching Props entry.

### 4. Published positioning variables

ShardsUI's positioner publishes `--anchor-width`, `--anchor-height`,
`--available-width`, `--available-height` and `--transform-origin`. Lily's
57 themes already position popups with CSS anchor positioning, and the
Alpine context menu already publishes `--context-menu-x` / `--context-menu-y`.

- **Deliverable:** a documented set of custom properties per popup component
  (`popover`, `tooltip`, `dropdown-menu`, `context-menu`, `hover-card`,
  `combobox`, pickers) listed in its `AGENTS.md`, written only where the
  component already computes the value (for example from a pointer event).
  The headless layer does not measure anchors itself.
- **Rule:** custom properties applied as variables are the permitted inline
  style; nothing else.
- **Check:** a test per component that reads the documented properties.

## Open questions (not yet items)

- **Animation hooks.** ShardsUI sets `data-starting-style` /
  `data-ending-style` so CSS can animate enter and exit. Lily's rule is that
  headless components never animate; the practical cost is that `hidden`
  removes an element at once, so consumers cannot animate exit. Option: an
  opt-in transition-status attribute set by the component while Lily ships no
  motion, honouring `motion-picker` and `prefers-reduced-motion`. Needs a
  maintainer decision because it touches the "no animation" rule.
- **Submenus.** Lily has none. ShardsUI's `openOnHover`, delays and focus
  rules are substantial; give it its own topic if wanted.
- **Detached triggers.** A trigger away from its menu is already expressible
  with `aria-controls`; document the pattern in `dropdown-menu`, and in the
  Alpine plugin allow `trigger` and `menu` to bind to separate elements.
- **Not copied:** ShardsUI's beta API churn. Lily's stable sub-class rule is
  the better contract; item 1 extends it to cover the state vocabulary.

## Acceptance criteria

- [ ] 1. The state data-attribute vocabulary is documented, audited and checked by `bin/check-data-attributes`.
- [ ] 2. The five menu parts exist in `components.tsv` and all eight headless libraries.
- [ ] 3. Every interactive component's Props section lists its behavioural defaults.
- [ ] 4. Popup components document their published custom properties, each tested.
- [ ] The open questions above are decided, or recorded as declined.

## Related topics

[coss-ui-lessons](../coss-ui-lessons/index.md),
[headless](../headless/index.md),
[components](../components/index.md),
[accessibility](../accessibility/index.md),
[theme](../theme/index.md).

## Sources

- [ShardsUI](https://shardsui.com/) and its [Menu page](https://shardsui.com/svelte/menu) (beta; read 2026-10-21).
- [coss ui-svelte docs](https://cossui-svelte.com/docs), which names ShardsUI as its base.
- [WAI-ARIA APG: menu and menubar](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/).
