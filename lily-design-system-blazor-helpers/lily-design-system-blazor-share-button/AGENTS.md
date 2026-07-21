# AGENTS — ShareButton (Blazor helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A Blazor 10 headless share control. A single-glyph button (↪, U+21AA)
that uses the **native share sheet** when the browser has one, and
otherwise opens a disclosure list of consumer-supplied destinations plus
a built-in copy-the-URL action. Ships no CSS, no icons, no JS file, and
no third-party endpoints.

The canonical implementation is the Svelte helper
[`lily-design-system-svelte-share-button`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-share-button/);
this is a direct port with Blazor idioms swapped. When the two disagree,
Svelte wins — see [spec/index.md §9](./spec/index.md#9-blazor-deviations-from-the-canonical-svelte-implementation)
for the deviations that could not be avoided.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `ShareButton.razor` | Razor markup. |
| `ShareButton.razor.cs` | C# code-behind (partial class). |
| `ShareButtonTests.cs` | bUnit + xUnit spec, mapped to the §7 clauses. |
| `index.md` | User guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |
| `examples/` | Copy-pasteable Razor snippets. |

## Public surface

- Component: `ShareButton` in namespace
  `LilyDesignSystem.Blazor.Helpers`.
- Types: `ShareTarget`, `ShareStrategy`, `ShareButtonContext`,
  `ShareEventArgs`, `NativeShareOutcome`.
- Constant: `ShareButton.RightwardsArrowWithHook` — the default glyph
  `"↪"` (U+21AA).
- Statics: `NextShareButtonId()`, `CanShareNativelyAsync(IJSRuntime)`,
  `CanCopyAsync(IJSRuntime)`. The two probes are **async** because the
  browser is only reachable over interop; both return `false` during
  prerender rather than throwing.
- Instance methods: `ActivateAsync()`, `CopyAsync()`,
  `ShareNativelyAsync()` — public so consumers can drive the control
  from their own UI via a `@ref`.
- Required parameter: `Label`.
- Internal statics (visible to the test project): `CanShareScript`,
  `CanCopyScript`, `BuildNativeShareScript(url, title, text)`,
  `BuildCopyScript(url)`, and the sentinel constants.
- **No persistence and no `StorageKey`.** Unlike the three `*-select`
  helpers, this one owns an action, not a preference: it applies nothing
  to the document and writes nothing to `localStorage`.

## Behaviour contract (one paragraph)

Activating the button either opens the native sheet (`navigator.share`,
when `Strategy` allows and the browser has one) or opens the list.
Destinations are real links built by each target's `Href(url, title,
text)`. The copy item writes the URL to the clipboard, fires `OnCopy`,
and announces `CopiedLabel` / `CopyFailedLabel` in a polite live region.
Nothing is applied to the document and nothing is persisted.

## HTML

`<div class="share-button">` → `<button class="share-button-trigger">`
with an `aria-hidden` glyph span → `<ul class="share-button-list" hidden>`
of `<li>` containing `<a class="share-button-target">` and an optional
`<button class="share-button-copy">` → `<p class="share-button-status"
aria-live="polite">`.

**Not a menu.** Destinations are real `<a>` elements; `role="menuitem"`
would strip middle-click, open-in-new-tab and copy-link-address. The
trigger class is `share-button-trigger`, not `-button`, because
`.share-button-button` reads badly — the one deliberate bend in the
`{helper}-button` convention.

`target="_blank" rel="noopener noreferrer"` on every destination unless
it sets `NewTab = false`.

## Keyboard

Button: `Enter` / `Space` activate; `ArrowDown` opens focused on the
first item, `ArrowUp` on the last. List: arrows move focus and **clamp**
(a disclosure does not wrap), `Home` / `End` jump, `Escape` closes and
returns focus to the trigger, `Tab` closes without stealing focus back.
Items are real focusable elements, so focus moves for real — no
`aria-activedescendant`. Focus moves are deferred to
`OnAfterRenderAsync`, since an item cannot take focus while the list
still carries `hidden`.

## The three native-share outcomes

The injected script resolves a sentinel and never rejects, so the .NET
side can tell these apart:

| Sentinel | Result |
| -------- | ------ |
| `"shared"` | `OnNativeShare` fires; list stays closed. |
| `"dismissed"` | Interaction ends; list stays closed. |
| `"unsupported"` | Fall back to the list. |

**A dismissed sheet must not fall through to the list** — that would
resurrect UI the user just dismissed. A bare try/catch around the interop
call would collapse "dismissed" into "unsupported" and break this. It has
a dedicated test; do not get it wrong.

## Testing notes

bUnit has no live focus model, so the suite asserts focus by watching the
`Blazor._internal.domWrapper.focus` interop call and mapping its
`ElementReference` GUID back to an element via the
`blazor:elementReference` attributes in the first render's markup. The
browser APIs are stubbed by matching on the generated `eval` script;
Loose mode's `default(T)` is the "no share sheet, no clipboard" baseline.
Both mechanisms are documented in
[spec/index.md §7.1–§7.2](./spec/index.md#71-how-focus-is-asserted).

## Conventions this package follows

- Blazor partial class (`.razor` + `.razor.cs`), Blazor 10 / .NET 10.
- `[Parameter, EditorRequired]` for `Label`;
  `[Parameter(CaptureUnmatchedValues = true)]` for spread.
- `EventCallback<T>` for events; `RenderFragment<ShareButtonContext>`
  for the custom glyph.
- All browser access through `IJSRuntime` from event handlers or
  `OnAfterRenderAsync`, so the component is SSR / prerender safe.
- No runtime dependency beyond `Microsoft.AspNetCore.Components.Web`.
- No bundled CSS, fonts, icons, images, or third-party URLs.
- All user-facing strings come from parameters — including the copy
  label, which is why the copy item is opt-in.
