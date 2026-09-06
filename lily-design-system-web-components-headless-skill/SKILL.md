---
name: lily-design-system-web-components-headless-skill
description: Explains Lily Design System's native Web Components headless catalog — plain custom elements (`class X extends HTMLElement`, tags like `<lily-button>`), no framework runtime, no build step to consume. Use when someone asks how to use Lily Design System's native Web Components, wants the custom-element usage idiom, needs to know exactly which of the 491 catalog components this growing partial catalog actually covers, asks why it isn't full parity with the other seven catalogs, or asks about autonomous custom elements vs. customized built-ins or light-DOM-only architecture.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — Web Components headless usage

`lily-design-system-web-components-headless` ships a slice of Lily's
canonical component catalog as **native custom elements** — plain
TypeScript classes extending `HTMLElement`, registered as
`customElements.define("lily-{slug}", X)` — with no framework runtime, no
JSX, no build-time template compiler. **It is a deliberately partial
catalog, growing toward full parity: 125 of the canonical 491 components as of 2026-09-06, not yet full parity with the seven
full-catalog headless libraries (HTML, Svelte, React, Vue, Angular, Blazor,
Nunjucks).** It proves the pattern works end to end (real, tested,
buildable, Storybook-documented) across every major category; it is not a
claim of completeness. Never imply broader coverage than what is actually implemented — check spec/index.md for the current count — if
someone needs a component this catalog doesn't ship, point them at one of
the seven full-catalog libraries instead.

Root of the ecosystem: [../spec/index.md](../spec/index.md). The general
Lily concepts skill: [../lily-design-system-skill/](../lily-design-system-skill/).

## What's actually implemented

The original 33-component slice spans every major category rather than
clustering in one: 8 buttons/links (Button, ToggleButton, SwitchButton,
IconButton, FloatButton, ClipboardCopyButton, BackLink, ActionLink), 5
forms (TextInput, EmailInput, TelInput, CheckboxGroup, Fieldset), 4
overlays (Dialog, AlertDialog, ContextualHelp, Coachmark), 6 media/data
(AvatarImage, Figure, FeaturePhoto, Progress, Meter, BarChart), 7 content
(Alert, Banner, Card, Badge, Blockquote, InformationCallout,
WarningCallout), and the 3-component breadcrumb navigation family
(BreadcrumbNav, BreadcrumbList, BreadcrumbListItem) — the one complete
`*Nav`/`*List`/`*ListItem` family in the original slice.

The 2026-09-06 completion push added all 92 national personal identifier
components (46 identifier types x -input/-view, e.g.
`AlbaCommunityHealthIndexInput`/`View`, `UnitedStatesSocialSecurityNumberInput`/`View`),
each following the same `TextInput`/`EmailInput`-shaped -input pattern
(with `autocomplete="off"` always forced, and `pattern`/`inputmode`
hardcoded for the handful whose canonical contract documents a fixed
format) paired with a `<span aria-label>`-shaped -view — `role="text"` is
added to the -view's span wherever that identifier's own canonical
`AGENTS.md` calls for it (32 of the 46 do; 14 don't), so check the
component's own contract rather than assuming either way.

## Two architecture decisions, made explicitly before any component was written

- **Autonomous custom elements, never customized built-ins.** The Web
  Components spec offers two registration styles: autonomous
  (`class X extends HTMLElement`, tag `<lily-button>` — works in every
  evergreen browser) and customized built-in (`class X extends
  HTMLButtonElement`, used as `<button is="lily-button">` — no extra host
  node, but WebKit has never implemented this half of the spec and has
  stated it will not, per
  [WebKit bug 182671](https://bugs.webkit.org/show_bug.cgi?id=182671), so it
  silently fails to upgrade in Safari). Lily targets every evergreen browser
  without a caveat, so autonomous is the only real choice. The accepted
  cost: most components introduce one extra DOM host node
  (`<lily-button>`) wrapping the real semantic element (`<button>`) — a
  real, permanent structural difference from the other seven catalogs'
  output.
- **Light DOM only — no shadow root.** A shadow root would isolate a
  component's internals from consumer CSS, contradicting the headless
  contract every other catalog honours. Light DOM also keeps cross-component
  ARIA relationships (`aria-labelledby`, `aria-describedby`, `aria-controls`
  reaching into another component) working with plain
  `document.getElementById`, with no `part`/`::part()` indirection.

## The two structural patterns

1. **Wrap a real native element** (most of the catalog) — `connectedCallback`
   creates the real semantic child, moves the host's original light-DOM
   children into it, sets attributes, and appends it. The custom-element
   host itself is inert scaffolding carrying no ARIA/role of its own.
2. **Self-is-the-wrapper** (`Alert`, `Banner`, `ContextualHelp`,
   `Coachmark` and a handful of others) — used only where the canonical root element
   is `<div>` with no native element behaviour worth deferring to. The host
   element itself carries the base class and ARIA state directly, avoiding
   a pointless `<div>` inside a `<div>`.

`BreadcrumbListItem` uses a third pattern, **upgrade in place**, piloted
only for that one passive, non-interactive component: it builds the real
`<li>`, moves children/attributes in, then removes itself from the tree
(`this.replaceWith(li)`) so no host node sits between `<ol>` and `<li>`.
This is not a general option — it costs all live reactivity after upgrade,
acceptable only because breadcrumb items are passive.

## What's deliberately excluded, and why

- **Every table sub-element family, and every `*ListItem` family other
  than breadcrumb** (`*TableHead/-Body/-Foot/-Row/-TH/-TD` across table,
  data-table, calendar-table, kanban-table, gantt's HTML-named
  equivalents, and the remaining `*List`/`*ListItem` pairs). The
  underlying problem: a parent and child with a required content-model
  relationship (`<ol>` + `<li>`, `<table>` + `<thead>`) cannot tolerate a
  wrapper element between them. Angular-headless hit and fixed exactly this
  defect class with a tag+attribute selector — a form only customized
  built-in elements support, and those are permanently unsupported in
  Safari/WebKit (see the architecture decision above). The "upgrade in
  place" pattern piloted on breadcrumb is the one alternative found so far,
  and it only fits passive items.
- **The 92 national personal identifier components.**
- **458 of the 491 canonical components overall** — this is a
  representative slice by explicit scope choice (plan P7-T6), not an
  oversight to silently backfill.

## Consuming a component

Import the package for its side-effecting registration, then drop the tag
into markup:

```html
<script type="module">
  import "lily-design-system-web-components-headless";
</script>

<lily-text-input label="Your name"></lily-text-input>
<lily-button label="Greet">Greet</lily-button>
```

Every component's real semantic element (the `<button>`, `<input>`,
`<dialog>`, …) is a genuine light-DOM child, so `querySelector`, event
delegation, and native form participation all work exactly as they would
on hand-written HTML. `passThroughAttributes` copies every attribute the
component doesn't itself interpret onto the generated element — the
rest-props-spread equivalent for a platform with no such concept built in.

## Theming and class hooks

Same contract as every other Lily catalog: the real semantic element
carries the kebab-case base class plus the consumer's own `class`
attribute (`rootClassName` / `applySelfClassName` internally), and that
base class is the *only* styling contract — no bundled CSS, fonts, icons,
or images. See [../AGENTS/theme.md](../AGENTS/theme.md) and
[../AGENTS/headless.md](../AGENTS/headless.md) for the full rules this
catalog follows.

## Naming, suffixes, composition

The suffix→HTML-element mapping and the compound name-family patterns are
catalog-wide and documented once, not restated here: see
[../AGENTS/components.md](../AGENTS/components.md). Only the tag prefix
differs — `lily-{slug}` rather than a bare PascalCase component name — and
only 125 of the catalog's slugs exist in this package as of 2026-09-06, growing; check the
list above, or this catalog's own `spec/index.md`, before assuming a tag
exists.

## When this isn't the right skill

- **Full 491/491 catalog coverage in a specific framework** (a component
  outside this catalog's current scope, or any framework-runtime binding) — use one of
  the seven full-catalog headless skills, e.g.
  [`lily-design-system-html-headless-skill`](../lily-design-system-html-headless-skill/)
  for the plain-HTML no-framework-runtime full catalog, or the matching
  skill for Svelte/React/Vue/Angular/Blazor/Nunjucks.
- **The `*-picker` helpers** for this same Web Components catalog — a
  separate subproject with its own maintenance model — use
  [`lily-design-system-web-components-helpers-skill`](../lily-design-system-web-components-helpers-skill/).
- **General Lily concepts** (what "headless" means, the catalog at a
  glance, picking a framework, terminology) that aren't specific to the
  native-custom-element idiom — use
  [`lily-design-system-skill`](../lily-design-system-skill/).
