# Examples — SearchPicker

Self-contained Blazor `.razor` examples for
`lily-design-system-blazor-search-picker`. Each file is a runnable
component that can be dropped into any Blazor 10 host (Blazor Web App,
Blazor Server, Blazor WebAssembly) with an **interactive** render mode.

The package ships no CSS: position the root (`position: relative`) and
the panel (`position: absolute`), or an open panel shoves the page
around.

| #   | File                                         | Demonstrates                                                                                 |
| --- | -------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 1   | [`Basic.razor`](./Basic.razor)               | The three required labels and an optional placeholder; a search for `foo` goes to `/?foo`.  |
| 2   | [`InAppRouting.razor`](./InAppRouting.razor) | `Action`, `Navigate`, `OnSearch`, and `@bind-Value`.                                          |

Every user-facing string is a parameter. `⏎` is the submit button's
visible symbol only; its accessible name is `SubmitLabel`.
