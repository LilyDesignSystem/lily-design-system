# Examples — SearchPicker

| File | Shows |
| ---- | ----- |
| [basic.tsx](./basic.tsx) | The three required labels and an optional placeholder; a search for `foo` goes to `/?foo`. |
| [client-side-routing.tsx](./client-side-routing.tsx) | A custom `navigate`, `action`, and `onSearch`, with the text controlled via `value` + `onChange`. |

Every user-facing string is a prop. `⏎` is the submit button's visible
symbol only; its accessible name is `submitLabel`.
