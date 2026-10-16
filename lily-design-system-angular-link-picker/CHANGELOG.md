# Changelog — LinkPicker (Angular)

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/); the project follows [Semantic Versioning](https://semver.org/).

## 0.2.0 — 2026-10-16

- Added `[(open)]` (a `model`, with `openChange`) and `disabled`, ported from the Svelte package's `open`, `onOpenChange` and `disabled` (spec "Open state and disabled"). `openChange` fires once for each change, by the user or from outside, and not for the initial value; `disabled` disables the button and closes an open popup.

## 0.1.2 — 2026-10-08

Republished from `dist/` (ng-packagr output). 0.1.1 was published from the source directory by mistake and carries no compiled code; it is deprecated on npm. No source change.

## 0.1.0 — 2026-10-07

**First release.** A home-icon button opening a disclosure of app-defined page links. Real `<a>` links (not a menu), `aria-current="page"`,
hover/keyboard-focus tooltip, full keyboard support, no default links and no English. 24 tests, one per spec clause.
