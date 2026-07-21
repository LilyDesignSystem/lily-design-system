# Changelog — ShareChooser (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-21

Initial release. A Blazor 10 port of the canonical Svelte helper
[`lily-design-system-svelte-share-chooser`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-share-chooser/).

Developed in-tree as `lily-design-system-blazor-share-button` and
renamed to `lily-design-system-blazor-share-chooser` before its first
release, so this 0.1.0 is the only version that has ever existed. The
NuGet package is `LilyDesignSystem.Blazor.ShareChooser`.

### Added

- **`ShareChooser`** — a headless share control. A single-glyph button
  (↪, U+21AA) that opens the **native share sheet** where the browser
  provides one, and otherwise a **disclosure list** of consumer-supplied
  destinations plus a built-in **copy the page URL** action.

  ```html
  <div class="share-chooser {CssClass}">
    <button type="button" class="share-chooser-button" aria-label="{Label}"
            aria-expanded="false" aria-controls="{listId}">
      <span class="share-chooser-icon" aria-hidden="true">↪</span>
    </button>
    <ul class="share-chooser-list" id="{listId}" hidden>
      <li class="share-chooser-list-item">
        <a class="share-chooser-target" data-target-id="{Id}" href="{Href(...)}"
           target="_blank" rel="noopener noreferrer">{Label}</a>
      </li>
      <li class="share-chooser-list-item">
        <button type="button" class="share-chooser-copy">{CopyLabel}</button>
      </li>
    </ul>
    <p class="share-chooser-status" aria-live="polite"></p>
  </div>
  ```

- **The first helper that owns an action, not a preference.** The three
  `*-select` helpers own *selection + DOM application + optional
  persistence*. This one applies nothing to the document and persists
  nothing: no `localStorage`, no `data-*` on the document root, no
  `StorageKey` parameter.

- **A disclosure with real links, not a menu.** Destinations are real
  `<a>` elements with no `role` override. `role="menuitem"` would strip
  middle-click, open-in-new-tab and copy-link-address — affordances users
  genuinely reach for on a share list — and the WAI-ARIA APG itself
  suggests a disclosure when the items are links. Copy is a genuine
  action, so it is a `<button>`.

- **The trigger class is `share-chooser-button`**, following the
  `{helper}-button` convention the sibling helpers use.

- **`ShareTarget`** — `{ Id, Label, Href, NewTab = true }`, where `Href`
  is `(url, title, text) => string`. A function, not a template string,
  so the consumer owns the whole URL and its encoding.

- **`ShareStrategy`** — `Auto` (default), `Native`, `List`. `Auto`
  attempts the native sheet and falls back to the list; `List` never even
  asks.

- **Three distinct native-share outcomes.** The injected script resolves
  a sentinel (`"shared"` / `"dismissed"` / `"unsupported"`) and never
  rejects, so the .NET side can tell "this browser has no share sheet"
  (fall back to the list) from "the user dismissed the sheet" (stop). A
  bare try/catch around the interop call would collapse the two.
  **A dismissed sheet ends the interaction** — falling through to the
  list would resurrect UI the user just dismissed.

- **`CopyAsync`** — `navigator.clipboard.writeText(url)`. Success fires
  `OnCopy` and announces `CopiedLabel`; failure, including a browser with
  no clipboard API at all, announces `CopyFailedLabel` and **never
  throws**. Either way the list closes.

- **No default `CopyLabel`.** The copy item renders only when the label
  is supplied, because a default would be a hardcoded English string —
  see `AGENTS/internationalization.md`.

- **No social-network endpoints.** No URL templates for X / Facebook /
  LinkedIn / Reddit ship with this package. Which networks exist is an
  editorial and privacy decision belonging to the consumer, the URLs
  change, and networks die.

- **Keyboard**, to the WAI-ARIA APG disclosure pattern: `ArrowDown` /
  `ArrowUp` on the closed trigger open focused on the first / last item;
  in the list arrows move focus and **clamp** (no wrapping), `Home` /
  `End` jump, `Escape` closes and returns focus to the trigger, `Tab`
  closes without stealing focus back. Items are real focusable elements,
  so focus moves for real — no `aria-activedescendant`.

- **Public instance methods** `ActivateAsync()`, `CopyAsync()`,
  `ShareNativelyAsync()`, so consumers can drive the control from their
  own UI via a `@ref`.

- **Static helpers** `RightwardsArrowWithHook`, `NextShareChooserId()`,
  `CanShareNativelyAsync(IJSRuntime)`, `CanCopyAsync(IJSRuntime)` — the
  C# equivalents of the Svelte package's module re-exports. The two
  capability probes are async because the browser is only reachable over
  interop, and both return `false` during prerender rather than throwing.

- **Ships no JS file.** Every browser call goes through `IJSRuntime`
  `eval` from an event handler; focus moves are deferred to
  `OnAfterRenderAsync`. No static web asset, no `_content/` path, no
  module for consumers to wire up.

- **34 bUnit + xUnit cases**, one or more per `spec/index.md` §7 clause,
  mapped 1:1 onto the canonical Svelte suite's clause numbering. Catalog
  total rises to 122.

- Documentation: `spec/index.md` (the contract), `index.md` (user guide),
  `AGENTS.md`, `docs/accessibility.md`, and four runnable
  `examples/*.razor`.

### Blazor deviations from the canonical Svelte implementation

Each is forced by the framework, not chosen. Full list in
[`spec/index.md` §9](./spec/index.md#9-blazor-deviations-from-the-canonical-svelte-implementation).

- **No document-level click listener.** The package ships no JS, so the
  root's `focusout` closes the list rather than a document click. §7
  clause 19 is stated as "focus leaving the root closes the list"
  accordingly. Pointer dismissal still works, because clicking away moves
  focus away.
- **`FocusEventArgs` has no `relatedTarget`**, so the component flags the
  focus moves it makes itself and ignores the next `focusout` instead of
  asking whether focus landed inside it.
- **No `preventDefault` on keydown.** Blazor evaluates
  `@onkeydown:preventDefault` at render time, so it cannot be applied per
  key — and applying it unconditionally would trap `Tab`. A
  suppress-next-click flag stops the arrow keys' synthesised click from
  toggling the list twice.
- **`class` is `CssClass`** (C# keyword); **`children` is
  `ChildContent`**, typed `RenderFragment<ShareChooserContext>`;
  **`OnShare` carries a `ShareEventArgs`** rather than two positional
  arguments, because `EventCallback<T>` is single-argument.

---

Lily™ and Lily Design System™ are trademarks.
