# Changelog — link-picker (Web Components)

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/); the project follows [Semantic Versioning](https://semver.org/).

## 0.2.0 — 2026-10-16

- Added `open` (property and attribute), `disabled` (property and attribute), an `openchange` event and an `onOpenChange` property, ported from the Svelte package's `open`, `onOpenChange` and `disabled` (spec "Open state and disabled"). `openchange` (detail: the new state) fires once for each change, from the user or from `open`, and not for an initial `open` attribute; opening from outside does not move focus; `disabled` disables the real button inside `<lily-icon-button>` and closes an open popup.

## 0.1.0 — 2026-10-07

**First release.** `<lily-link-picker>`: a home-icon button opening a disclosure of app-defined page links (`label`, `links` as a property
or JSON attribute, `onNavigate`, a cancelable `navigate` event, `renderButtonContent()`). Real `<a>` links, `aria-current="page"`,
hover/keyboard-focus tooltip, full keyboard support. No default links and no English. 26 tests, one per spec clause.
