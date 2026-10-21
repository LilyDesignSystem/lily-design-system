# Lessons from coss ui and ShardsUI (planned work)

## Summary

Twelve improvements to Lily, plus open questions, proposed 2026-10-21 from
two reviews: [coss ui-svelte](https://cossui-svelte.com/) (an unofficial
community Svelte port of [coss ui](https://coss.com/ui), "Built for
developers and AI") for items 1-8, and [ShardsUI](https://shardsui.com/) (an
unstyled Svelte 5 port "adapted from Base UI", the base coss ui-svelte
builds on) for items 9-12.
Nothing here is built yet: this topic is the plan, and each item is an
open acceptance criterion below. Lily is already ahead of coss on catalog
size (571 against 72), the WCAG 2.2 AAA target, the i18n rule and framework
count (eight against one); the items are about the *surface around the
components*, which is where coss is ahead.

## Scope

### In scope

The eight items below, each with a deliverable, a source of truth and a
check.

### Explicitly out of scope

- **Catalog parity.** coss's component list is mostly already in Lily
  under other names (`segment-group`, `step-list`, `timeline-list`,
  `hover-card`, `splitter`, `image-cropper`, `chat-composer`, `tile-map`,
  `empty-state`, `number-input`). Do not add components to match it.
- **Map, Places autocomplete (Google), rich editor.** They need network
  access or a large dependency, which the root spec's out-of-scope list
  (no data fetching, no bundled assets) rules out.
- Any Tailwind or CSS-framework dependency.

## Limits of the reviews

ShardsUI: only the home page and the Menu page were readable; its quick-start
and overview pages returned 404, and a search found nothing about it, so its
maintainer, testing, styling guide and animation guide are unknown. It is
beta (`v0.1.0-beta.2`, "expect API change, and bugs").

coss ui-svelte: only the home page, the docs landing page and the Field page of
cossui-svelte.com were readable, plus search results for the React original.
Its Get started and Styling pages, token system, dark-mode handling and any
accessibility testing were **not** seen, so nothing below is a claim about
them. Re-check before citing coss for anything beyond what is listed.

## The twelve items

### 1. A recipes ("particles") layer

coss ships 691 *particles*: small pre-assembled patterns, tagged by
component, copy-paste ready, each with a JSON manifest. Lily has
components and 12 composed pages but nothing between the two.

- **Deliverable:** `recipes/{component-slug}/{recipe-name}.html`, a
  framework-neutral semantic-HTML snippet in the Alpine/HTML snippet format
  (copy-paste is already how that format works), with a front-matter block
  (`title`, `components`, `tags`).
- **Surfaces:** a "Recipes" section on each component's docs page, and a
  tag-filterable `/recipes` index on the site.
- **First recipes:** the 15 "Field with X" patterns from item 5.
- **Rule:** a recipe composes catalog components only; no new CSS, no new
  strings (placeholder text only, per the i18n rule).
- **Check:** `bin/check-recipes` (every `components:` entry is a real slug;
  every recipe parses; every recipe's root classes begin with a catalog
  slug).

### 2. A per-component machine manifest

coss serves `https://coss.com/ui/r/<name>.json` per item. Lily has
`llms.json` (one curated map) and `components.tsv` (name and description
only).

- **Deliverable:** `/r/{slug}.json` on the docs site, generated, holding:
  slug, name, description, HTML tag, base class, sub-classes, ARIA, keyboard
  contract, props, children/related components, and the per-framework file
  paths (all eight catalogs).
- **Source of truth:** `components/{slug}/AGENTS.md` and
  `components-categories.tsv`; this extends `bin/generate-api-docs`, which
  already reads the same files. Do not hand-edit the output.
- **Also:** `/r/index.json` listing every slug, and a link from both
  `llms.json` files.
- **Check:** `--check` drift mode, wired into `bin/test` like the other
  generators.

### 3. "Copy Markdown" on every docs page

- **Deliverable:** `/components/{slug}.md` (the component's `index.md`,
  served verbatim) and a "Copy Markdown" button plus a visible `.md` link on
  the component page.
- **Rule:** the button copies exactly the served file; the site adds no
  second copy of the prose.
- **Accessibility:** a real `<button>` with a text name and a polite status
  message on success (the `clipboard-copy-button` component, dogfooded).
- **Check:** `bin/generate-sitemap --check` and `bin/check-links` cover the
  new routes.

### 4. Publish the skills where agents look

coss lists its skills (`coss`, `coss-particles`) on skills.sh and tessl.
Lily has 26 skill packages (see [agent-skills](../agent-skills/index.md)).

- **Deliverable:** confirm which registries index the skills; list the two
  entry skills (`lily-design-system-skill`,
  `lily-design-system-maintainer-skill`) in each, with identical install
  instructions in their `index.md` and in `llms.txt`.
- **Not decided:** whether to list the 24 framework skills too. Listing is
  outward-facing and hard to retract, so it needs the maintainer's explicit
  go-ahead per registry.
- **Check:** the install snippet in each skill's `index.md` matches the one
  in the root `llms.txt` (extend `bin/check-links` or a small checker).

### 5. Validity as a documented pattern

coss's `FieldValidity` exposes `validity`, `error`, `errors`, `value` to a
render snippet and its Field page has 15 examples (Required, Disabled, With
Error, With Validity, Input Group, Autocomplete, Combobox, Textarea, Select,
Checkbox, Checkbox Group, Radio Group, Switch, Slider, Number Field,
Complete Form). Its page leaves *when* an error appears undefined.

- **Deliverable:** in `field` and `error-message`, document the native
  `ValidityState` flow Lily relies on, and **define the timing**: validate
  on blur after first interaction, re-validate on input once an error is
  shown, and validate everything on submit, moving focus to the
  `error-summary`.
- **Examples:** the same 15 as recipes (item 1), each wiring `aria-invalid`,
  `aria-describedby` / `aria-errormessage` and the error text.
- **Rule:** headless layer ships no validation rules (they stay the
  consumer's); the pattern only wires the attributes.
- **Check:** one e2e test per pattern asserting the ARIA wiring and focus
  movement, in the example apps.

### 6. A chat composed page

Lily has `chat-nav`, `chat-list`, `chat-message`, `chat-composer`,
`streaming-text` and `tool-call` (+ parts) but no composed page; coss gives
Chat UI its own docs section.

- **Deliverable:** a `/chat-interface` composed page in every example app
  (alongside the 12 in [examples](../examples/index.md)): a conversation,
  a streaming reply, a tool call that errors, and the composer with stop.
- **Rule:** scripted content only; no network, no model calls.
- **Check:** an axe sweep and a keyboard-only Playwright test per app, like
  the other composed pages.

### 7. Name the layers

coss: primitives, particles, blocs. Lily: headless, helpers, examples (plus,
after item 1, recipes).

- **Deliverable:** a short "How the pieces fit" page on the site and a
  matching section in the root `index.md`, mapping each layer to what it
  owns and when to reach for it.
- **Check:** `bin/check-links`.

### 8. State the LLM-readability principle

coss promises code that is "clear, readable, and predictable, so that
language models can understand, reason about, and modify them". Lily already
behaves this way (class-first rule, suffix to element table, per-component
`AGENTS.md`) but never says so.

- **Deliverable:** one principle in [headless](../headless/index.md) and
  `AGENTS/headless.md`: *predictability is a feature*. Names, tags and
  sub-classes follow the suffix table; a component's behaviour must be
  derivable from its slug and its `AGENTS.md`; exceptions are documented in
  that component's `AGENTS.md`, not left implicit.
- **Check:** none beyond review; it is a design rule.

### 9. One state data-attribute vocabulary

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

### 10. Missing menu parts

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

### 11. Document behaviour defaults as props

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

### 12. Published positioning variables

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
  the better contract; item 9 extends it to cover the state vocabulary.

## Acceptance criteria

- [ ] 1. `recipes/` exists with the 15 Field recipes; `bin/check-recipes` passes in `bin/test`.
- [ ] 2. `/r/{slug}.json` and `/r/index.json` are generated, drift-checked and linked from both `llms.json` files.
- [ ] 3. `/components/{slug}.md` is served for all 571 components, with a Copy Markdown button.
- [ ] 4. The maintainer has decided which skill registries to list in; the entry skills are listed with consistent install text.
- [ ] 5. The validity timing is documented in `field` and `error-message`, with the 15 patterns tested.
- [ ] 6. `/chat-interface` ships in all seven example apps and passes axe and keyboard tests.
- [ ] 7. The "How the pieces fit" page exists.
- [ ] 8. The predictability principle is in `AGENTS/headless.md` and the headless topic.
- [ ] 9. The state data-attribute vocabulary is documented, audited and checked by `bin/check-data-attributes`.
- [ ] 10. The five menu parts exist in `components.tsv` and all eight headless libraries.
- [ ] 11. Every interactive component's Props section lists its behavioural defaults.
- [ ] 12. Popup components document their published custom properties, each tested.
- [ ] Open questions above are decided, or recorded as declined.

## Related topics

[components](../components/index.md),
[llms-json-and-llms-txt](../llms-json-and-llms-txt/index.md),
[agent-skills](../agent-skills/index.md),
[examples](../examples/index.md),
[headless](../headless/index.md),
[citations](../citations/index.md).

## Sources

- [coss ui-svelte](https://cossui-svelte.com/), [its docs](https://cossui-svelte.com/docs) and [Field page](https://cossui-svelte.com/docs/components/field) (unofficial port; read 2026-10-21).
- [ShardsUI](https://shardsui.com/) and its [Menu page](https://shardsui.com/svelte/menu) (beta; read 2026-10-21).
- [coss ui](https://coss.com/ui) and its [skills listing](https://www.skills.sh/cosscom/coss/coss-particles) (seen via search results only).
- [AGENTS/citations.md](../../AGENTS/citations.md), which already lists Coss UI.
