# Conventions — Lily Svelte Helpers

Working rules for every helper in this catalog. The
[shared/](./shared/) files inherit from the Lily-wide
`AGENTS/headless.md`, `internationalization.md`, and `theme.md`; this
file lists the Svelte-specific decisions layered on top.

This catalog is the canonical reference. Vue, React, Angular, Blazor,
Nunjucks, and HTML helper catalogs port from here and the Svelte side
wins when contracts disagree.

## File shape per helper

```
lily-design-system-svelte-<name>/
├── spec.md                  ← single source of truth, numbered with §
├── AGENTS.md                ← fast-index pointer for agents
├── AGENTS/                  ← per-helper topic agent files
│   ├── api.md
│   ├── lifecycle.md
│   ├── accessibility.md
│   ├── testing.md
│   └── ssr.md
├── CLAUDE.md                ← `@AGENTS.md`
├── index.md                 ← comprehensive human-readable guide
├── index.ts                 ← barrel re-export
├── {Pascal}.svelte          ← Svelte 5 runes component
├── {Pascal}.test.ts         ← vitest spec
├── {Pascal}.stories.svelte  ← Storybook story (optional)
├── CHANGELOG.md
├── docs/                    ← topic-by-topic deep-dives
└── examples/                ← runnable `.svelte` files
```

## Component file shape

Every helper component follows this template:

```svelte
<script lang="ts" module>
    import type { Snippet } from "svelte";

    /** Public children-snippet args. */
    export type ChildArgs = { /* … */ };

    /** Public props — see spec.md §4. */
    export type Props = {
        label: string;
        value?: string;
        children?: Snippet<[ChildArgs]>;
        onChange?: (value: string) => void;
        class?: string;
        [key: string]: unknown;
    };

    /** Pure helpers exported for consumer reuse. */
    export function helperName() { /* … */ }
</script>

<script lang="ts">
    let {
        class: className = "",
        label,
        value = $bindable(""),
        children,
        onChange,
        ...restProps
    }: Props = $props();

    $effect(() => { /* initial-value resolution + apply */ });
</script>

<root-element
    class={`{base-class} ${className}`.trim()}
    role="..."
    aria-label={label}
    {...restProps}
>
    {#if children}
        {@render children({ /* ChildArgs */ })}
    {:else}
        <!-- default markup -->
    {/if}
</root-element>
```

The split between a `<script lang="ts" module>` block (for types,
pure helpers, and module-level constants exposed as named exports)
and the instance `<script lang="ts">` block (for the component body)
is the canonical Svelte 5 pattern for exporting both a component and
supporting helpers from one `.svelte` file.

## Svelte 5 runes

The catalog commits to Svelte 5 runes throughout. No Svelte 4
`export let` declarations, no `$:` reactive statements, no legacy
`createEventDispatcher`. The runes used:

| Rune        | Purpose                                                |
| ----------- | ------------------------------------------------------ |
| `$props()`  | Destructure props at the top of the instance `<script>`. |
| `$bindable("")` | Mark a prop as two-way bindable via `bind:value`.   |
| `$state(…)` | Reactive local state.                                   |
| `$effect(…)`| Run side effects when reactive reads change.            |
| `$derived(…)`| Pure computed values (used sparingly).                 |

No `onMount` from the legacy lifecycle API. `$effect` covers the
"after mount" case (it only runs in the browser, never during SSR)
and keeps the dependency graph explicit.

## Two-way binding

The bindable selection is a `$bindable("")` prop named `value`.
Consumers use Svelte's `bind:value`:

```svelte
<ThemeSelect label="Theme" themesUrl="/t/" themes={["light","dark"]} bind:value={theme} />
```

Inside the component:

```ts
let { value = $bindable(""), /* … */ }: Props = $props();
```

Writing to `value` inside the component re-renders the parent on the
next tick. This is the canonical reference signature that Vue
(`v-model:value`), React (`value` + `onChange`), and Angular
(`[value]` + `(valueChange)`) ports mirror.

## Snippets for custom rendering

Custom rendering uses a `children` prop typed as `Snippet<[ChildArgs]>`.
Consumers pass a `{#snippet children(args)}` block:

```svelte
<ThemeSelect label="Theme" themesUrl="/t/" themes={["light","dark"]}>
    {#snippet children({ themes, value, setTheme, name, labelFor })}
        <!-- custom markup -->
    {/snippet}
</ThemeSelect>
```

Inside the component the default is rendered when no snippet is
supplied:

```svelte
{#if children}
    {@render children({ themes, value: value ?? "", setTheme, name, labelFor })}
{:else}
    <!-- default markup -->
{/if}
```

`Snippet<[ChildArgs]>` (with the single-element tuple) lets the
consumer destructure `ChildArgs` as one positional argument. Snippets
are Svelte 5's render-prop equivalent and map directly to Vue's
scoped slot and React's `children` render function.

## Rest-prop spread

The instance script destructures all named props and collects the
rest in `...restProps`. The rest object is spread onto the root
element:

```svelte
<fieldset class={`theme-select ${className}`.trim()} {...restProps}>
```

This lets consumers pass `id`, `data-*`, `aria-*`, and arbitrary
event handlers without the component blocking them. The catalog
never strips or transforms the rest object; it goes through verbatim.

The `Props` type closes off the known fields and declares an
unknown-keyed index signature so TypeScript accepts the spread:

```ts
export type Props = {
    label: string;
    /* … known fields … */
    [key: string]: unknown;
};
```

## No `<style>` blocks

Helpers are headless. No `<style>` block (scoped or global) is
allowed. The first attribute on the root element is the kebab-case
base class plus the consumer's optional `class` prop, and the
consumer's CSS targets that class hook.

This rule is enforced by code review, not by tooling — `pnpm test`
won't catch a stray `<style>` block.

## SSR

`$effect` only runs in the browser; the SSR render emits static
markup with whatever `value` the consumer supplied. No DOM access,
no `document.*`, no `window.*` outside `$effect`.

If you need a `document.head` mutation, do it in `$effect`, not at
the top level of the instance `<script>`.

## What never lives in the helper

- Bundled CSS, fonts, icons, or images.
- A locale-aware default for `label` / `placeholder` / `error`.
- Routing, data fetching, persistence wrappers, network calls.
- Animations or transitions.

Everything visual and locale-specific is the consumer's. See
[`shared/headless-principles.md`](./shared/headless-principles.md).

## Naming

- Class hooks are kebab-case derivatives of the file name:
  `theme-select`, `theme-select-option`, `theme-select-option-label`.
- Data attributes the consumer / CSS may want to observe use
  `data-*` (e.g. `data-theme`, `data-lily-theme-select`).
- Don't introduce new ARIA attributes — use the platform's.
- Module-level helper names are camelCase (`bcp47LocaleTag`,
  `normaliseThemesUrl`).
- Module-level constants are SCREAMING_SNAKE_CASE
  (`RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`).

## File extensions in imports

When the catalog imports a sibling `.svelte` file from a `.ts`
helper, the import uses the `.js` extension so the published package
resolves under Node ESM:

```ts
import { defaultLocaleLabels } from "./locales.js";
```

The `.svelte` files themselves import each other by their `.svelte`
extension:

```svelte
<script lang="ts" module>
    import {
        defaultLocaleLabels,
        RTL_LANGUAGE_TAGS,
    } from "./locales.js";
</script>
```

Vite + svelte-package rewrite the `.js` extension to the resolved
artifact at build time.
