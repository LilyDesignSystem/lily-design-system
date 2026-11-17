# Lily Design System™ - Solid Headless: AI coding help

Read the root [AGENTS.md](../AGENTS.md) and [AGENTS/](AGENTS/) first; this file adds what is specific to Solid 2.0.

## Layout

- `components/{Name}.tsx` — one component per file, default export, `{Name}Props` interface.
- `components/{Name}.test.tsx` — Vitest + `@solidjs/testing-library`; `render(() => <Name … />)`.
- `components/*.ts` — the pure modules shared with the other catalogs (`listbox-machine.ts`, `widget-keys.ts`, …);
  they are copies of `shared/*.ts`, kept in step by `bin/sync-shared-modules`. Edit `shared/`, never these copies.
- `components/attr.ts` — the `attr()` helper described below.
- `bin/convert-react-to-solid.py` — the porting aid used for the port (a record, not a generator).
- `components/test-utils.ts`, `components/test-act.ts` — the testing library with a flushing `fireEvent`, and `act()`.

## Solid 2.0 rules for this catalog

- **Never destructure props.** `const p = merge({ class: "", disabled: false }, props)` for defaults, and
  `const restProps = omit(p, "class", …)` for the rest-props spread. Read `p.name` inside JSX or an accessor.
- **Derived values are accessors.** `const ariaLive = () => p.live ?? "polite"`, used as `ariaLive()`.
- **`class`, not `className`.** The root is ``class={`slug ${p.class}`}``, base class first.
- **ARIA and data booleans go through `attr()`.** Solid renders a boolean attribute value as presence (`false`
  removes it, `true` renders `""`); ARIA needs the strings. `aria-pressed={attr(p.pressed)}` gives `"false"`, and
  `undefined` still omits the attribute. Plain string attributes (`aria-label`, `aria-controls`) need no wrapper.
- **Text inputs listen to `onInput`.** React's `onChange` fires per keystroke, Solid's is the native `change` event.
  The public prop stays `onChange`; checkboxes, radios, selects and files keep the native `onChange`.
- **Use `e.currentTarget`, not `e.target`,** for the element a handler is attached to.
- **Dynamic tags use `dynamic()`** from `@solidjs/web`: `const Tag = dynamic(() => p.as ?? "div")`.
- **Effects are split:** `createEffect(() => source, (value) => { …; return cleanup })`. A mount-time read of a ref
  goes in the effect's apply function or `onSettled`. `onMount`, `createResource`, `createComputed`, `on` and `batch`
  do not exist in Solid 2.
- **Local state:** `createSignal(() => p.open)` is a writable signal that follows the prop (Solid 2's derived signal),
  the equivalent of the other catalogs' "internal state reset when the prop changes".
- **IDs:** `createUniqueId()` from `solid-js` (SSR-safe), where React uses `useId`.
- **No "latest ref".** A value React reassigns in the body each render is a getter here: the body runs once.
- **Styles:** a `style` object takes CSS property names (`"aspect-ratio"`), not camelCase.
- **Tests:** hold a changing prop in a signal and call `flush()` from `solid-js` after setting it; there is no
  `rerender`. Testing Library cleans up between tests because Vitest `globals` is on.

## Headless rules

Every rule in [AGENTS/headless.md](AGENTS/headless.md), [AGENTS/accessibility.md](AGENTS/accessibility.md) and
[AGENTS/internationalization.md](AGENTS/internationalization.md) applies unchanged: no CSS, no English defaults,
semantic element first, ARIA only where needed, the keyboard contract in each component's `components/{slug}/AGENTS.md`.

## Verify

```bash
pnpm test && pnpm check
```

---

Lily™ and Lily Design System™ are trademarks.
