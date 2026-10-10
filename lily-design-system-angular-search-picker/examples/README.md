# Examples — SearchPicker

Self-contained Angular 20 examples for
`@lilydesignsystem/angular-search-picker`. Each file is a runnable
standalone component that can be dropped into any Angular 20 host
(Analog page, Angular CLI route, Storybook story).

| #   | File                                         | Demonstrates                                                                                  |
| --- | -------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | [`basic.component.ts`](./basic.component.ts) | The three required labels, an optional placeholder, and the `searched` output; `foo` → `/?foo`. |

Every user-facing string is an input. `⏎` is the submit button's
visible symbol only; its accessible name is `submitLabel`.

The control is headless: consumers style the `search-picker` (root),
`search-picker-button`, `search-picker-icon`, `search-picker-panel`,
`search-picker-form`, `search-picker-input`, `search-picker-submit`, and
`search-picker-submit-symbol` hooks.

## See also

- [`../docs/accessibility.md`](../docs/accessibility.md) — what the
  control does well, and what it costs.
- [`../spec/index.md`](../spec/index.md) — the canonical contract.

---

Lily™ and Lily Design System™ are trademarks.
