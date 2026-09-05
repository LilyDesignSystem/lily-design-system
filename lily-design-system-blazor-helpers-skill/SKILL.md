---
name: lily-design-system-blazor-helpers-skill
description: Explains how to install and use Lily Design System's Blazor *-picker helpers — theme-picker, locale-picker, text-size-picker, motion-picker, share-picker, and date-time-picker — their NuGet package identities and publish status, and the Blazor-specific implementation pattern (partial-class {Pascal}.razor + {Pascal}.razor.cs, IJSRuntime DOM interop gated on OnAfterRenderAsync for SSR safety, EditorRequired parameters). Use when someone asks how to install or use Lily's Blazor picker helpers, how a helper stays safe under Blazor Server/WebAssembly/static SSR, what the icon-button-plus-listbox contract is, or wants the current NuGet publish status for the helper packages.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — Blazor helpers usage

`lily-design-system-blazor-helpers` is a catalog of six opinionated Blazor
components — `theme-picker`, `locale-picker`, `text-size-picker`,
`motion-picker`, `share-picker`, `date-time-picker` — that sit alongside the
headless [`lily-design-system-blazor-headless`](../lily-design-system-blazor-headless/)
library. Where a headless component is a pure markup container, a helper owns
one complete interaction end to end: selection, applying it to the document,
and (for four of the six) optional persistence. Svelte is the canonical
reference catalog; Blazor is a direct port with framework idioms swapped.

## The six helpers

| Helper | Root markup | Applies | Persists |
| --- | --- | --- | --- |
| `theme-picker` | Icon button (◑) + listbox | Swaps a managed `<link>` href + `data-theme` on the document root | Optional `localStorage` |
| `locale-picker` | Icon button (🌐) + listbox | Sets `lang` + `dir` on the document root | Optional `localStorage` |
| `text-size-picker` | Icon button ("A") + listbox | Sets `data-text-size` on the document root | Optional `localStorage` |
| `motion-picker` | Icon button (⏸) + listbox | Sets `data-motion` on the document root; defaults to the OS's own `(prefers-reduced-motion: reduce)` signal, checked via `IJSRuntime` | Optional `localStorage` |
| `share-picker` | Icon button (➤) + disclosure of real `<a>` links | Nothing — opens the native share sheet, else lists consumer-supplied destinations + copy-to-clipboard | None |
| `date-time-picker` | Text field + icon button (📅) opening an APG date-picker dialog | Nothing — it holds a form value | None |

The first four are a **user preference**: selection, DOM application,
optional persistence. `share-picker` owns an **action** instead (applies and
persists nothing), and `date-time-picker` owns a **form value** (also applies
and persists nothing) — all six are "helpers" because each owns its whole
interaction end to end and ships the same headless contract, not because they
share one lifecycle.

## Install

Each helper is its own NuGet package (Razor class library), independently
versioned:

```sh
dotnet add package LilyDesignSystem.Blazor.ThemePicker
dotnet add package LilyDesignSystem.Blazor.LocalePicker
dotnet add package LilyDesignSystem.Blazor.TextSizePicker
dotnet add package LilyDesignSystem.Blazor.MotionPicker
dotnet add package LilyDesignSystem.Blazor.SharePicker
dotnet add package LilyDesignSystem.Blazor.DateTimePicker
```

Namespace: `LilyDesignSystem.Blazor.Helpers` for every package.

**Publish status.** `ThemePicker`, `LocalePicker`, `TextSizePicker`,
`SharePicker`, and `DateTimePicker` published for real to nuget.org on
2026-09-02 (each package's own version at that point — `DateTimePicker` has
since moved to 0.2.0 in this working tree), via NuGet Trusted Publishing
(OIDC, no long-lived API key). `motion-picker` landed in this catalog on
2026-09-03, after that publish run — check the root `CHANGELOG.md` for
whether it has since been published, rather than assuming parity with its
five siblings. Root spec reference:
[`spec/trusted-publishing/index.md`](../spec/trusted-publishing/index.md).

## The shared contract, and its two exceptions

The four preference helpers (`theme-picker`, `locale-picker`,
`text-size-picker`, `motion-picker`) share one markup shape: a root
`<div class="{helper} {CssClass}">` containing a hidden input for form
participation, a `<button class="{helper}-button" aria-haspopup="listbox" aria-expanded aria-controls>`
whose only content is an `aria-hidden` glyph span, and a
`<ul class="{helper}-list" role="listbox" hidden>` of
`<li role="option" aria-selected>` — the WAI-ARIA APG listbox keyboard
pattern (ArrowDown/Up open and move, Home/End jump, typeahead, Enter/Space
select-apply-close, Escape cancels, Tab closes and moves on).

Two helpers deliberately don't fit that shape:

- **`share-picker` is a disclosure, not a listbox.** Its destinations are
  navigation, so they render as real `<a>` elements (not `role="menuitem"`,
  which would strip middle-click and open-in-new-tab); copy-to-clipboard is a
  real `<button>`; a `{helper}-status` live region announces the copy
  outcome. It ships no bundled social-network endpoints — the consumer
  supplies `Targets`, each with its own `Href(url, title, text)`.
- **`date-time-picker` is a form control**, so its trigger is a text field
  users can type a date directly into, plus the icon-button that opens a
  WAI-ARIA APG Date Picker Dialog. The "one glyph, smallest possible
  page-header footprint" reasoning behind the other five's icon button
  doesn't apply to a field inside a form.

## Blazor-specific implementation pattern

- **Partial-class shape**: every helper is `{Pascal}.razor` (markup) plus
  `{Pascal}.razor.cs` (code-behind), keeping C# tooling first-class rather
  than embedding logic in a single `@code` block.
- **`[Parameter, EditorRequired]`** for required parameters — the IDE flags a
  missing one at compile time. `date-time-picker` takes one `Labels`
  object parameter rather than a dozen flat `*Label` parameters; its six
  structural labels are required with no English default.
- **`EventCallback<T>`** for events; two-way binding follows the
  `{Name}`/`{Name}Changed` convention driving `@bind-{Name}`.
- **`RenderFragment<TContext>`** for custom rendering — each helper exposes a
  strongly-typed `*Context` record passed to the consumer's fragment.
- **`[Parameter(CaptureUnmatchedValues = true)] public Dictionary<string, object>? AdditionalAttributes`**
  for HTML attribute spread onto the root.
- **`IJSRuntime` + `OnAfterRenderAsync` for every DOM write.** `<link>`
  swaps, `data-theme`/`lang`/`dir`/`data-motion`/`data-text-size`, and
  `localStorage` reads/writes all go through injected `IJSRuntime`, gated on
  `OnAfterRenderAsync(firstRender)` — never during render — so components
  stay safe across all four Blazor hosting models: Blazor Server, Blazor
  WebAssembly, Blazor Web App static SSR (prerender-only, no JS interop —
  the picker's trigger renders correctly but can't yet open), and Blazor Web
  App interactive (prerenders, then hydrates and wires up interop).
  **Static SSR is sufficient only for the four preference helpers** — they
  degrade gracefully, rendering correct markup and applying the preference
  once interactivity arrives. `share-picker` and `date-time-picker` need an
  interactive render mode: neither can open without a live circuit
  (`@onclick` doesn't fire during pure prerender), and `date-time-picker`'s
  dialog additionally needs interactivity to trap focus and move its roving
  tabindex.
- **Applying is idempotent** across the four preference helpers: re-applying
  an already-applied value is a no-op — no DOM write, no `localStorage`
  write, no change callback — the same rule the canonical Svelte contract
  enforces, to avoid a re-entrant apply loop.

## When this isn't the right skill

- For the headless component catalog itself (`Button`, `TextInput`,
  `BreadcrumbNav`, and the rest of the 491-component catalog) use
  [`lily-design-system-blazor-headless-skill`](../lily-design-system-blazor-headless-skill/)
  instead — these six helpers are a separate, higher-level catalog that sits
  alongside it.
- For framework-agnostic Lily concepts use
  [`lily-design-system-skill`](../lily-design-system-skill/) instead.
