# Lily Design System™ — React Headless Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that explains how to install,
import, and use the React headless implementation of Lily Design
System™: the `lily-design-system-react-headless` npm package, its
JSX consumption idiom (`className`, rest-props spreading, controlled
props), and where to find the framework-agnostic naming and
composition rules that apply to it.

It is one of two React-scoped skills, alongside
[`lily-design-system-react-helpers-skill`](../lily-design-system-react-helpers-skill/),
which covers the six `*-picker` helper packages instead of the
headless catalog. Both are narrower siblings of the general
[`lily-design-system-skill`](../lily-design-system-skill/), which
explains Lily concepts independent of any one framework.

## What it's for

Load this skill when someone asks how to install or import Lily
Design System's React headless components, wants the React-specific
usage idiom (JSX, `className`, rest-props spreading, controlled-prop
patterns), asks about React version or peer-dependency requirements,
or needs the npm package name or import path for a specific
component. It doesn't restate the `AGENTS/*.md` rules, the catalog,
or the naming/composition patterns in full — it points at them, so
the underlying source stays the single source of truth.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: package identity, install
  command, the JSX consumption idiom, theming, and pointers to the
  naming/composition reference.

Scaffolded to match the other implementation subprojects — including
the standard required-files set and the
[`.git-subtree-push`](.git-subtree-push) config `bin/git-subtree-push`
reads — so it can be pushed to its own standalone public repository the
same way once that remote is configured; as of this writing no such
remote exists yet.
