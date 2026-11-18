# Testing conventions for Lily Solid helpers

Each helper's `{Pascal}.test.tsx` holds one numbered test per acceptance clause in its `spec/index.md` §7, ported from
the React helper's tests so every catalog meets the same assertions.

## Stack

| Layer            | Tool                                                        |
| ---------------- | ----------------------------------------------------------- |
| Test runner      | `vitest`, with `globals: true`                              |
| DOM              | `jsdom`                                                     |
| Solid rendering  | `@solidjs/testing-library` (1.0 release candidate, Solid 2) |
| Compiler         | `@solidjs/vite-plugin`                                      |
| User interaction | `@testing-library/user-event`                               |
| Type-checking    | `tsc --noEmit`                                              |

`vitest-setup.ts` cleans up after each test and provides an in-memory `localStorage` where jsdom has none.

## Solid's batching

Solid 2 batches updates until `flush()`. React's `fireEvent` runs inside `act`, so a test that asserts straight after
an event expects the DOM already updated. Import `fireEvent` from `./test-utils` (it flushes after each dispatch) and
`act` from `./test-act` (it runs a step, then flushes). `userEvent` is async and needs neither.

## Changing props

There is no `rerender`. Hold a changing prop in a signal and set it, then `flush()`, so the instance stays mounted, as
React's rerender keeps it:

```tsx
const [open, setOpen] = createSignal(true);
render(() => (
  <MenuPicker
    label="Menu"
    open={open()}
  >
    x
  </MenuPicker>
));
setOpen(false);
flush();
expect(panel().hidden).toBe(true);
```

## Rules learned in the port

- **Render with a function**: `render(() => <Picker … />)`.
- **JSX shared between tests is a factory** (`const options = () => (<>…</>)`): Solid JSX is real DOM nodes, so a
  constant would carry one test's state into the next.
- **Focus leaving a container is `focusout`**: React's `onBlur` listens to it, and the port listens to it directly, so
  a test fires `fireEvent.focusOut`, not `blur` (which does not bubble).
- **Text fields hear `input`**: `fireEvent.input(field, { target: { value } })`.

## What not to test

Solid's own rendering, CSS (the helpers ship none), snapshots, or a consumer's framework integration.
