# Changelog — link-picker (Nunjucks)

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/); the project follows [Semantic Versioning](https://semver.org/).

## 0.2.0 — 2026-10-16

- Added macro params `open` and `disabled`, client option `onOpenChange`, a bubbling `openchange` event and the client methods `isOpen()`, `setOpen(next)` and `setDisabled(next)`, ported from the Svelte package's `open`, `onOpenChange` and `disabled` (spec "Open state and disabled"). A popup rendered open starts open (and is not reported); `setOpen` changes it from outside without moving focus; `disabled` disables the button and closes an open popup.

## 0.1.0 — 2026-10-07

**First release.** A home-icon button opening a disclosure of app-defined page links. Real `<a>` links (not a menu), `aria-current="page"`,
hover/keyboard-focus tooltip, full keyboard support, no default links and no English. 25 tests, one per spec clause.
