---
name: lily-design-system-add-component
description: Adds a new canonical Lily component across the monorepo with bin/new-component, then replaces its generic scaffold with reviewed semantics, behaviour, docs, ports, and tests. Use when a Lily maintainer asks to add, scaffold, introduce, or port a new catalog component or component slug.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause OR OGL-UK-3.0 OR CC-BY-SA-4.0
---

# Add a Lily component

This is a maintainer workflow for the canonical monorepo. Do not run it merely
to use an existing component in an application.

## 1. Define the contract before scaffolding

1. Search `components.tsv` and `components-categories.tsv` for an existing or
   synonymous component.
2. Read `AGENTS/components.md`, `AGENTS/headless.md`, and the nearest component
   family. Choose a lowercase kebab-case slug whose suffix matches its semantic
   HTML element.
3. Decide the native element, composition family, ARIA relationships, keyboard
   behaviour, visible-label inputs, and When to Use / When Not to Use guidance.
4. Treat user-facing text as consumer input. Do not add bundled CSS, icons,
   fonts, images, routing, fetching, or persistence.

## 2. Preview and run the scaffolder

```sh
bin/new-component --dry-run example-widget "short plain description"
bin/new-component example-widget "short plain description"
```

The description must not contain a backtick or dollar sign. The command creates
an **experimental generic `<div>` placeholder**; its output is not a finished
component. `bin/new-component --revert example-widget` is only safe immediately
after a scratch run when nobody else changed its shared generated files.

## 3. Replace every placeholder

Use Svelte as the canonical implementation, then port the agreed contract
idiomatically. The scaffolder covers the original seven full catalogs and
selected example/docs surfaces; explicitly audit the current Web Components,
Alpine.js, and Solid catalogs rather than assuming the command created them.

For every applicable catalog:

- replace the generic element and placeholder props with the agreed contract;
- preserve the kebab-case class first and pass through consumer attributes;
- implement focus and keyboard behaviour with native platform features first;
- add tests that fail without the real semantics or behaviour;
- add stories/examples without hardcoded product copy;
- update `components/{slug}/AGENTS.md`, `index.md`, and `spec/index.md`.

If a catalog cannot implement the component (for example, an autonomous custom
element cannot represent a table sub-element), document and validate that
architectural exclusion instead of faking parity.

## 4. Regenerate and verify

Run the repository generators named by the scaffolder, then the relevant
package tests. Finish with:

```sh
bin/test
```

Also inspect the catalog row, category, docs-site page, examples, component
counts, and `git diff --check`. Do not mark the component beyond experimental
until the real contract, all applicable ports, and meaningful tests exist.
