# AGENTS — MotionPicker (Blazor helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Blazor headless motion (reduced-motion) picker that applies
the chosen motion slug to the document root via `data-motion`, with
optional `localStorage` persistence. It renders an icon button (a
bundled two-pause-bars SVG) that opens a dropdown listbox. Ships no
CSS; consumer styles the
`motion-picker`, `motion-picker-button`, `motion-picker-icon`,
`motion-picker-list`, and `motion-picker-option` class hooks and
decides what `[data-motion="reduce"]` actually suppresses.

Its initial value defers to the platform's `(prefers-reduced-motion:
reduce)` media query (via `IJSRuntime`, prerender-safe) before falling
back to a fixed default — the one behaviour difference from
`ThemePicker`/`TextSizePicker`.

## Files

| File                    | Purpose                                          |
| ----------------------- | ------------------------------------------------ |
| `spec/index.md`         | Specification-driven contract (canonical, Svelte-sourced). |
| `MotionPicker.razor`    | Razor markup.                                    |
| `MotionPicker.razor.cs` | C# code-behind (partial class).                  |
| `MotionPickerTests.cs`  | bUnit + xUnit spec, one `[Fact]` per §7 item (compiled into the shared test project). |
| `index.md`              | User guide.                                      |

## Public surface

- Component: `MotionPicker` in namespace `LilyDesignSystem.Blazor.Helpers`.
- Context: `MotionPickerContext` (`Value`, `Open`, `LabelFor`) for a
  custom `ChildContent` icon.
- No glyph constant — the default icon is a bundled SVG, not a
  Unicode character (reversed 2026-09-16).
- Statics: `MotionName(slug)` — the ONE title-casing rule
  (`"no-preference"` -> `"No Preference"`); the private instance
  `LabelFor` delegates to it. Mirrors `TextSizePicker.SizeName` and
  `ThemePicker.ThemeName`.
- Instance method: `PrefersReducedMotionAsync()` — public, reads the OS
  media query; `false` on interop failure (prerender).
- Method: `SetMotionAsync(string slug)`.
- Required parameters: `Label`, `Motions`.
- Two-way binding: `@bind-Value` (string slug).
- Internal statics (visible to the test project): `BuildApplyScript(string, string?)`.

## Behaviour contract (one paragraph)

On every motion change the control (1) sets `data-motion="{slug}"` on
`document.documentElement`, (2) optionally writes the slug to
`localStorage[StorageKey]`, and (3) invokes `OnChange` and
`ValueChanged` with the slug. All DOM writes happen through
`IJSRuntime` inside `OnAfterRenderAsync`, so the component is SSR /
prerender safe. Initial value resolves from `Value` > storage >
`DefaultValue` > `(prefers-reduced-motion: reduce)` (checked
**unconditionally**, mapped to `"reduce"` / `"no-preference"` when
offered) > `Motions[0]`.

The control is an **icon button plus a dropdown listbox**, not a native
`<select>`. The button shows only an icon; the listbox is the WAI-ARIA
APG listbox pattern with `aria-activedescendant`. The real selection
lives in `Value` and rides a hidden input for form participation.

## HTML

```html
<div class="motion-picker @CssClass" ...AdditionalAttributes>
  <input type="hidden" name="@Name" value="@Value" />
  <button type="button" class="motion-picker-button" aria-label="@Label"
          aria-haspopup="listbox" aria-expanded="false" aria-controls="{listId}">
    <svg class="motion-picker-icon" viewBox="0 0 16 16" aria-hidden="true"
         width="1.05rem" height="1.05rem">…</svg>
  </button>
  <ul class="motion-picker-list" id="{listId}" role="listbox" aria-label="@Label"
      tabindex="-1" hidden aria-activedescendant="{active option id, open only}">
    <li class="motion-picker-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active>{LabelFor(slug)}</li>
  </ul>
</div>
```

`ChildContent` **replaces the icon inside the button**; it does not
render options. Ids come from a monotonic process-wide counter
(`motion-picker-{n}`) so they are stable and SSR-safe.

## Keyboard

Same contract as `TextSizePicker`: button `ArrowDown` / `Enter` /
`Space` open on the selected option (`ArrowUp` opens on the last);
listbox arrows move and clamp, `Home` / `End` jump, `Enter` / `Space`
select-apply-close-and-refocus, `Escape` closes without changing the
value, `PageUp` / `PageDown` move by ten (clamped), `Tab` closes,
printable characters run a 500 ms APG typeahead.

## Accessibility

- WCAG 2.2 AAA target; directly supports 2.3.3 (Animation from
  Interactions).
- WAI-ARIA APG listbox pattern.
- `aria-label` is the button's ENTIRE accessible name.
- Option labels default to title-cased slugs.

## Blazor deviations from the canonical Svelte implementation

Same three deviations as `TextSizePicker` (no `preventDefault` on
keydown; no document-level click listener, using `focusout` instead;
`Tab` does not refocus the button, since Blazor's async handler always
runs after the browser's default Tab has already proceeded) — see
`TextSizePicker`'s own AGENTS.md for the full reasoning, which applies
here unchanged.

One MotionPicker-specific addition: the OS preference check
(`PrefersReducedMotionAsync`) runs through `IJSRuntime.InvokeAsync<bool>("eval", …)`
rather than a bundled JS module, matching this catalog's existing
`localStorage` read pattern in `ResolveInitialAsync`. It is checked
**unconditionally** as part of initial-value resolution — not behind
an opt-in flag — because motion has a real accessibility signal the
canonical Svelte contract treats as the default to defer to.

## Conventions this package follows

- Blazor partial class (`.razor` + `.razor.cs`).
- `[Parameter]` properties; `[Parameter(CaptureUnmatchedValues = true)]`
  for spread.
- `EventCallback<string>` for `ValueChanged`, `OnChange`.
- `IJSRuntime` injected for DOM mutation.
- No runtime dependency beyond `Microsoft.AspNetCore.Components.Web`.
- No bundled CSS, fonts, or images. The one deliberate exception is
  the default button icon: a bundled SVG (reversed 2026-09-16 from a
  Unicode glyph).
- All user-facing strings come from parameters.
