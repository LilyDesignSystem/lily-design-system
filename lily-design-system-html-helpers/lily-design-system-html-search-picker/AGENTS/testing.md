# Testing — `<search-picker>` (HTML helper)

The suite lives in [`../search-picker.test.ts`](../search-picker.test.ts)
and asserts every numbered clause in
[`../spec/index.md` §7](../spec/index.md#7-testing-acceptance-criteria).
Test names are prefixed with the clause number. Catalog-wide rules:
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

32 cases as of 0.1.0.

## Harness notes

- `mount()` sets the three required labels, appends to `document.body`.
- `navigate` is replaced with a `vi.fn()` spy so no test navigates;
  §7.14 stubs the global `location` to prove the default.
- Return in the field is simulated by dispatching a cancelable `submit`
  on the form (jsdom has no implicit submission from Enter); the return
  value of `dispatchEvent` proves the native submission was cancelled.
- §7.9 uses `submit().click()`, which jsdom does turn into a form
  submission.
