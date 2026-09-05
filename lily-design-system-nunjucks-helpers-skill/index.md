# Lily Design System™ — Nunjucks Helpers Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that explains how to consume
[`lily-design-system-nunjucks-helpers`](../lily-design-system-nunjucks-helpers/):
the six `*-picker` packages (`theme-picker`, `locale-picker`,
`text-size-picker`, `motion-picker`, `share-picker`, `date-time-picker`),
the macro-plus-`client.js` split that Nunjucks' server-only rendering
forces on this catalog specifically, the shared icon-button-opens-listbox
markup contract for the four preference helpers versus `share-picker`'s
disclosure-of-links and `date-time-picker`'s field-plus-dialog shape, and
`motion-picker`'s one documented server/client deviation (no
`matchMedia` at template-render time).

It is the Nunjucks-helpers-specific counterpart to
[`lily-design-system-skill`](../lily-design-system-skill/), which covers
framework-agnostic Lily concepts, and the sibling of
[`lily-design-system-nunjucks-headless-skill`](../lily-design-system-nunjucks-headless-skill/),
which covers the 491-component headless macro catalog instead of the
`*-picker` helpers.

## What it's for

Load this skill when someone asks how to add a Lily picker helper to a
Nunjucks or Eleventy page, wants the `data-lily-*` hook contract between
a helper's macro and its `client.js`, needs to know what still works
with no JavaScript, or asks why `motion-picker`'s server-rendered markup
differs from the value the client ends up applying. It doesn't restate
`AGENTS/helpers.md` or any individual helper's `spec/index.md` in full —
it points at them, so the underlying source stays the single source of
truth.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: the six helpers' one-line
  contracts, the macro-plus-client.js split, the shared markup contract,
  and the `motion-picker` deviation.

Scaffolded to the same full-subproject bar as its siblings
(`lily-design-system-skill`, `lily-design-system-maintainer-skill`,
`lily-design-system-nunjucks-headless-skill`) — including the required
`index.md`, `README.md` symlink, `AGENTS.md`, `CLAUDE.md`, `spec/index.md`,
and `.git-subtree-push` — so it can be pushed to its own standalone public
repository the same way once that remote is configured.
