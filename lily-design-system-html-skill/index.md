# Lily Design System™ — HTML Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that maps the three real plain-HTML
subprojects in this monorepo — the full-catalog headless component library,
the six `*-picker` helper web components, and the styled NHS UK example
application — and helps an agent decide which one a request actually needs.

It is an **umbrella skill**, one level up from
[`lily-design-system-html-headless-skill`](../lily-design-system-html-headless-skill/)
and [`lily-design-system-html-helpers-skill`](../lily-design-system-html-helpers-skill/):
those two cover the deep contract of their one subproject each; this skill
does not repeat that content, it points to it. The one HTML subproject
neither sibling skill covers — `lily-design-system-html-css-js-examples`,
the styled example app — gets real coverage here instead.

## What it's for

Load this skill when someone asks what's available for plain HTML in Lily
Design System, which HTML subproject they need, how the HTML headless
library relates to the HTML helpers catalog or the example app, or wants to
see components styled and running with no framework runtime. It also draws
the line between this plain-HTML trio and the separate Web Components
catalogs (`<lily-*>` tags, a partial 33/491 headless slice), pointing to
[`lily-design-system-web-components-skill`](../lily-design-system-web-components-skill/)
for that pair.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: the three-subproject map, the
  example app's own contract (routes, NHS UK styling, running it, helper
  vendoring), the conventions that span all three, and the Web Components
  distinction.

Scaffolded to match the other implementation subprojects — including the
special files and the [`.git-subtree-push`](.git-subtree-push) config
`bin/git-subtree-push` reads — so it can be pushed to its own standalone
public repository the same way once that remote is configured; as of this
writing no such remote exists yet.
