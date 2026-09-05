# Lily Design System™ — Blazor Helpers Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that explains how to install and use
[`lily-design-system-blazor-helpers`](../lily-design-system-blazor-helpers/):
the six `*-picker` helper packages (theme-picker, locale-picker,
text-size-picker, motion-picker, share-picker, date-time-picker), their NuGet
package identities and publish status, the shared icon-button-plus-listbox
contract and its two deliberate exceptions (`share-picker`'s disclosure,
`date-time-picker`'s form-field-plus-dialog shape), and the Blazor-specific
implementation pattern (partial-class `.razor`/`.razor.cs` pairs, `IJSRuntime`
interop gated on `OnAfterRenderAsync` for SSR safety across all four Blazor
hosting models).

It is a framework-scoped sibling of
[`lily-design-system-skill`](../lily-design-system-skill/) (framework-agnostic
Lily concepts) and
[`lily-design-system-blazor-headless-skill`](../lily-design-system-blazor-headless-skill/)
(the Blazor headless component catalog). All three follow the
`lily-design-system-` prefix that marks the monorepo's implementation
subprojects.

## What it's for

Load this skill when someone asks how to install or use Lily's Blazor picker
helpers, what distinguishes the four preference helpers from `share-picker`
and `date-time-picker`, how a helper stays safe under Blazor Server /
WebAssembly / static SSR, or wants the current NuGet publish status for the
helper packages. It doesn't restate `AGENTS/helpers.md` or the helpers
catalog's own `spec/index.md` in full — it points at them, so the underlying
source stays the single source of truth.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: the six helpers' contracts,
  NuGet package identities and publish status, the shared listbox contract
  and its two exceptions, and the Blazor-specific implementation pattern.

Scaffolded to match the other implementation subprojects — including the
required-files set and the [`.git-subtree-push`](.git-subtree-push) config
`bin/git-subtree-push` reads — so it can be pushed to its own standalone
public repository the same way once that remote is configured; as of this
writing no such remote exists yet.
