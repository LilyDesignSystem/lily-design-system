# Changelog — SettingsPicker (Blazor)

All notable changes to this helper are documented in this file. The format is loosely based on
[Keep a Changelog](https://keepachangelog.com/) and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-10-08

**First release.** An icon button (a bundled cog SVG) opening a disclosure panel that holds whatever the
app provides. Props: `label`, `open` (bindable), `closeOnSelect`, `onOpenChange`, `children({ open, close })`, `icon`.
A named `role="group"` panel (not an ARIA menu), closes on select / Escape / Tab / outside click / focus leaving,
hover/keyboard-focus tooltip. No default content and no English. Spec §7 has 21 acceptance clauses; the suite has one test
each.
