# Lily Design System™ — Svelte Helpers Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that explains
[`lily-design-system-svelte-helpers`](../lily-design-system-svelte-helpers/),
the **canonical** reference catalog of Lily's six `*-picker` helpers
(theme-picker, locale-picker, text-size-picker, motion-picker,
share-picker, date-time-picker): their npm package names and install
idiom, the shared icon-button-opens-listbox contract for the four
preference helpers, `share-picker`'s link-disclosure shape and
`date-time-picker`'s field+dialog shape, and the idempotent-apply rule
that guards against a real Svelte `effect_update_depth_exceeded` freeze.

It is a framework-specific sibling of
[`lily-design-system-skill`](../lily-design-system-skill/) and of
[`lily-design-system-svelte-headless-skill`](../lily-design-system-svelte-headless-skill/)
(which covers the plain headless catalog, not the helpers layer), and
shares the `lily-design-system-` prefix with the monorepo's implementation
subprojects, because it is fully bound to this repository's own Svelte
helpers subproject and its conventions — the one every other framework's
helpers port from — not a portable general-purpose package.

## What it's for

Load this skill when someone asks how to install or use a Lily Svelte
picker helper, wants the Svelte 5 idiom for one of the six helpers, asks
why applying a preference must be idempotent, or asks which catalog is
canonical when framework helpers disagree. It doesn't restate
`AGENTS/helpers.md` or the six helpers' own `spec/index.md` files in
full — it points at them, so the underlying source stays the single
source of truth.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: the six helpers and their
  contracts, npm package names and install idiom, the idempotent-apply
  rule, and pointers to the canonical helper catalog and the Svelte 5
  idiom.

Scaffolded to the same full-subproject bar as its siblings
(`lily-design-system-skill`, `lily-design-system-maintainer-skill`,
`lily-design-system-svelte-headless-skill`) — including the required
`index.md`, `README.md` symlink, `AGENTS.md`, `CLAUDE.md`, `spec/index.md`,
and the [`.git-subtree-push`](.git-subtree-push) config `bin/git-subtree-push`
reads — so it can be pushed to its own standalone public repository the
same way once that remote is configured; as of this writing no such remote
exists yet.
