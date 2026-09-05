---
name: lily-design-system-blazor-headless-skill
description: Explains how to install and use Lily Design System's Blazor headless component library — the NuGet package identity and publish status, the Blazor/Razor-specific usage idiom (the CssClass parameter instead of a class attribute, RenderFragment ChildContent, EventCallback/native-attribute wiring, AdditionalAttributes pass-through), and where the canonical suffix-to-element mapping and composition patterns live. Use when someone asks how to install or use Lily's Blazor components, why a component doesn't take a Value/ValueChanged pair, how to pass a CSS class or ARIA attributes to a Razor component from this library, or wants the current NuGet publish status.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — Blazor headless usage

`lily-design-system-blazor-headless` is the Blazor .NET 10 / C# implementation
of Lily's canonical, headless component catalog: unstyled Razor components
shipping semantic HTML, ARIA, focus management, and keyboard behaviour — no
CSS, no bundled fonts or icons, no hardcoded strings. It targets the same
component catalog as the other six full-catalog headless libraries (HTML,
Svelte, React, Vue, Angular, Nunjucks); the library's own `spec/index.md` most
recently recorded 490/490 catalog parity, and its namespace is
`LilyBlazorHeadless.Components`.

## Install

```xml
<ProjectReference Include="../lily-design-system-blazor-headless/src/LilyBlazorHeadless/LilyBlazorHeadless.csproj" />
```

or, once resolved from NuGet:

```sh
dotnet add package LilyDesignSystem.Blazor.Headless
```

The package id is `LilyDesignSystem.Blazor.Headless` (distinct from the
internal C# namespace `LilyBlazorHeadless.Components`). It published for real
to nuget.org on 2026-09-02 at version 0.1.0, then 0.1.1 (a readme-only fix —
NuGet packages are immutable, so a metadata fix means a new version) — see the
root `CHANGELOG.md` for both events. Publishing uses NuGet Trusted Publishing
(OIDC via `NuGet/login@v1` in GitHub Actions), adopted the same day; no
long-lived API key is minted for this package.

## The Blazor/Razor usage idiom

This library follows Blazor conventions, not a straight port of another
framework's prop names:

- **`CssClass`, not `class`.** Every component's root element concatenates its
  own kebab-case base class with the consumer's `CssClass` parameter into the
  rendered `class` attribute — `class="@($"button {CssClass}")"`. Blazor's
  attribute-splat mechanism (`@attributes="AdditionalAttributes"`) can't merge
  into `class` the way JSX spread or Vue's `v-bind="$attrs"` can; it would
  either be dropped or collide with the component's own `class=""`. So `class`
  is never one of the splatted attributes — pass your class via `CssClass`,
  not by trying to set `class="..."` directly on the component tag.
- **`RenderFragment ChildContent` for children.** The Razor equivalent of
  `children` / a default slot. Most components declare only
  `Label` / `CssClass` / `ChildContent` / `AdditionalAttributes`.
- **`AdditionalAttributes` for rest-props pass-through.** Declared as
  `[Parameter(CaptureUnmatchedValues = true)] public Dictionary<string, object>? AdditionalAttributes { get; set; }`
  and spread onto the root via `@attributes="AdditionalAttributes"`. This is
  how `id`, `data-*`, ARIA overrides, and Razor event directives
  (`@onclick`, `@onchange`, `@oninput`, `@onsubmit`, `@onkeydown`) reach the
  root even on a component that never declared that parameter by name —
  directive attributes always compile to their fixed lowercase DOM event name
  regardless.
- **Most primitives do NOT wire `Value`/`ValueChanged`, `Checked`/`CheckedChanged`,
  or `OnSubmit`.** The form-field primitives (`TextInput`, `EmailInput`,
  `TextAreaInput`, `Select`, `Option`, `RadioInput`, `CheckboxInput`, `Form`,
  `Field`, `Fieldset`, `SummaryListItem`, and most others) are thin wrappers
  around the native element — passing a PascalCase `Value="..."` compiles
  (it lands silently in `AdditionalAttributes`) but does nothing. The correct
  idiom for these is native lowercase HTML attributes (`value="@x"`,
  `checked="@x"`, `name="@x"`) plus a `@onchange`/`@oninput` directive with a
  `ChangeEventArgs` handler, and `novalidate @onsubmit="Handler"` on `Form`.
  A short, explicit list of components genuinely DO own a real
  `EventCallback<T>` pair — `SwitchButton` (`Checked`/`CheckedChanged`),
  `Combobox` (`Value`/`ValueChanged`, `Open`/`OpenChanged`),
  `AccordionCheckbox` (`Checked`/`CheckedChanged`), and the `Dialog`/`Drawer`
  family (`Open`/`OpenChanged`, checked individually). Always check the
  component's own `.razor` source before assuming either way.
- **`EventCallback<T>`, not a plain delegate**, is how the components that do
  own a callback expose it, matching ordinary Blazor two-way-binding
  (`@bind-Value`, `@bind-Checked`, `@bind-Open`).

## Theming

Same contract as every other headless catalog: the root's kebab-case base
class plus the consumer's `CssClass` is the *only* styling hook. No
`.razor.css`, no scoped/isolated CSS, no inline `style="..."` beyond what a
canonical spec requires. The root `themes/` reference stylesheets (NHS,
GOV.UK, USWDS, and the rest) target these same class names — a Blazor
consumer wires them up exactly the way an HTML or React consumer would.

## Naming, suffixes, and composition patterns

The suffix-to-HTML-element mapping (`-button` → `<button>`, `-input` →
`<input>`, `-nav` → `<nav>`, table sub-elements, etc.) and the composition
patterns (Form → Field → Input, Nav → List → ListItem, GrailLayout, table
families) are framework-agnostic and canonical in
[`AGENTS/components.md`](../AGENTS/components.md) — this skill does not
restate them; a Blazor consumer applies the same slugs and PascalCase names,
just as `Button`, `TextInput`, `BreadcrumbNav`, `DataTable`, etc. Razor
components in `LilyBlazorHeadless.Components`.

## When this isn't the right skill

- For the six `*-picker` helper packages (theme-picker, locale-picker,
  text-size-picker, motion-picker, share-picker, date-time-picker) — the
  opinionated, whole-interaction packages that sit *alongside* this headless
  library — use
  [`lily-design-system-blazor-helpers-skill`](../lily-design-system-blazor-helpers-skill/)
  instead.
- For framework-agnostic Lily concepts (what "headless" means, the
  491-component catalog at large, naming conventions, cross-framework
  composition patterns not specific to Blazor) use
  [`lily-design-system-skill`](../lily-design-system-skill/) instead — it
  doesn't restate Blazor's own idioms, and this skill doesn't restate its
  concepts.
