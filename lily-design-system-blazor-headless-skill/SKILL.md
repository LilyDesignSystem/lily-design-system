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
Svelte, React, Vue, Angular, Nunjucks); `bin/check-coverage` reports no drift against
the 609-component catalog, and its namespace is
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
- **The value inputs bind.** Every text-style `*Input` takes `@bind-Value`,
  the numeric ones a `double` or `double?`, and `CheckboxInput` `@bind-Checked`.
- **So do the other controls.** `Select`, `ThemeSelect`, `Slider`,
  `TimePickerInput` and `TagInput` take `@bind-Value`, `ToggleButton`
  `@bind-Pressed`, `Details` `@bind-Open`. `Form` and `DataFilterForm` take
  `OnSubmit` and `OnReset` and always prevent the default submit; `@onsubmit`
  reaches the same parameter. A lowercase `oninput` or `onchange` replaces the
  component's own handler, so use the bind.
- **Thin wrappers do NOT bind.** `Option`, `RadioInput`, `Fieldset`,
  `SummaryListItem`: a PascalCase `Value="..."` compiles (it lands silently in
  `AdditionalAttributes`) but does nothing. Use native lowercase HTML attributes
  (`value="@x"`, `checked="@x"`, `name="@x"`) plus a `@onchange` directive with a
  `ChangeEventArgs` handler.
  Others that own a real `EventCallback<T>` pair: `SwitchButton` (`Checked`/`CheckedChanged`),
  `Combobox` (`Value`/`ValueChanged`, `Open`/`OpenChanged`),
  `AccordionCheckbox` (`Checked`/`CheckedChanged`), and the `Dialog`/`Drawer`
  family (`Open`/`OpenChanged`, checked individually). Always check the
  component's own `.razor` source before assuming either way.
- **`EventCallback<T>`, not a plain delegate**, is how the components that do
  own a callback expose it, matching ordinary Blazor two-way-binding
  (`@bind-Value`, `@bind-Checked`, `@bind-Open`).

## Theming

Same contract as every other headless catalog: the root's kebab-case base
class plus the consumer's `CssClass` is the _only_ styling hook. No
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

## Native dialogs and popovers (2026-10-30)

Modal overlays (`dialog`, `alert-dialog`, `file-dialog`, `timeout-dialog`, `drawer`, `sheet`, `slide-out-drawer`) open a real
`<dialog>` with `showModal()`: the page behind is inert, Tab stays inside, Escape closes, focus returns to the opener. Light-dismiss
popups (`popover`, `popup`, `contextual-help`, `dropdown-menu`, `split-button`, `action-group`, `context-menu`) use the Popover API
(`popover="auto"`, opened by `command="toggle-popover"` `commandfor`, with `popovertarget` as well), so the browser itself can close
them on Escape or an outside click. Keep their open state two-way: listen for the change rather than assuming only your code closes
them. Per-component decisions: each `components/{slug}/AGENTS.md` § "Native platform"; rule: `AGENTS/headless.md`.

## When this isn't the right skill

- For the helper packages (the eleven `*-picker` helpers, `picker-bar`, the grid-like helpers and the editors) — the
  opinionated, whole-interaction packages that sit _alongside_ this headless
  library — use
  [`lily-design-system-blazor-helpers-skill`](../lily-design-system-blazor-helpers-skill/)
  instead.
- For framework-agnostic Lily concepts (what "headless" means, the
  609-component catalog at large, naming conventions, cross-framework
  composition patterns not specific to Blazor) use
  [`lily-design-system-skill`](../lily-design-system-skill/) instead — it
  doesn't restate Blazor's own idioms, and this skill doesn't restate its
  concepts.
