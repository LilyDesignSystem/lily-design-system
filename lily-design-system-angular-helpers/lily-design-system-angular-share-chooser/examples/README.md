# Examples — ShareChooser

Self-contained Angular 20 examples for
`lily-design-system-angular-share-chooser`. Each file is a runnable
standalone component that can be dropped into any Angular 20 host
(Analog page, Angular CLI route, Storybook story).

| # | File | Demonstrates |
|---|------|--------------|
| 1 | [`basic.component.ts`](./basic.component.ts) | Consumer-supplied destinations, the built-in copy item, and the announced copy outcome. |
| 2 | [`strategy.component.ts`](./strategy.component.ts) | `auto` / `native` / `list`, and what a dismissed native sheet does. |
| 3 | [`custom-glyph.component.ts`](./custom-glyph.component.ts) | Projecting an `<ng-template>` to replace the ↪ glyph — including with visible text. |

Every example assumes:

- Angular 20 with standalone components and signal inputs.
- No CSS dependency — the control is headless. Consumers style the
  `share-chooser` (root), `share-chooser-button`, `share-chooser-icon`,
  `share-chooser-list`, `share-chooser-list-item`, `share-chooser-target`,
  `share-chooser-copy`, and `share-chooser-status` hooks.
- **The list needs positioning CSS and this package ships none.** The
  `<ul class="share-chooser-list">` sits in normal document flow, so it
  pushes content down when opened unless you give it
  `position: absolute` inside a `position: relative` root. Use
  `inset-inline-start`, not `left`, so it follows `dir="rtl"`.

## You supply the destinations

**No social-network endpoints ship with this package.** `href` is a
function, so you own the whole URL and its encoding. Which networks
belong in a product is an editorial and privacy decision, the share
URLs change, and networks die — none of that belongs in a design
system.

The endpoints in these examples are illustrations, not endorsements or
a maintained list. Check them against the network's current
documentation before shipping.

## Every user-facing string is an input

Including `copyLabel` — the copy item renders only when you name it,
because a default would be hardcoded English. If you supply
`copyLabel`, supply `copiedLabel` and `copyFailedLabel` too: copying is
otherwise silent, so without them the user gets no confirmation either
way. Make `copyFailedLabel` actionable — copy fails on plain HTTP, on a
denied permission, and in browsers with no async clipboard, none of
which the user can see.

## Running the examples

These files are illustrations, not a build. The fastest way to try one
is:

1. Inside any Angular CLI project (or Analog), drop the example into a
   route component or a Storybook story.
2. Import `ShareChooser` from this directory (or via the `index.ts`
   barrel).
3. `ng serve` (or `pnpm dev`) and visit the route.

## Why `.ts` files instead of `.html` + `.ts` pairs?

The catalog uses template-inline only — no `templateUrl`, no `styles`,
no `styleUrls`. Each example is a single `.ts` file with the template in
the `template:` field of the `@Component` decorator. This matches the
Angular 20 convention used throughout the angular-headless library.

## See also

- [`../docs/accessibility.md`](../docs/accessibility.md) — what the
  control does well, and what it costs.
- [`../spec/index.md`](../spec/index.md) — the canonical contract.

---

Lily™ and Lily Design System™ are trademarks.
