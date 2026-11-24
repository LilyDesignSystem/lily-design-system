# Changelog — @lilydesignsystem/solid-theme-picker

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the package follows [Semantic Versioning](https://semver.org/).

## Unreleased

- **Behaviour change:** the theme cookie is off by default (tasks.md P41-T5c). With `cookieName` unset, a choice is kept in `localStorage` under `lily-{name}` and in no cookie; name one, such as `cookieName="lily-theme"`, to keep it in a first-party cookie too, for a server-rendered page. From 2026-11-16 both were on by default. An app that reads the `lily-theme` cookie on its server must now set `cookieName`.

## 0.2.0 — 2026-11-22

- **Order change:** the themes are listed in one list sorted by the name shown (`sortThemes`, default on; turn it off to keep the order given), compared with the page's language from `<html lang>`, so "NHS England (patients)" is under N.

## 0.1.0 — unreleased

- First release, for Solid 2.0 (`solid-js` and `@solidjs/web` ^2.0.0 as peers): theme picker: an icon button opening an APG listbox that swaps a theme stylesheet and sets data-theme. Headless, SSR-safe, no CSS.
- Ported from [`@lilydesignsystem/react-theme-picker`](../lily-design-system-react-theme-picker/) with its tests, to the contract in
  [spec/index.md](./spec/index.md); the same markup, class hooks, keyboard and ARIA as the other catalogs.
- The monorepo [CHANGELOG](../CHANGELOG.md) has the detail.

---

Lily™ and Lily Design System™ are trademarks.
