# Lily Design System™: pattern testers

Test that your component really behaves like a WAI-ARIA pattern. A tester drives a rendered element through a contract, by key press and
ARIA state, and throws an error naming the step that failed. The contracts are data, and Lily runs the same ones against its own eight
component catalogs. It works with any framework and needs no Lily component.

```sh
npm install --save-dev @lilydesignsystem/pattern-testers
```

```ts
import { runPattern } from "@lilydesignsystem/pattern-testers";

await runPattern("tabs", { root, hook: "my-tabs" });
```

`root` is the rendered element. `hook` is its name in error messages and, for `picker-listbox` and `picker-disclosure`, its base class.

| Contract            | Proves                                                            | You also pass |
| ------------------- | ----------------------------------------------------------------- | ------------- |
| `tabs`              | Arrows, Home and End move focus along a named `tablist`           |               |
| `menu`, `menubar`   | The same for a named vertical or horizontal menu                  |               |
| `tree`              | Moving between visible `treeitem`s, skipping collapsed ones       |               |
| `grid`              | Arrows, Home, End and the Ctrl corners, with exactly one tab stop |               |
| `combobox`          | The wiring, and that Escape acts only while the list is open      | `open`        |
| `dialog`            | A named modal `<dialog>`, focus in and back, Escape and `cancel`  | `open`        |
| `picker-listbox`    | An icon button opening a listbox                                  |               |
| `picker-disclosure` | An icon button opening a disclosure                               |               |

An empty `tablist`, `menu`, `menubar` or `tree` gets the contract's own fixture. For `grid`, render `gridFixture` from this package.

## Options

- `settle`: wait for your framework to update the DOM. Default: one macrotask.
- `act`: wrap a DOM event in your framework's batching, such as React's `act`.
- `press`, `click`: replace how a key or click is sent.
- `open`: open the widget, for `combobox` and `dialog`.

Under jsdom the `dialog` driver stubs `showModal` the way a browser behaves. The Tab trap and the inert page stay the browser's part.

## In a real browser

`pattern-browser.cjs` runs a contract inside a page, for WebdriverIO. It needs Node 26.

```js
const { runPattern } = require("@lilydesignsystem/pattern-testers/browser");

await runPattern(browser, "tabs", ".my-tabs", "my-tabs", "Sections");
```

The bUnit driver for Blazor, `shared/PatternTester.cs`, is not in this package.

---

Lily™ and Lily Design System™ are trademarks.
