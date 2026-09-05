# Lily Design System™ — Angular Helpers Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that explains how to consume the
[`lily-design-system-angular-helpers`](../lily-design-system-angular-helpers/)
catalog: installing and importing each of the six `*-picker` packages
(`theme-picker`, `locale-picker`, `text-size-picker`, `motion-picker`,
`share-picker`, `date-time-picker`), their shared and individual contracts,
and the Angular-specific usage idiom — standalone components, signal
inputs/`model()`, and the `$any($event.target).value` template-cast
convention.

It is the Angular-helpers-specific counterpart to
[`lily-design-system-skill`](../lily-design-system-skill/), which covers
Lily's framework-agnostic concepts, and a sibling of
[`lily-design-system-angular-headless-skill`](../lily-design-system-angular-headless-skill/),
which covers the Angular headless component library instead of the picker
helper catalog.

## What it's for

Load this skill when someone asks how to install or import an Angular
`*-picker` helper, wants a working Angular usage example for one, or asks
how the helpers differ from a plain Angular headless catalog component
(they own a whole interaction — selection, DOM application, optional
persistence — rather than being a pure markup primitive). It doesn't
restate the `AGENTS/helpers.md` shared contract or the individual helpers'
`spec/index.md` files in full — it points at them, so the underlying source
stays the single source of truth.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: the six helpers' contracts,
  the two markup shapes (icon-button-opens-listbox vs. share-picker's
  disclosure vs. date-time-picker's field+dialog), the Angular-specific
  idiom, and SSR/idempotent-apply notes.

Scaffolded to the same full-subproject bar as its siblings
(`lily-design-system-skill`, `lily-design-system-maintainer-skill`,
`lily-design-system-angular-headless-skill`) — including `index.md`,
`README.md` (symlink), `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, and
`.git-subtree-push` — so it can be pushed to its own standalone public
repository the same way once that remote is configured; as of this writing
no such remote exists yet.
