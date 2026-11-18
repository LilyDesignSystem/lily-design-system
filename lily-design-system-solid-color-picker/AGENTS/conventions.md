# Solid 2.0 conventions for Lily helpers

Every Solid helper package follows these conventions. They are the helper-package side of the Solid headless
catalog's rules (`lily-design-system-solid-headless/AGENTS.md`); the contract each helper implements is its own
`spec/index.md`, ported from the Svelte reference.

## Component shape

```tsx
import { IconButton } from "@lilydesignsystem/solid-headless";
import type { JSX } from "@solidjs/web";
import { createSignal, createUniqueId, omit, untrack } from "solid-js";

export type Props = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "onChange"> & {
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  class?: string;
};

export function MyPicker(props: Props): JSX.Element {
  const rest = omit(props, "class", "label", "value", "defaultValue", "onChange");
  const id = `my-picker-${createUniqueId()}`;
  const [inner, setInner] = createSignal(untrack(() => props.defaultValue ?? ""));
  const value = () => (props.value !== undefined ? props.value : inner());
  return (
    <div
      class={`my-picker ${props.class ?? ""}`.trim()}
      {...rest}
    >
      …
    </div>
  );
}

export default MyPicker;
```

- **Never destructure props**: read `props.x` (or a `withDefaults`/`merge` view) inside JSX, an accessor or a
  handler, so each prop stays reactive. A default is written `props.x ?? fallback` at the read, which also applies
  when a prop is `undefined`.
- **`class`**, not `className`, base class first, the consumer's appended.
- **Controlled and uncontrolled**: `value` wins when given; otherwise a signal seeded from `defaultValue`. Changes are
  reported through `onChange` once per real change.
- **ARIA booleans are strings**: `aria-expanded={open() ? "true" : "false"}`. Solid renders a boolean attribute value
  as presence, so `false` would remove the attribute.
- **Text fields listen to `onInput`**; checkboxes, radios and selects to `onChange`.
- **Refs** are variables set by a callback, `ref={(el) => (button = el)}`; a ref is an ordinary prop, so a headless
  component's ref reaches its root element.
- **Ids** come from `createUniqueId()`, SSR-safe and stable; never an accessor that calls it.
- **No React habits**: no "latest ref" reassigned in the body (it runs once), no `key`, no `forwardRef`.

## Effects

- `createEffect(source, apply)`: `source` reads what the effect depends on, `apply` acts and may return a cleanup.
  This is React's `useEffect(fn, deps)`, with the dependencies read reactively instead of listed.
- `onSettled(fn)`: once, after the component's first render has settled; React's `useEffect(fn, [])`. Return a
  cleanup for listeners on `document` or `window`.
- Read props and state inside `untrack` where an effect must not re-run on them.
- Writing a signal inside an effect's `apply` is legitimate but rare; prefer a plain variable for one-shot state such
  as "focus the first option after opening".

## Forms

Solid writes a bound `value` or `checked` as the DOM property, never the attribute, so a form reset (which puts
every field back to its attribute default) empties the field, and a field whose value did not change is never written
again. Give every visible bound field a default that follows it: `defaultValue={…}` on an input or textarea,
`defaultChecked={…}` on a checkbox or radio, `defaultSelected={…}` (or `selected`) on each option. Where that is
awkward (a recursive builder such as `filter`), rebuild the controls after the reset. Test a reset with no edits as
well as one after an edit: the first is the case that breaks.

## Dependencies

A helper depends on `@lilydesignsystem/solid-headless` (and, for `picker-bar`, the sibling pickers) as regular npm
`dependencies`. `solid-js` and `@solidjs/web` are peer dependencies. `vite.config.ts` aliases the sibling packages to
their source for local tests; `build.mjs` keeps the bare imports.

## Build

`build.mjs` writes `dist/source` (the JSX kept, with types) for the `solid` export condition and `dist/index.js`
(compiled for the browser) for every other bundler. Every `@lilydesignsystem/*` import stays external.
