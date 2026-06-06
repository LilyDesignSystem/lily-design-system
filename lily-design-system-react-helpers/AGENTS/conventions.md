# React 19 conventions for Lily helpers

All helpers in this directory follow the same React 19 conventions.
This file is the canonical reference; per-helper `AGENTS.md` files
extend or override specific items.

## Component shape

```tsx
"use client";

import * as React from "react";

export type ChildArgs = { /* picker-specific contract */ };

export type Props = Omit<
    React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
    "onChange" | "children"
> & {
    label: string;
    /* picker-specific props */
    value?: string;
    defaultValue?: string;
    onChange?: (next: string) => void;
    children?: (args: ChildArgs) => React.ReactNode;
    className?: string;
};

export function MyPicker({
    label,
    value,
    defaultValue,
    onChange,
    children,
    className = "",
    ...restProps
}: Props): React.ReactElement {
    // hooks, helpers, effects...
    return (
        <fieldset
            className={`my-picker ${className}`.trim()}
            role="radiogroup"
            aria-label={label}
            {...restProps}
        >
            {/* children or default radio markup */}
        </fieldset>
    );
}

export default MyPicker;
```

## "use client" directive

Every `.tsx` helper file that touches the DOM (every helper, in
practice) starts with the `"use client"` directive so it runs as a
client component under the Next.js App Router and other React Server
Component frameworks.

Pure helper modules (e.g. `bcp47LocaleTag` in `LocalePicker.tsx` or
`themeHref` in `ThemePicker.tsx`) live in the same `.tsx` file
because they are exported alongside the component. They are still
safe to import from a server component because importing them does
not pull in the rest of the file's runtime — the React 19 bundler
sees the directive and treats the whole module as a client boundary,
but the *pure helpers* can be re-exported from a server module
without issue.

If a future helper splits into a separate `.ts` data file (e.g.
`locales.ts`), that file does **not** carry `"use client"` — it has
no DOM dependency, runs on both server and client, and is the
recommended pattern for sharing pure data.

## Controlled vs uncontrolled

Each helper supports both:

- **Controlled.** Consumer passes `value` + `onChange`. The component
  treats `value` as the source of truth and never writes internal
  state to it.
- **Uncontrolled.** Consumer omits `value`. The component manages
  internal state via `useState` and resolves the initial value from
  `defaultValue`, `localStorage`, navigator, or a hardcoded fallback.

The pattern is:

```tsx
const isControlled = value !== undefined;
const [internalValue, setInternalValue] = React.useState<string>(
    isControlled ? value : "",
);
const currentValue = isControlled ? value : internalValue;
```

`currentValue` is the single value the render uses. When the consumer
toggles between controlled and uncontrolled mid-lifecycle (which they
should not), the component does NOT warn — React's "switched from
uncontrolled to controlled" warning fires anyway when the consumer
passes `value` after passing `undefined`, which is the standard
behaviour.

## Render-prop children

Every helper accepts `children` as a function of `ChildArgs`. The
default render is used when `children` is omitted; otherwise the
helper delegates the markup to the consumer's function and provides
the state machine.

```tsx
{children
    ? children({ /* ChildArgs */ })
    : /* default radio markup */ }
```

`ChildArgs` always carries at minimum:

- The list of items (`themes`, `locales`, …).
- The current value.
- A `setX` imperative setter that triggers the apply lifecycle.
- The shared `name` attribute.
- A `labelFor(item)` resolver.

Picker-specific helpers (e.g. `tagFor`, `isRtl` for LocalePicker)
are added as needed.

## Effects

Two effect patterns are used:

### 1. First-mount resolution

```tsx
const initialisedRef = React.useRef(false);
React.useEffect(() => {
    if (initialisedRef.current) return;
    initialisedRef.current = true;
    const initial = resolveInitial(/* ... */);
    if (!initial) return;
    if (isControlled) applyToDom(initial);
    else if (initial !== internalValue) setInternalValue(initial);
    else applyToDom(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

The `initialisedRef` guards against React 19's StrictMode double-mount.
The empty dep array is intentional — the resolution only runs once
per component instance.

### 2. Value-change re-apply

```tsx
React.useEffect(() => {
    if (!initialisedRef.current) return;
    if (!currentValue) return;
    applyToDom(currentValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentValue]);
```

This runs after every `currentValue` change. The `initialisedRef`
gate prevents the first-mount effect from racing with this one.
`currentValue` is the only dependency: other props (`themesUrl`,
`target`, etc.) are not — they take effect on the next change, not
retroactively.

## Rest-prop spread

The root `<fieldset>` always carries:

1. `className="{kebab-base} {consumerClass}"`.
2. `role="radiogroup"`.
3. `aria-label={label}`.
4. Whatever else the consumer spreads via `...restProps`.

`restProps` is typed as `Omit<FieldsetHTMLAttributes, "onChange" |
"children">` because the helper takes those two slots for its own
contract.

## TypeScript

- Strict mode on.
- Public surface fully typed via `export type Props` and `export
  type ChildArgs`.
- No `any` in exported types.
- Pure helper functions exported alongside the component (`themeHref`,
  `bcp47LocaleTag`, etc.).
- Default export and named export for the component itself, so
  consumers can pick either style.

## Imports

- `import * as React from "react"` (namespace import). This works
  whether `esModuleInterop` is on or off, and is the form most
  React 19 codebases use.
- No JSX runtime imports — the bundler injects `react/jsx-runtime`.
- No third-party utility imports. Helpers depend only on `react`.

## Re-exports

`index.ts` mirrors the Svelte helpers' barrel pattern:

```ts
export { MyPicker, /* pure helpers */ } from "./MyPicker.js";
export type { Props, ChildArgs } from "./MyPicker.js";
export { default } from "./MyPicker.js";
```

The `.js` extension is the canonical ESM resolution form; bundlers
that don't require it tolerate the form, and bundlers that do
require it (Node ESM) need it.

## File layout

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec.md`                  | Specification-driven contract (canonical).       |
| `{Pascal}.tsx`             | Implementation. TypeScript + React 19 hooks.     |
| `{Pascal}.test.tsx`        | Vitest spec, one assertion per §7 acceptance.    |
| `index.ts`                 | Barrel re-export.                                |
| `index.md`                 | User guide.                                      |
| `CHANGELOG.md`             | Per-version history.                             |
| `AGENTS.md`                | AI-agent metadata pointer.                       |
| `AGENTS/`                  | Per-topic AI-agent guides.                       |
| `CLAUDE.md`                | Loads `AGENTS.md`.                               |
| `docs/`                    | Topic guides for humans.                         |
| `examples/`                | Runnable React 19 examples.                      |

Optional `locales.ts` / `locales.tsv` / similar data files live in
the helper directory when needed.
