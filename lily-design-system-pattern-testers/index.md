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

**A pass means these steps passed, not that the component conforms to WAI-ARIA.** Each contract says what it covers and what it
leaves out. Keep testing with a screen reader and real users.

| Contract            | Covers                                                               | Leaves out                                 | You also pass |
| ------------------- | -------------------------------------------------------------------- | ------------------------------------------ | ------------- |
| `tabs`              | Arrows, Home and End move focus along a named `tablist`              | Selecting a tab, and its panel             |               |
| `menu`, `menubar`   | The same for a named menu, with type-ahead and, in `menu`, activation | Menu item checkboxes and radios           |               |
| `menu-submenu`, `menubar-submenu` | Opening, moving in and closing a submenu, and moving along the bar from one | Hover, pointer                |               |
| `tree`              | Moving between visible `treeitem`s, type-ahead, Enter and Space activating | Which item is selected, which is yours |               |
| `tree-expand`       | ArrowRight and ArrowLeft on a branch                                 | Right-to-left, which swaps them            |               |
| `grid`              | Arrows, Home, End, the Ctrl corners, page keys, exactly one tab stop |                                            |               |
| `grid-actions`      | Sorting, opening, cancelling and committing an editor, selecting a row, by key | Saving an edit, which is yours  | `noEditing`, for a grid with no editor |
| `autosuggest`       | A list-autocomplete combobox: arrows, Alt+Arrow, Home, End, Enter, Escape | Filtering, which is yours                  |               |
| `combobox`          | List autocomplete on your options: arrows, Alt+Arrow, Home, End, Enter, Escape, typing, a click | Filtering, which is yours | `open` |
| `command`           | A search input over a listbox: arrows, Home, End, Enter, Escape, typing | Filtering, and what an option does     |               |
| `toolbar`, `action-group` | One tab stop, arrows, Home and End along a named toolbar or group | Vertical and right-to-left            |               |
| `radio-group`       | One tab stop, and the arrows moving and checking                     | Vertical and right-to-left                 |               |
| `splitter`          | The arrows for the orientation, Shift, Home, End, Enter collapsing   | Dragging; applying the value to the panes  |               |
| `tree-popup`        | A trigger opening a tree: its arrows, type-ahead, choosing, Escape   | `exclusive` and `multiple`                 |               |
| `mentions`          | A trigger character, the arrows, writing a mention, Escape           | Filtering, which is yours                  |               |
| `cropper`           | Moving and resizing a crop rectangle by key, inside the image        | Dragging, and the overlay                  |               |
| `dialog`            | A named modal `<dialog>`, focus in and back, Escape and `cancel`     | The Tab trap and inert page: the browser's | `open`        |
| `picker-listbox`    | Lily's icon button opening a listbox                                 | Lily's own shape, not a general pattern    |               |
| `picker-disclosure` | Lily's icon button opening a disclosure                              | Lily's own shape, not a general pattern    |               |

Both `combobox` and `autosuggest` test a combobox; `autosuggest` is for one that takes its suggestions as data, so render `autosuggestFixture`. Leave a `combobox` list empty, and it gets the contract's three options. For `tree-expand`, `root` is the
branch `treeitem`, inside a parent `treeitem`.

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
