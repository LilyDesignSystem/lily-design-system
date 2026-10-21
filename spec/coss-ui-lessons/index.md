# Lessons from coss ui (planned work)

## Summary

Eight improvements to Lily, proposed 2026-10-21 from a review of
[coss ui-svelte](https://cossui-svelte.com/) (an unofficial community Svelte
port of [coss ui](https://coss.com/ui), "Built for developers and AI").
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

## Limits of the review

Only the home page, the docs landing page and the Field page of
cossui-svelte.com were readable, plus search results for the React original.
Its Get started and Styling pages, token system, dark-mode handling and any
accessibility testing were **not** seen, so nothing below is a claim about
them. Re-check before citing coss for anything beyond what is listed.

## The eight items

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
Lily has 27 skill packages (see [agent-skills](../agent-skills/index.md)).

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
- **Revised 2026-10-21:** the "validate on blur after first interaction" timing can
  be had natively from `:user-invalid` / `:user-valid`, which match only after the
  user has interacted; see [daisyui-lessons](../daisyui-lessons/index.md) item 5.
  Script is then needed only for the submit-time summary and focus move.
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

## Acceptance criteria

- [ ] 1. `recipes/` exists with the 15 Field recipes; `bin/check-recipes` passes in `bin/test`.
- [ ] 2. `/r/{slug}.json` and `/r/index.json` are generated, drift-checked and linked from both `llms.json` files.
- [ ] 3. `/components/{slug}.md` is served for all 571 components, with a Copy Markdown button.
- [ ] 4. The maintainer has decided which skill registries to list in; the entry skills are listed with consistent install text.
- [ ] 5. The validity timing is documented in `field` and `error-message`, with the 15 patterns tested.
- [ ] 6. `/chat-interface` ships in all seven example apps and passes axe and keyboard tests.
- [ ] 7. The "How the pieces fit" page exists.
- [x] 8. The predictability principle is in `AGENTS/headless.md` and the headless topic (2026-10-21).

## Related topics

[components](../components/index.md),
[llms-json-and-llms-txt](../llms-json-and-llms-txt/index.md),
[agent-skills](../agent-skills/index.md),
[examples](../examples/index.md),
[headless](../headless/index.md),
[citations](../citations/index.md).

## Sources

- [coss ui-svelte](https://cossui-svelte.com/), [its docs](https://cossui-svelte.com/docs) and [Field page](https://cossui-svelte.com/docs/components/field) (unofficial port; read 2026-10-21).
- [coss ui](https://coss.com/ui) and its [skills listing](https://www.skills.sh/cosscom/coss/coss-particles) (seen via search results only).
- [AGENTS/citations.md](../../AGENTS/citations.md), which already lists Coss UI.
