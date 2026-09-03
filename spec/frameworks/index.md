# Frameworks

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Lily™ implements one canonical 491-component catalog across seven framework pairs — a headless library plus a styled example app per framework — so the same semantic, accessible markup is expressed in each framework's native idiom. This topic maps the pairs, their stacks, and their per-framework component file shapes.

## Scope

This topic covers the seven headless + seven example subprojects (spec §3) — the partial, unpaired Web Components headless catalog is covered in [architecture](../architecture/index.md), not here — the stack each one targets, the file shape each headless library uses to express a catalog component, the copy-pattern by which example apps consume the headless components, and the framework-specific conventions for Svelte/SvelteKit and Nunjucks. (The one-time Angular + Analog SSR blocker is resolved — see below.)

It does **not** cover: the binding markup/ARIA rules every framework obeys (see [headless](../headless/index.md)), the canonical catalog and naming/suffix mappings (see [components](../components/index.md)), example-app routes and styling (see [examples](../examples/index.md)), the test suites per framework (see [testing](../testing/index.md)), or the reusable helper packages that sit alongside the headless libraries (see [helpers](../helpers/index.md)).

## Principles and rules

- **One catalog, seven idioms.** Every framework implements the same 491 components with the same kebab-case base classes and the same semantic HTML; only the language and file shape differ.
- **Headless libraries ship components only.** They do not depend on their sibling app framework — e.g. svelte-headless does not depend on SvelteKit; angular-headless ships standalone components, not an Analog app.
- **Example apps consume by copy.** Each example app copies the headless components into its own source tree rather than taking an npm/NuGet dependency, so the demos always track the in-repo headless source.
- **Framework idioms, not framework lock-in.** Rest-props spread, two-way binding, and slots/children each use the framework's native mechanism (see [headless](../headless/index.md) for the rest-props table).
- **Subtree-pushable.** Each of the 14 subprojects is a `git subtree` with its own `.git-subtree-push` remote configuration.

## The seven framework pairs

| Framework | Headless dir | Example dir | Stack | Component file shape |
| --------- | ------------ | ----------- | ----- | -------------------- |
| HTML | `lily-design-system-html-headless` | `lily-design-system-html-css-js-examples` | Plain HTML + CSS + JS; web components | One web component per slug (`{slug}.js` custom element) + class hooks |
| Svelte | `lily-design-system-svelte-headless` | `lily-design-system-svelte-sveltekit-examples` | Svelte 5 (runes) + SvelteKit 2, Vite, pnpm, TypeScript | `{Pascal}.svelte` |
| React | `lily-design-system-react-headless` | `lily-design-system-react-next-examples` | React 19 + Next.js, TypeScript | `{Pascal}.tsx` |
| Vue | `lily-design-system-vue-headless` | `lily-design-system-vue-nuxt-examples` | Vue 3 + Nuxt.js, TypeScript | `{Pascal}.vue` |
| Angular | `lily-design-system-angular-headless` | `lily-design-system-angular-examples` | Angular 22 (signals, OnPush, standalone) + Analog.js v2, Vite 7 | `{slug}.component.ts` |
| Blazor | `lily-design-system-blazor-headless` | `lily-design-system-blazor-web-examples` | Blazor 10 / .NET, bUnit | `{Pascal}.razor` (+ `.razor.cs`) |
| Nunjucks | `lily-design-system-nunjucks-headless` | `lily-design-system-nunjucks-eleventy-examples` | Nunjucks 3 + Eleventy | `components/{slug}/macro.njk` |

## How each headless library expresses a component

Every library renders the same semantic element with the same kebab-case base class; the difference is the surface syntax and the rest-props mechanism.

| Framework | Rest props | Two-way binding | Children / slots |
| --------- | ---------- | --------------- | ---------------- |
| HTML | attributes pass through on the custom element | attribute + property reflection | light-DOM slotting |
| Svelte | `{...restProps}` | `$bindable()` | `Snippet` + `{@render children?.()}` |
| React | `{...restProps}` | controlled value + `onChange` | `children` |
| Vue | `v-bind="$attrs"` | `v-model` / `defineModel` | `<slot>` |
| Angular | `additional-attributes` host binding | signal input + output | `<ng-content>` |
| Blazor | `@attributes` | bindable parameter + `EventCallback` | `ChildContent` (`RenderFragment`) |
| Nunjucks | `params.attributes` key/value loop | n/a (stateless macro) | `params.html | safe` / `params.text` |

## Per-framework conventions

### Svelte 5 + SvelteKit 2

- Runes throughout: `$state`, `$derived`, `$props`, `$bindable`, `$effect`.
- Headless components carry **no** `<style>` block — consumers supply all CSS; scoping only applies inside the example app.
- Children use the `Snippet` type with the optional `{@render children?.()}` form so missing children do not throw.
- Every `{#each}` block has a key expression.
- Tooling is pnpm + Vite; testing is vitest + `@testing-library/svelte` + jsdom, using vitest built-in matchers only (never jest-dom matchers).

### Nunjucks + Eleventy

- Each component is a directory: `components/{slug}/macro.njk` plus `macro.test.js`.
- Macro names are camelCase (Nunjucks forbids hyphens in identifiers); file paths and CSS classes stay kebab-case.
- Each macro takes a single `params` object with shared keys: `text`, `html`, `label`, `classes`, `attributes`, plus component-specific params.
- Raw HTML passed via `params.html` is rendered with `| safe` and must be sanitised by the consumer (XSS).

## Example-app copy-pattern

| Step | Behaviour |
| ---- | --------- |
| Source | The headless components are the single source of truth in `lily-design-system-{framework}-headless`. |
| Copy | Each example app copies those components into its own tree (e.g. Angular copies `.component.ts` files into `src/app/components/`). |
| Demo | `/components/{slug}` renders the real copied component via the framework's raw-HTML mechanism (`{@html}`, `dangerouslySetInnerHTML`, `v-html`, `MarkupString`, `{{ demo | safe }}`, `innerHTML`). |
| Styling | The example app supplies the stylesheet targeting the kebab-case class hooks (see [examples](../examples/index.md)). |

## Angular + Analog.js status (spec §11.2, §11.8)

- **angular-headless** is verified end-to-end: `pnpm install` resolves with `@analogjs/vite-plugin-angular` pinned to `1.19.4` and `@angular/build` as a direct devDep; `vitest run` passes 974 / 974 across 490 / 490 spec files; `ng-packagr` emits a clean APF bundle; `@storybook/angular` 9.1 builds 490 / 490 stories. Source fix: `($event.target as HTMLInputElement).value` rewritten to `$any($event.target).value` because Angular template parsing rejects parenthesised TS casts inside method calls.
- **angular-examples** builds full-content static SSG on Angular 22.1 + Analog 2.7 + Vite 7 + TypeScript 6. The route layer uses an explicit 15-route table over plain `src/app/views/*.ts` components rather than Analog's file-route convention, whose injection failed silently in every mode (upstream: [analogjs/analog#2498](https://github.com/analogjs/analog/issues/2498)); the full history is in [analog-ssg-notes.md](../../lily-design-system-angular-examples/docs/analog-ssg-notes.md). Playwright covers the app end to end: 1,545 specs (491 component pages, axe, responsive, theme switching).

## Acceptance criteria

- [ ] All 7 headless subprojects exist and implement all 491 canonical components (spec §11.2, §11.4).
- [ ] All 7 example subprojects exist and consume the headless components via the copy-pattern (spec §11.2).
- [ ] Each headless library expresses components in its native file shape (`.svelte`, `.tsx`, `.vue`, `.component.ts`, `.razor`, `macro.njk`, web components) with the canonical kebab-case base class.
- [ ] Each example app ships the three required routes and renders the real copied component on `/components/{slug}` (see [examples](../examples/index.md)).
- [ ] Svelte headless ships no `<style>` blocks; Nunjucks macros use camelCase names with kebab-case classes.
- [x] angular-headless passes its vitest suite (1,010 cases as of 2026-08-26) and builds via ng-packagr 22; angular-examples builds full-content SSG on Analog 2.7 with the explicit route table (the one-time blocker is closed).
- [ ] All 14 subprojects are git subtrees with a `.git-subtree-push` remote.

## Related topics

- [headless](../headless/index.md) — the markup/ARIA rules every framework obeys, including the rest-props mechanism table
- [components](../components/index.md) — the canonical 491-component catalog and suffix-to-element mapping each framework implements
- [examples](../examples/index.md) — the styled reference apps, required routes, and copy-pattern target
- [testing](../testing/index.md) — per-framework vitest / bUnit / Playwright / Storybook coverage
- [helpers](../helpers/index.md) — the reusable helper packages shipped per framework alongside the headless libraries

## Sources

- [spec/index.md](../index.md) §3 (architecture, the 7 + 7 subprojects), §11.2 (subproject status, Angular notes), §11.8 (Angular SSR blocker)
- [AGENTS/sveltekit.md](../../AGENTS/sveltekit.md) — Svelte 5 + SvelteKit 2 conventions
- [AGENTS/nunjucks.md](../../AGENTS/nunjucks.md) — Nunjucks macro conventions
- [AGENTS/lily.md](../../AGENTS/lily.md) — subproject directory listing

---

Lily™ and Lily Design System™ are trademarks.
