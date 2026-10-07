# Changelog — LinkPicker (Svelte)

All notable changes to this helper are documented in this file. The format is loosely based on
[Keep a Changelog](https://keepachangelog.com/) and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-10-07

**First release.** An icon button (a bundled home SVG) opening a disclosure of page links the app defines. Props:
`label`, `links` (`{ id?, label, href, current?, newTab? }`), `navigate?`, `onNavigate?`, `children?`. Real `<a>` links
(not a menu), `aria-current="page"`, hover/keyboard-focus tooltip, full keyboard support. No default links and no English.
Spec §7 has 24 acceptance clauses; the suite has one test each. Ships with examples for Home, About Us, Contact Us and
Privacy Policy.
