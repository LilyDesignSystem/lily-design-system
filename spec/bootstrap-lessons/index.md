# Lessons from Bootstrap (planned work)

## Summary

Ten improvements to Lily, plus items deliberately not adopted, proposed
2026-10-21 from a review of [Bootstrap](https://getbootstrap.com/): v5.3 is
the stable line; **v6.0.0-alpha.1** is the default docs version and is
described as "a framework-agnostic design toolkit for building anything,
usable by humans or AI" with CSS-first theming and more powerful JavaScript
plugins. Bootstrap is the most widely deployed design system there is, so its
conventions are what many adopters already know: this topic is about the
conventions worth meeting them with, and the adoption path from Bootstrap to
Lily. Nothing here is built yet: each item is an open acceptance criterion.

## Scope

### In scope

The ten items below, each with a deliverable, a source of truth and a check.

### Explicitly out of scope

- A utility-class CSS layer. Bootstrap's Utilities API (`.mt-3`, `.d-flex`, …)
  is a CSS framework; Lily's root spec rules a CSS framework dependency out
  and the headless layer ships no CSS. Consumers who want utilities use
  Tailwind or their own.
- A built-in grid system, Sass sources, or a Sass-variable theming API: Lily
  themes are plain CSS custom properties (the 57 `themes/`).
- Bootstrap's tooltip/popover HTML sanitizer: Lily components take slots and
  strings, not HTML option strings, so there is nothing to sanitize.
- jQuery plugin registration.

## Limits of the review

Read: the v6 home page, the 5.3 introduction (sidebar only, plus general
knowledge flagged as such), and the 5.3 pages on JavaScript, CSS variables,
accessibility, color modes and form validation, and the v6 "Bootstrap & AI
docs" page. Not read: the Sass, utilities, RTL, layout and component pages in
detail, and anything about Bootstrap 6's actual component API. v6 is alpha;
cite 5.3 for anything behavioural.

## What Lily already matches

So these are not proposed again: every one of the 57 themes sets
`color-scheme` and uses logical (inline-start/end) properties for RTL; themes
already expose a `--lily-focus-ring` token; `data-theme` switches modes;
`screen-reader-span`, `skip-link`, `aspect-ratio-container`, `flex-stack`,
`clamp-text`, `skeleton` and `contents-nav` (with scroll-spy) cover the
visually-hidden, ratio, stack, truncation, placeholder and scrollspy helpers;
`prefers-reduced-motion` is honoured by `motion-picker`; the `llms.txt` pair
exists; and `bin/check-theme --contrast` already measures contrast.

## The items

### 1. Component-scoped CSS variables (the "local variable" pattern)

Bootstrap increasingly declares variables at the component root
(`.navbar { --bs-navbar-padding-x: … }`, `--bs-btn-*`, `--bs-table-*`) and
reads them in every sub-selector. Its stated benefits: a smaller compiled
stylesheet, no inheritance leaking into nested tables, and restyling one
instance after compilation without Sass.

- **Deliverable:** each theme defines a short, **documented** set of
  per-component variables on the base class under `:where(...)`, defaulting to
  the global `--lily-*` tokens (for example
  `:where(.button){ --lily-button-bg: var(--color-primary); … }`), so a
  consumer restyles one button with `style="--lily-button-bg: …"` or one
  rule, without forking a theme.
- **Rule:** the variables are a stable contract like sub-classes; the
  component's `AGENTS.md` Styles section lists them.
- **Pilot:** `button`, `alert`, `card`, `table`, `dialog` before the rest.
- **Check:** `bin/check-theme` fails when a theme lacks a documented variable
  or hard-codes a value the variable should carry.

### 2. Scoped modes and an explicit auto mode

Bootstrap's `data-bs-theme="dark"` works on `<html>` **or any element**
(a dark dropdown inside a light page); "auto" follows `prefers-color-scheme`
and updates live; a snippet in `<head>` sets the attribute before first paint
to avoid a flash.

- **Deliverable (a):** document, in [theme-picker](../theme-picker/index.md)
  and [theme](../theme/index.md), the no-flash head snippet for static and
  SSR pages (read the stored slug, else `prefers-color-scheme`, set
  `data-theme` on the root before the body renders). Check whether the
  existing detect-from-system option already makes this unnecessary in each
  catalog; the Nunjucks and HTML catalogs are the likely gaps.
- **Deliverable (b):** scoped modes and a light/dark *mode* axis separate from
  the theme slug. Today every theme selects `:root[data-theme="x"]`, so a
  theme can only apply to the whole document, and each of the 57 files carries
  the same ~3,700 lines of component rules (verified 2026-10-21: the component
  sections of all 57 are byte-identical). The enabling change is in
  [daisyui-lessons](../daisyui-lessons/index.md) item 1 (token-only themes on
  `[data-theme]`); decide the mode axis after that lands.
- **Check:** (a) an e2e test that loads a page with a stored dark theme and
  asserts the first paint already carries it.

### 3. Paired, cancelable lifecycle events

Bootstrap fires an infinitive event when an action starts
(`show.bs.modal`, cancelable with `preventDefault()`) and a past-participle
event when it finishes (`shown.bs.modal`). Lily's events are ad hoc:
`navigate` (cancelable) on the link picker, `close` on dismissibles,
`lily:confirm` / `lily:cancel`, `overlay-close`.

- **Deliverable:** one convention in [headless](../headless/index.md): every
  openable component emits a **cancelable** `lily:open` / `lily:close` before
  the change and a non-cancelable `lily:opened` / `lily:closed` after, bubbling,
  with `detail: { trigger }`; selection components emit `lily:select`. Existing
  event names stay as aliases for one minor release.
- **Reach:** the HTML, Alpine and Web Components catalogs (DOM events) define
  it; the framework catalogs map it to their own callback props
  (`onOpenChange` already exists in several).
- **Check:** a conformance test per interactive component in the three
  DOM-event catalogs.

### 4. An imperative API on the element

Bootstrap offers `getInstance` / `getOrCreateInstance` and
`.show()` / `.hide()` / `.toggle()` beside the data attributes, and
documents that methods return when the transition *starts*.

- **Deliverable:** in the HTML, Alpine and Web Components catalogs, every
  openable element exposes `open()`, `close()`, `toggle()` and an `open`
  property reflecting state. Web Components can implement them natively; the
  Alpine plugin already holds `open` and needs only methods on the data
  object; the HTML snippets get a tiny shared helper.
- **Rule:** calls made while a transition is running are ignored only if a
  transition exists; Lily ships none, so state changes are synchronous and
  that must be documented as a difference.
- **Check:** one test per catalog calls each method and asserts ARIA and the
  event pair from item 3.

### 5. Say what is *not* accessible, per component

Bootstrap's accessibility page states plainly that its client-side custom
validation styles and tooltips "are not currently accessible", recommends
alternatives, warns that default palette colours can fail contrast, and says
generic components often need extra ARIA from the author, "usually noted" in
each component's docs. Lily's docs assert a WCAG 2.2 AAA target, and say less
about where that target is not met.

- **Deliverable (a):** a mandatory **Known limitations** section in every
  component's `AGENTS.md` and `index.md` (empty is allowed, and then says
  "none known"), listing screen-reader, browser or pointer limits found in
  testing, plus what the consumer must add.
- **Deliverable (b):** publish `bin/check-theme --contrast` as a table on the
  docs site, per theme, with the AAA/AA pass or fail per token pair, and link
  it from each theme's entry in the theme picker docs. A theme that fails
  AAA says so.
- **Rule:** no component offers tooltip-style form errors. Errors are text
  linked with `aria-describedby` (see item 8); record this as a "When Not to
  Use" entry for any future tooltip-error component.
- **Check:** `bin/test` fails when a component doc lacks the section.

### 6. Task-shaped agent skills, and a `skills add` install line

Bootstrap v6 ships skills by *task*, installed with
`npx skills add twbs/bootstrap`: `bootstrap-v6-install`, `-npm`, `-webpack`,
`-parcel`, `-vite`, `-component`, `-component-js`, `-color-system`,
`-utility-api`, and migration skills (4 to 6, 5 to 6). Lily's 27 skills are
organised by *framework* and layer.

- **Deliverable:** add task skills that cut across frameworks, in the
  Bootstrap style: `lily-design-system-install` (per framework),
  `lily-design-system-add-component` (the `bin/new-component` flow),
  `lily-design-system-theme` (token and theme authoring),
  `lily-design-system-migrate-from-bootstrap` (item 7). Each is a step-by-step
  playbook with a `description` that tells the agent when it applies.
- **Install line:** document `npx skills add LilyDesignSystem/lily-design-system`
  once the skills sit in a `skills/` directory the CLI can find; the listing
  decision belongs to the maintainer (see [coss-ui-lessons](../coss-ui-lessons/index.md)
  item 4).
- **Check:** the skills topic ([agent-skills](../agent-skills/index.md))
  lists each; `bin/check-links` covers the references.

### 7. A Bootstrap-to-Lily migration guide

Bootstrap publishes migration guides and now migration *skills*; Lily has
`COMPARISONS.md` but nothing aimed at the large number of teams starting on
Bootstrap.

- **Deliverable:** `MIGRATING-FROM-BOOTSTRAP.md` (and a docs-site page): a
  table from Bootstrap component or class to the Lily component, the
  differences that matter (Lily ships no CSS: take a theme; text is a prop;
  no utility classes), a worked page conversion, and the accessibility gains
  to expect. Generated in part from `components-categories.tsv` so the mapping
  cannot name a missing slug.
- **Check:** every Lily slug in the table exists (`bin/check-links` plus a
  slug check).

### 8. Validation hooks, aligned with the coss item

Bootstrap builds on native constraint validation: `novalidate` plus
`checkValidity()` in a submit handler, a `.was-validated` class on the form
to reveal `:valid` / `:invalid` styling (without it, required fields look
invalid on load), server-side `.is-invalid` with `aria-describedby`, and
`setCustomValidity()` for messages. It also states which of those are
accessible.

- **Deliverable:** this feeds item 5 of
  [coss-ui-lessons](../coss-ui-lessons/index.md): the validity timing doc for
  `field` and `error-message` adopts the same two hooks: a
  `data-validated` attribute on the form that gates invalid styling, and
  `aria-invalid` plus `aria-describedby` on the control. The headless layer
  ships no rules.
- **Revised 2026-10-21:** [daisyui-lessons](../daisyui-lessons/index.md) item 5
  proposes the native `:user-invalid` instead of a `data-validated` form hook,
  which removes the need for script to gate invalid styling. Decide there first;
  keep this hook only as the fallback if the browser-support floor requires it.
- **Check:** shared with that item's e2e tests.

### 9. A published focus-ring contract, and a stretched-link pattern

Bootstrap 5.3 added `--bs-focus-ring-width`, `-opacity` and `-color`
variables and a focus-ring helper, and a stretched link that makes a whole
card clickable through one real link. Lily's themes already carry
`--lily-focus-ring`.

- **Deliverable (a):** document the focus tokens as a contract (width, offset,
  colour, and a high-contrast fallback) and state the WCAG 2.2 criterion each
  satisfies (2.4.7 focus visible, 2.4.11 not obscured, 2.4.13 focus
  appearance at AAA). `bin/check-theme` already runs; add the focus-ring pair
  to its contrast check.
- **Deliverable (b):** a documented "whole-card link" recipe for `card`: one
  `<a>` in the heading whose `::after` covers the card (consumer CSS), with
  nested links and buttons kept above it. This is a recipe (see
  [coss-ui-lessons](../coss-ui-lessons/index.md) item 1), not a new
  component.
- **Check:** (a) the contrast check; (b) a recipe test asserting one link and
  a visible focus indicator.

### 10. Starters, versioned docs, and an optimize guide

Bootstrap offers a starter template plus Webpack, Parcel and Vite guides, a
version switcher (v6 alpha, 5.3, 4.6, …), and an "Optimize" page.

- **Deliverable (a):** one **minimal starter** per framework family (about ten
  files: the headless package, one theme, a layout with a skip link and the
  picker bar) distinct from the 581-page example apps, so a new project does
  not begin by deleting an example.
- **Deliverable (b):** a docs-site version switcher once the first 1.0 is cut;
  until then, state the version on every page. Not before 1.0.
- **Deliverable (c):** an "Optimize" page: import only the components you use,
  what each catalog tree-shakes, and measured sizes taken from
  `BENCHMARKS.md`.
- **Check:** each starter builds in CI.

## Not adopted

| Bootstrap idea | Why not |
| -------------- | ------- |
| Utilities API and generated utility classes | A CSS framework; ruled out by the root spec |
| `llms-full.txt` (Bootstrap publishes it) | [llms-json-and-llms-txt](../llms-json-and-llms-txt/index.md) records a decision against it; revisit only if that spec's reason (a curated map beats a content dump) stops holding; its absence of a generator is not by itself a reason |
| Sass sources and `$enable-dark-mode`-style options | Lily themes are plain CSS |
| Tooltip-style validation feedback | Bootstrap documents it as inaccessible (item 5) |
| HTML sanitizer for option strings | No such options exist |

## Acceptance criteria

- [ ] 1. Per-component variables are documented and checked for the pilot five components.
- [ ] 2. The no-flash snippet is documented and tested in the catalogs that need it; the mode-axis question is decided or recorded as declined.
- [ ] 3. The paired `lily:open` / `lily:close` event convention is in the headless topic and tested in the DOM-event catalogs.
- [ ] 4. `open()` / `close()` / `toggle()` exist on openable elements in HTML, Alpine and Web Components.
- [ ] 5. Every component doc has a Known limitations section; the theme contrast table is published.
- [ ] 6. The task skills exist and are listed in the agent-skills topic.
- [ ] 7. `MIGRATING-FROM-BOOTSTRAP.md` exists with a slug-checked mapping table.
- [ ] 8. The validation hooks match the coss-ui-lessons item 5 docs.
- [ ] 9. Focus tokens are a documented, contrast-checked contract; the whole-card recipe exists.
- [ ] 10. Starters, the optimize page and (post-1.0) the version switcher exist.

## Related topics

[theme](../theme/index.md), [theme-picker](../theme-picker/index.md),
[headless](../headless/index.md), [accessibility](../accessibility/index.md),
[agent-skills](../agent-skills/index.md),
[llms-json-and-llms-txt](../llms-json-and-llms-txt/index.md),
[coss-ui-lessons](../coss-ui-lessons/index.md),
[shardsui-lessons](../shardsui-lessons/index.md),
[citations](../citations/index.md).

## Sources

- [Bootstrap](https://getbootstrap.com/) (v6.0.0-alpha.1 home page; read 2026-10-21).
- [JavaScript](https://getbootstrap.com/docs/5.3/getting-started/javascript/), [CSS variables](https://getbootstrap.com/docs/5.3/customize/css-variables/), [Color modes](https://getbootstrap.com/docs/5.3/customize/color-modes/), [Accessibility](https://getbootstrap.com/docs/5.3/getting-started/accessibility/), [Form validation](https://getbootstrap.com/docs/5.3/forms/validation/) (5.3).
- [Bootstrap & AI docs](https://getbootstrap.com/docs/6.0/getting-started/ai/) (v6 alpha).
- Lily's own state: [themes/](../../themes/), [bin/check-theme](../../bin/check-theme), [COMPARISONS.md](../../COMPARISONS.md).
