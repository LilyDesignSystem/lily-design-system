# Lily Design System™ — Blazor Headless Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that explains how to install and use
[`lily-design-system-blazor-headless`](../lily-design-system-blazor-headless/):
the NuGet package identity and publish status, the Blazor/Razor-specific
usage idiom (`CssClass` instead of `class`, `RenderFragment ChildContent`,
`EventCallback<T>`/native-attribute wiring, `AdditionalAttributes`
pass-through), and pointers to the framework-agnostic naming and composition
references that already live at the root of this monorepo.

It is a framework-scoped sibling of
[`lily-design-system-skill`](../lily-design-system-skill/) (framework-agnostic
Lily concepts) and
[`lily-design-system-blazor-helpers-skill`](../lily-design-system-blazor-helpers-skill/)
(the Blazor `*-picker` helpers catalog). All three follow the
`lily-design-system-` prefix that marks the monorepo's implementation
subprojects.

## What it's for

Load this skill when someone asks how to install or use Lily's Blazor
headless components, why a component doesn't expose `Value`/`ValueChanged`
the way they expected, how to pass a CSS class or pass-through attributes to
one of these Razor components, or wants the current NuGet publish status. It
doesn't restate the `AGENTS/*.md` rules, the root component catalog, or the
Blazor headless subproject's own `spec/index.md` in full — it points at them,
so the underlying source stays the single source of truth.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: package identity and install,
  the Blazor/Razor usage idiom, theming, and pointers to the canonical
  naming/composition references.

Scaffolded to match the other implementation subprojects — including the
required-files set and the [`.git-subtree-push`](.git-subtree-push) config
`bin/git-subtree-push` reads — so it can be pushed to its own standalone
public repository the same way once that remote is configured; as of this
writing no such remote exists yet.
