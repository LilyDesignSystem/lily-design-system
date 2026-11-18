# Lily Design System™ - Solid Headless: specification

## Summary

A tenth headless catalog, for Solid 2.0 (released 2026-11-17): the 637 catalog components as Solid components, with the
same root elements, class hooks, ARIA, keyboard contracts and no English defaults as the other catalogs. Requested by the
maintainer on 2026-11-17; tracked in the root [tasks.md](../../tasks.md) as Phase 36.

## Scope

- In scope: `components/{Name}.tsx` for every row of [components.tsv](../../components.tsv), each with tests; a typed barrel and a
  built package (`@lilydesignsystem/solid-headless`); the root `bin/` checks that already cover the other catalogs.
- Other subprojects (all done 2026-11-18): the 21 Solid helper packages (`lily-design-system-solid-*`), the example app
  (`lily-design-system-solid-examples`) and the three `lily-design-system-solid-*-skill` packages.
- Out of scope: SolidStart (retired by Solid 2.0), Solid 1.x compatibility.

## Decisions

1. **Solid 2.0 only.** `solid-js` and `@solidjs/web` ^2.0.0 as peers. Solid 1 has a different props and effects API
   (`splitProps`, `mergeProps`, `onMount`, `createResource`), and supporting both would double every stateful component.
2. **Ported from the React catalog**, the nearest in syntax (JSX), by `bin/convert-react-to-solid.py` for the components
   with no hooks, then by hand. The React tests are ported with them, so each component meets the same assertions.
3. **`class`, not `className`**, matching Solid, Svelte, Vue and HTML.
4. **`attr()` for ARIA and data booleans.** Solid renders a boolean attribute value as presence; the catalog's
   contract is `aria-pressed="false"`, which React, Vue and Svelte render. Every non-literal `aria-*` / `data-*`
   value that can be boolean goes through `components/attr.ts`.
5. **Text inputs listen to `input`** and keep the public `onChange` prop, so a value reaches the consumer per keystroke
   as in the other catalogs.
6. **Testing:** Vitest 5 in jsdom with `@solidjs/vite-plugin` 3 and `@solidjs/testing-library` 1.0.0-rc.2, the first
   release that supports Solid 2 (a release candidate; move to 1.0.0 when it ships).
7. **No Storybook yet.** Storybook has no Solid 2 framework package; revisit when one exists.

## Status (2026-11-17)

- 637 of 637 components ported; 3,998 tests passing; `tsc --noEmit` clean; ESLint 0 errors; Prettier clean.
- Built by `build.mjs`; in the root checks and CI's headless matrix.

## Porting notes

- `withDefaults`, not Solid's `merge`, for defaults: `merge` lets an explicit `undefined` win, so a consumer that
  forwards an optional prop would lose the default (RepeatableFieldset's `min`, Button's `type`). React, Svelte and Vue
  apply the default for `undefined`.
- `forwardRef` has no counterpart: a ref is an ordinary prop, spread onto the root, or a ref array (`Listbox`).
- A list whose items are replaced on each edit is a keyed `<For>` (`keyed={itemKey}`), so a row keeps focus while
  typing (`RepeatableFieldset`).
- React's "latest ref" (`latest.current = { … }` in the body, read later in a listener) is a live getter in Solid,
  `const latest = { get current() { return { … }; } }`: the body runs once, so an assignment there would keep the
  first props forever. Seven components used it; only one test noticed.
- An id from `createUniqueId()` is a constant, never an accessor: an accessor would mint a new id on each read, and
  `aria-labelledby` would point at nothing.
- `<select multiple>` takes its selection from `option.selected`, set by an effect; `value={array}` does nothing.
- Tests: `fireEvent` comes from `./test-utils`, which flushes after dispatch (React's runs inside `act`); `act()` comes
  from `./test-act`; a changing prop is a signal set with `flush()`, never a remount; JSX shared by several tests is a
  factory, since Solid JSX is real DOM nodes.

## Tasks

- [x] **S1** Port every component with its tests (637 of 637, 2026-11-17).
      Verify: every row of `components.tsv` has `components/{Name}.tsx` and a passing test.
- [x] **S2** `build.mjs`: generate the `index.ts` barrel and build `dist/` (Solid's compiled output plus types and the
      `solid` export condition). Verify: a scratch consumer imports and renders a component.
- [x] **S3** Add the catalog to the root checks (`bin/check-class-names`, `check-html-tags`, `check-coverage`,
      `check-dev-warnings`, `check-built-english`, `check-identifier-inputs`, `check-port-data-attributes`) and to CI's
      headless matrix. Verify: `bin/test` and CI cover `lily-design-system-solid-headless`.
- [x] **S4** Publish `@lilydesignsystem/solid-headless` 0.1.0 (maintainer approval). _(0.1.0 on 2026-11-17; 0.1.1, the
      form-reset fix, on 2026-11-18.)_

## Acceptance criteria

- [x] 637 components (the root-element and class checks come with S3).
- [x] Every component's React tests pass in their Solid form (3,998).
- [ ] No hardcoded English; no CSS; rest props spread on the root.
- [x] The package builds, and a consumer can import it (a render of the built bundle, 2026-11-17).

## Sources

- [Solid 2.0 announcement](https://www.solidjs.com/blog/solid-2-0-the-long-hold/)
- The types of `solid-js` 2.0.0, `@solidjs/signals` and `@solidjs/web` 2.0.0, for `merge`, `omit`, `createEffect`,
  `onSettled`, `createUniqueId` and `dynamic`.

---

Lily™ and Lily Design System™ are trademarks.
