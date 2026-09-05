# Lily Design System™ — HTML Headless Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that explains how to consume
[`lily-design-system-html-headless`](../lily-design-system-html-headless/):
the plain-HTML implementation of Lily's canonical component catalog —
annotated semantic-HTML snippet files with ARIA and class hooks, plus an
embedded vanilla-JS behavior layer, no build step, no framework runtime.

It is the framework-specific counterpart, for the HTML headless library, to
the general [`lily-design-system-skill`](../lily-design-system-skill/) — the
same relationship the maintainer skill has to this repository's own tooling,
but scoped here to *using* one particular headless library rather than the
whole system's concepts. It follows the `lily-design-system-` prefix that
marks the monorepo's implementation subprojects, because it is fully bound
to this repository's own catalog and conventions, not a portable
general-purpose package living outside it.

## What it's for

Load this skill when someone asks how to use Lily's plain-HTML headless
components, wants the vanilla-JS/no-framework usage idiom, needs to know how
to wire up a component's inline `<script>` behavior, or wants to know how
this catalog differs from the sibling Web Components headless catalog. It
doesn't restate the root `AGENTS/*.md` rules or the HTML headless
subproject's own `spec/index.md` in full — it points at them, so the
underlying source stays the single source of truth.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: the HTML headless library's
  identity and scope, the component-file shape (comment header + markup +
  optional `<script>` IIFE), the copy-and-use consumption idiom, class-hook
  theming, and pointers into the catalog naming/composition reference.

Scaffolded to match the other implementation subprojects — including the
copied + generated special files and the [`.git-subtree-push`](.git-subtree-push)
config `bin/git-subtree-push` reads — so it can be pushed to its own
standalone public repository the same way once that remote is configured;
as of this writing no such remote exists yet.
