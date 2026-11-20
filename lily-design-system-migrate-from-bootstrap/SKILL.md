---
name: lily-design-system-migrate-from-bootstrap
description: Migrates a Bootstrap interface to Lily Design System while preserving semantics, keyboard behaviour, accessible relationships, and product styling. Use when someone asks to replace, remove, convert, or migrate Bootstrap components, data-bs behaviour, utilities, forms, or layout to Lily.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Migrate from Bootstrap to Lily

Read `../MIGRATING-FROM-BOOTSTRAP.md` for the generated Bootstrap-to-Lily
mapping and worked conversion. This is a semantic migration, not a class-name
translation.

## 1. Inventory the Bootstrap dependency

Record:

- component and `.btn`, `.card`, `.modal`, `.form-*`, `.nav-*` classes;
- `data-bs-*` attributes and Bootstrap JavaScript initializers;
- spacing, grid, display, colour, breakpoint, and width utilities;
- custom CSS that relies on Bootstrap DOM structure or variables;
- focus, validation, live-region, and keyboard behaviour that must survive.

## 2. Choose the Lily target

Use the guide's generated table, then open each linked component contract. A
Lily family may replace one Bootstrap wrapper: breadcrumb, pagination, tabs,
menus, and forms depend on several composed components. Do not use menu
semantics for ordinary navigation merely because Bootstrap calls it a dropdown.

Install the matching framework package with
`../lily-design-system-install/`. Decide separately whether to load one Lily
theme or write product CSS; Lily has no utility-class compatibility layer.

## 3. Convert in risk order

1. Replace interactive JavaScript components first: dialogs, menus, tabs,
   disclosures, carousels, popovers, and tooltips. Test focus return, Escape,
   arrow keys, light dismiss, and native semantics as applicable.
2. Convert forms as complete field compositions: persistent label, optional
   hint, native control, linked error, and submit-time error summary. Consumer
   code supplies every visible string.
3. Replace structural components and navigation families.
4. Replace Bootstrap grid and utility classes with application-owned,
   mobile-first CSS or a selected Lily theme. Preserve logical properties,
   zoom, text expansion, and 320-pixel reflow.
5. Remove Bootstrap CSS and JavaScript only after searches find no remaining
   Bootstrap class, variable, import, initializer, or `data-bs-*` dependency.

## 4. Verify the migrated journey

- Run unit and integration tests plus the production build.
- Exercise the journey by keyboard and with a screen reader.
- Check 200% and 400% zoom, 320 CSS pixels, forced colours, reduced motion,
  increased contrast, right-to-left layout, and long translated text where
  supported.
- Run automated accessibility checks, but do not treat them as the audit.
- Compare behaviour before and after; visual similarity must not erase a
  semantic or keyboard improvement.

Lily has not been independently audited. Report that honestly rather than
promising compliance from a package swap.
