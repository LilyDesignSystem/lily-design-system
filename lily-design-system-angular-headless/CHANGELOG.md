# Changelog — lily-design-system-angular-headless

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the package follows [Semantic Versioning](https://semver.org/).
The canonical monorepo history is in the root
[CHANGELOG.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md).

## 0.1.1 — 2026-08-26

Fixed: **every typed input component rendered `type="text"`** — all 25
of them (radio, checkbox, date, email, file, password, range, tel, url,
week, and the rest), a generator artifact that survived because no spec
asserted an input's type. Radio buttons were text boxes to the browser
and to assistive technology. Each of the 25 now renders its canonical
type from `components/{slug}/AGENTS.md`, each spec asserts it (the new
assertions were seeded-fault-checked), and the suite grows 985 → 1,010
cases. Found via an axe `target-size` finding on the Angular example
app's settings page, whose "radios" were undersized text inputs.

## 0.1.0 — 2026-08-26

First published release: the Angular 20 headless component library (standalone, signal-based, OnPush),
covering all 491 catalog components with per-component tests.

Numbered 0.1.0 deliberately. In-tree version numbers existed before
this release, but nothing was ever published under this name, and a
first release numbered higher would imply registry history that never
existed — the same reasoning the helper packages recorded at their
July 2026 reset. Sibling packages (svelte, react, vue) are on their
own version lines.
