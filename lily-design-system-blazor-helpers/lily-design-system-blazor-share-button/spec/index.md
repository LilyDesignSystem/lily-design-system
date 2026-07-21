# ShareButton — Specification

Single source of truth for the `lily-design-system-blazor-share-button`
Blazor helper. This file drives implementation, testing, and
documentation: anything not in this spec is out of scope; anything in
this spec must be exercised by a test.

This package is a port of the canonical Svelte helper
[`lily-design-system-svelte-share-button`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-share-button/spec/index.md).
Per [`AGENTS/helpers.md`](../../../AGENTS/helpers.md), Svelte is
canonical: the behaviour contract below is the Svelte contract, and the
§7 clause numbering is deliberately identical so the two suites can be
read side by side. Where Blazor forces a difference it is called out in
§9 rather than quietly absorbed.

Sibling files:

- `ShareButton.razor` — Razor markup
- `ShareButton.razor.cs` — C# code-behind (partial class)
- `ShareButtonTests.cs` — bUnit + xUnit spec exercising every clause in §7
- `index.md` — user-facing guide
- `docs/accessibility.md` — tradeoffs, stated plainly

---

## 1. Goal

Give a Blazor 10 application a drop-in, headless share control that:

1. Renders a single-glyph button (↪, U+21AA) matching the other Lily
   helpers.
2. Uses the **native share sheet** where the browser provides one.
3. Otherwise opens a list of consumer-supplied destinations, plus a
   built-in **copy the page URL** action.
4. Ships zero CSS, zero JS files, and zero third-party endpoints.

## 2. Non-goals

- **Shipping a built-in set of social networks.** No URL templates for
  X / Facebook / LinkedIn / Reddit ship with this package. Which
  networks exist is an editorial and privacy decision belonging to the
  consumer, the URLs change, and networks die. The consumer supplies
  `Targets`.
- **Bundling brand icons.** `AGENTS/headless.md` forbids bundled icon
  assets; destination labels are text supplied by the consumer.
- **Share counts, analytics, or tracking.** The component reports what
  the user chose via `OnShare`; what you do with that is yours.
- **Persistence.** Unlike the `*-select` helpers, this control has no
  state to remember. Nothing is written to `localStorage`.
- **Shipping a JS file.** Everything the browser must do is reached
  through `IJSRuntime` `eval` from event handlers. No static web asset,
  no `_content/` path, no module import for consumers to wire up.

## 3. Architectural decisions

- **A helper, but not a preference lifecycle.** The other helpers own
  *selection + DOM application + optional persistence*. This one owns an
  *action*: it applies nothing to the document and persists nothing. It
  is a helper because it owns a complete interaction end to end and
  ships the same headless contract. See `AGENTS/helpers.md`.
- **Disclosure + real links, not a menu.** Share destinations are
  navigation, so they render as real `<a>` elements. `role="menuitem"`
  would strip middle-click, open-in-new-tab and copy-link-address — real
  affordances users rely on for exactly this kind of list. The WAI-ARIA
  APG itself suggests a disclosure when the items are links. Copy is a
  genuine action, so it is a `<button>`.
- **`Href` is a function, not a template string.** The consumer builds
  the whole URL and owns any encoding, so no endpoint or query-parameter
  convention is baked in.
- **No default copy label.** The copy item renders only when `CopyLabel`
  is supplied, because a default would be a hardcoded English string —
  see `AGENTS/internationalization.md`.
- **A dismissed native sheet is not a failure.** `navigator.share()`
  rejects when the user dismisses the sheet. Falling back to the list
  there would resurrect UI the user just dismissed, so a rejection ends
  the interaction.
- **The share script resolves a sentinel; it never rejects.** A single
  try/catch around the interop call would conflate "this browser has no
  share sheet" (fall back to the list) with "the user dismissed the
  sheet" (stop). Those must stay distinct, so the injected script
  resolves to `"shared"`, `"dismissed"` or `"unsupported"` and the .NET
  side switches on it. This is the Blazor-specific mechanism behind §5.1.
- **The URL is resolved from `NavigationManager`, not the browser.**
  `NavigationManager.Uri` is server-known, so the default URL works
  during prerender without touching `location`.

## 4. Public API

### 4.1 Parameters

| Parameter | Type | Required | Default | Purpose |
| --------- | ---- | -------- | ------- | ------- |
| `Label` | `string` | yes | — | Accessible name for the button. |
| `Targets` | `IReadOnlyList<ShareTarget>` | no | empty | Destinations to offer. Empty is valid when `CopyLabel` is set. |
| `Url` | `string?` | no | current page URL | URL to share. Resolved lazily from `NavigationManager`, so the default is prerender-safe. |
| `Title` | `string` | no | `""` | Passed to `Href(...)` and the native sheet. |
| `Text` | `string` | no | `""` | Passed to `Href(...)` and the native sheet. |
| `CopyLabel` | `string?` | no | `null` | Label for the copy item. Omit it and no copy item renders. |
| `CopiedLabel` | `string?` | no | `null` | Announced in the status region after a successful copy. |
| `CopyFailedLabel` | `string?` | no | `null` | Announced when the clipboard write fails. |
| `Strategy` | `ShareStrategy` | no | `Auto` | Whether to prefer the native sheet. |
| `ChildContent` | `RenderFragment<ShareButtonContext>?` | no | the ↪ glyph | Replaces the button glyph. |
| `OnShare` | `EventCallback<ShareEventArgs>` | no | — | Fires when a destination is chosen. |
| `OnCopy` | `EventCallback<string>` | no | — | Fires after a successful copy, with the URL. |
| `OnNativeShare` | `EventCallback<string>` | no | — | Fires when the native sheet was used instead of the list. |
| `CssClass` | `string` | no | `""` | Extra class on the root. |
| `AdditionalAttributes` | unmatched attributes | no | — | Spread onto the root `<div>`. |

```csharp
public sealed class ShareTarget
{
    public required string Id { get; init; }
    public required string Label { get; init; }
    public required Func<string, string, string, string> Href { get; init; }
    public bool NewTab { get; init; } = true;
}

public enum ShareStrategy { Auto, Native, List }

public sealed class ShareButtonContext
{
    public required bool Open { get; init; }
    public required string Url { get; init; }
}

public sealed class ShareEventArgs
{
    public required string TargetId { get; init; }
    public required string Url { get; init; }
}
```

### 4.2 DOM contract

```html
<div class="share-button {CssClass}" ...AdditionalAttributes>
  <button type="button" class="share-button-trigger"
          aria-label="{Label}" aria-expanded aria-controls="{listId}">
    <span class="share-button-icon" aria-hidden="true">↪</span>
  </button>
  <ul class="share-button-list" id="{listId}" hidden>
    <li class="share-button-list-item">
      <a class="share-button-target" data-target-id="{Id}" href="{Href(...)}"
         target="_blank" rel="noopener noreferrer">{Label}</a>
    </li>
    <li class="share-button-list-item">
      <button type="button" class="share-button-copy">{CopyLabel}</button>
    </li>
  </ul>
  <p class="share-button-status" aria-live="polite"></p>
</div>
```

The trigger's class is `share-button-trigger`, not
`share-button-button`. The sibling helpers use `{helper}-button`, which
here would read `.share-button-button` — the one place the naming
convention is bent, and deliberately.

`target="_blank"` is omitted for a destination with `NewTab = false`.
Ids come from a monotonic process-wide counter
(`share-button-{n}-list`), so they are stable and prerender-safe.

### 4.3 Public surface

Component `ShareButton` in namespace `LilyDesignSystem.Blazor.Helpers`,
plus the types `ShareTarget`, `ShareStrategy`, `ShareButtonContext`,
`ShareEventArgs`, `NativeShareOutcome`.

Blazor has no module barrel, so the Svelte package's re-exports become
`public static` members — the C# equivalent named in the port contract:

| Svelte export | Blazor equivalent |
| ------------- | ----------------- |
| `RIGHTWARDS_ARROW_WITH_HOOK` | `ShareButton.RightwardsArrowWithHook` |
| `nextShareButtonId()` | `ShareButton.NextShareButtonId()` |
| `canShareNatively()` | `ShareButton.CanShareNativelyAsync(IJSRuntime)` |
| `canCopy()` | `ShareButton.CanCopyAsync(IJSRuntime)` |

The two capability probes are **async** because the browser is only
reachable over JS interop; both return `false` during prerender rather
than throwing.

Public instance methods `ActivateAsync()`, `CopyAsync()` and
`ShareNativelyAsync()` let a consumer drive the control from its own UI.

Internal statics, visible to the test project: `CanShareScript`,
`CanCopyScript`, `BuildNativeShareScript(url, title, text)`,
`BuildCopyScript(url)`, and the `SharedSentinel` / `DismissedSentinel` /
`UnsupportedSentinel` constants.

## 5. Behaviour

### 5.1 Activation

`Strategy.Auto` (default) attempts `navigator.share({ url, title, text })`
and opens the list only when the browser reports no sheet.
`Strategy.Native` always attempts the sheet. `Strategy.List` never does,
and never even asks. When the sheet is used the list does not open.

The injected script resolves one of three sentinels:

| Sentinel | Meaning | Result |
| -------- | ------- | ------ |
| `"shared"` | The user completed the share. | `OnNativeShare` fires; the list stays closed. |
| `"dismissed"` | The user dismissed the sheet. | The interaction ends; the list stays closed. |
| `"unsupported"` | No `navigator.share`. | Fall back to the list. |

A failure of the interop call itself — prerender, JS disabled — is
treated as `"unsupported"`, so the list still works.

### 5.2 Copying

`navigator.clipboard.writeText(url)`. Success fires `OnCopy` and, if
supplied, announces `CopiedLabel`. Failure — including a browser with no
clipboard API at all — announces `CopyFailedLabel` and never throws.
Either way the list closes.

### 5.3 Keyboard

| Key | On the button | In the list |
| --- | ------------- | ----------- |
| `Enter` / `Space` | Activates (native browser behaviour) | Activates the focused item |
| `ArrowDown` | Opens, focuses the first item | Moves focus down, clamping |
| `ArrowUp` | Opens, focuses the last item | Moves focus up, clamping |
| `Home` / `End` | — | First / last item |
| `Escape` | — | Closes and returns focus to the button |
| `Tab` | Moves on | Closes, focus goes where the browser sends it |

Items are real focusable elements, so focus moves for real rather than
via `aria-activedescendant`. Focus moves are deferred to
`OnAfterRenderAsync`: an item cannot take focus while the list still
carries `hidden`, and the trigger cannot be refocused until the close
has been painted.

Focus leaving the root closes the list.

## 6. Accessibility

WCAG 2.2 AAA target. The glyph is `aria-hidden`; the accessible name is
the button's `aria-label`, which is consumer-supplied and localisable.
The status region is `aria-live="polite"` and empty on load, so it
announces the copy outcome and nothing else. Destinations keep native
link semantics.

Known costs, stated rather than glossed: the control's name rests
**entirely** on `aria-label`, with no visible text fallback; and the
native-sheet path means behaviour differs by platform, so what a user
sees on a phone is not what they see on a desktop. Full treatment in
[`docs/accessibility.md`](../docs/accessibility.md).

## 7. Testing acceptance criteria

`ShareButtonTests.cs` asserts every clause below. Clause numbering
matches the canonical Svelte spec one-for-one.

1. Renders a disclosure `<button>` with `aria-expanded` controlling a `<ul>`.
2. The list is hidden until the button is activated.
3. Destinations are real `<a>` elements with no `role` override, `target="_blank"` and `rel="noopener noreferrer"`.
4. Each destination's `href` comes from its own `Href()`.
5. The copy item renders only when `CopyLabel` is supplied.
6. The status region is present, polite, and empty on load.
7. Copying writes the URL and fires `OnCopy`.
8. A successful copy announces `CopiedLabel` and closes the list.
9. A failed copy announces `CopyFailedLabel` and does not throw.
10. An absent clipboard API is a failure, not a crash.
11. `CanShareNativelyAsync()` reflects `navigator.share`.
12. `Strategy.Auto` uses the sheet when available and does not open the list.
13. `Strategy.Auto` falls back to the list with no sheet; `Strategy.List` ignores an available sheet.
14. A dismissed (rejected) sheet does not fall through to the list.
15. Opening focuses the first item; `ArrowDown` / `ArrowUp` on the closed button open focused on first / last.
16. Arrows move focus and clamp; `Home` / `End` jump.
17. `Escape` closes and returns focus to the button.
18. Choosing a destination fires `OnShare` with its `Id` and closes the list.
19. Focus leaving the root closes the list.
20. An explicit `Url` parameter wins.
21. With no `Url`, the current page URL is used.
22. `ChildContent` replaces the glyph and receives `ShareButtonContext`.

### 7.1 How focus is asserted

bUnit has no live focus model, so `document.activeElement` has no
equivalent. Real focus moves are still observable:
`ElementReference.FocusAsync()` goes out over JS interop as
`Blazor._internal.domWrapper.focus`, carrying the `ElementReference` of
its target, and bUnit stamps every `@ref`'d element with a
`blazor:elementReference` GUID in the first render's markup. Those GUIDs
stay stable across re-renders, so the suite maps GUID → element once, up
front, and then asserts exactly which element the component asked the
browser to focus. Clauses 15, 16 and 17 rest on this.

### 7.2 How the browser APIs are stubbed

`navigator.share` and `navigator.clipboard` are reached through
`IJSRuntime` `eval`. bUnit's Loose mode returns `default(T)` for any
unmatched call, so the no-setup baseline is `null` (→ `Unsupported`) for
the share script and `false` for the copy script: a browser with neither
API. That is deliberately the same baseline the Svelte suite establishes
by deleting both off `navigator` in `beforeEach`.

## 8. Verification

From `lily-design-system-blazor-helpers/tests/LilyDesignSystem.Blazor.Helpers.Tests`:

```sh
dotnet test
```

The whole catalog suite must be green. This package contributes 34
cases; the catalog total is 122.

## 9. Blazor deviations from the canonical Svelte implementation

Each of these is forced by the framework, not chosen.

- **No document-level click listener.** The Svelte version closes on an
  outside click via `<svelte:document onclick>`. This package ships no
  JS and adds no document listener, so the root's `focusout` closes the
  list instead — the same deviation `TextSizeSelect` documents. Clause
  19 is therefore stated as "focus leaving the root closes the list"
  rather than "clicking outside closes the list". Pointer dismissal
  still works, because clicking away moves focus away.
- **`FocusEventArgs` has no `relatedTarget`.** Blazor does not surface
  it, so the component cannot ask "did focus land inside me?". Instead
  it flags focus moves it makes itself and ignores the next `focusout`.
- **No `preventDefault` on keydown.** Blazor evaluates
  `@onkeydown:preventDefault` at render time, so it cannot be applied
  conditionally per key — and applying it unconditionally would break
  `Tab`. A suppress-next-click flag stops the arrow keys' synthesised
  click from toggling the list a second time; it is cleared whenever the
  trigger regains focus, so it can never swallow a genuine later click.
- **The capability probes are async.** `canShareNatively()` and
  `canCopy()` are synchronous in Svelte. Their Blazor equivalents take
  an `IJSRuntime` and return `Task<bool>`, since the browser is only
  reachable over interop.
- **`class` is `CssClass`.** `class` is a C# keyword.
- **`children` is `ChildContent`**, typed
  `RenderFragment<ShareButtonContext>` rather than a Svelte snippet.
- **`OnShare` carries a `ShareEventArgs`** rather than two positional
  arguments, because `EventCallback<T>` is single-argument.

## 10. Tracking

- Package: lily-design-system-blazor-share-button
- Assembly / NuGet id: LilyDesignSystem.Blazor.ShareButton
- Version: 0.1.0
- License: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause

---

Lily™ and Lily Design System™ are trademarks.
