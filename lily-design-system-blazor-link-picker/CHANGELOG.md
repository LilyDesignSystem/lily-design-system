# Changelog — LinkPicker (Blazor)

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/); the project follows [Semantic Versioning](https://semver.org/).

## 0.2.0 — 2026-10-16

- Added `Open` (bindable: `@bind-Open`, with `OpenChanged`) and `Disabled`, ported from the Svelte package's `open`, `onOpenChange` and `disabled` (spec "Open state and disabled"). `OpenChanged` is raised with the new state whenever the picker changes it (the user's action, or `Disabled` closing it); changing `Open` from the parent opens or closes the popup without moving focus; `Disabled` disables the button.

## 0.1.0 — 2026-10-07

**First release.** A home-icon button opening a disclosure of app-defined page links. Real `<a>` links (not a menu), `aria-current="page"`,
hover/keyboard-focus tooltip, full keyboard support, no default links and no English. 24 tests, one per spec clause.
