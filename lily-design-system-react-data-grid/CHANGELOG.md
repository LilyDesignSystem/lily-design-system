# Changelog — DataGrid (React)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.4.0 — 2026-10-13

Initial release, at the version of the canonical
[`@lilydesignsystem/svelte-data-grid`](../lily-design-system-svelte-data-grid/)
it ports (the contract is that package's `spec/index.md`). Translated to
React 19 idioms: hooks instead of runes; a controlled prop (`selected`,
`filter`, `sort`, `page`) or its `default…` twin instead of two-way binding,
with `on…Change` callbacks (including a new `onPageChange`); render props
(`cell`, `headerCell`, `footer`, an `empty` node) instead of snippets;
`className` instead of `class`. Composes `@lilydesignsystem/react-headless`'s
`DataTable` family unmodified.
