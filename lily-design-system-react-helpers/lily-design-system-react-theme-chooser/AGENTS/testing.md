# AGENTS / testing — ThemeChooser

Test specifics for the React `ThemeChooser` helper. Read
[`../../AGENTS/testing.md`](../../AGENTS/testing.md) for the
catalog-wide stack; this file is the per-helper contract.

## Test file

[`../ThemeChooser.test.tsx`](../ThemeChooser.test.tsx) — one numbered
test per [`spec/index.md §7`](../spec/index.md#7-testing-acceptance-criteria)
acceptance criterion.

## Required reset between tests

The select mutates `document.head` and `document.documentElement`.
Reset both, plus `localStorage`:

```ts
beforeEach(() => {
    document.head
        .querySelectorAll("link[data-lily-theme-chooser]")
        .forEach((el) => el.remove());
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
});
```

## §7 acceptance map

| # | Assertion | Hook                                                              |
| - | --------- | ----------------------------------------------------------------- |
| 1 | Button + listbox wiring; `aria-hidden` glyph; root `<div>` class | `getByRole("button")` attrs; `.theme-chooser-icon`; `container.firstElementChild` |
| 2 | `aria-label` names the button **and** the listbox | `getByRole("button", { name })`; list `aria-label` |
| 3 | One `.theme-chooser-option` per `themes[]`; hidden input carries `name` + value | `querySelectorAll(".theme-chooser-option")`; `input[type=hidden]` |
| 4 | Listbox `hidden` until activated; exactly one `aria-selected="true"` | toggle `hidden` + `aria-expanded`; `[role=option][aria-selected=true]` |
| 5 | Label is `themeLabels[slug]` or title-cased; never "default" | `getByText`; `container.textContent` |
| 6 | Initial value resolves to "light" if in themes else `themes[0]` | flush; `dataset.theme`                  |
| 7 | Managed `<link>` exists with correct href; `name` discriminates it | `head.querySelector('link[data-lily-theme-chooser="…"]')` |
| 8 | Choosing an option updates link / data-theme / fires onChange | open + click option; assertions   |
| 9 | `storageKey` persists across mounts   | first render writes; unmount; second render reads      |
| 10 | `value` prop wins over storage/default | preset localStorage; render with `value="light"`; assert light applied |
| 11 | `themesUrl` without trailing `/` still works | render with `themesUrl="/t"`; assert href has one slash |
| 12 | Extra attributes spread onto the root `<div>` | render with `data-testid="x"`; assert `tagName === "DIV"` |
| 13 | Custom `children` replaces the glyph and receives `ChildArgs` | assert `.theme-chooser-icon` absent; read `value` / `open` / `labelFor` |
| 14 | Opening: `ArrowDown`/`Enter`/`Space` open; `ArrowUp` opens on the last option; focus moves to the list | `fireEvent.keyDown(button, …)` |
| 15 | Moving: Arrow keys clamp; `data-active` marks exactly one; `Home`/`End` jump | `fireEvent.keyDown(list, …)` + `aria-activedescendant` |
| 16 | Committing: `Enter`/`Space` select + close + refocus; `Escape` closes unchanged; `Tab` closes without refocus | `document.activeElement` + `dataset.theme` |
| 17 | Typeahead: prefix match, accumulation, 500 ms buffer reset | `fireEvent.keyDown(list, { key })`; `vi.useFakeTimers()` |
| 18 | Pointer: option click applies; outside click closes unchanged; button click toggles closed | `fireEvent.click` |

Test names are tagged with their clause (`§7.14`, `§7.15`, …) so the
map above stays checkable by grep.

## Mounting

```tsx
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeChooser } from "./ThemeChooser";

const baseProps = {
    label: "Theme",
    themesUrl: "/t/",
    themes: ["light", "dark", "abyss"],
};

/** Let the first-mount effect + its follow-up render settle. */
function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
}

test("§7.6 — initial value resolves to light", async () => {
    render(<ThemeChooser {...baseProps} />);
    await flush();
    expect(document.documentElement.dataset.theme).toBe("light");
});
```

`await flush()` is required for any assertion that depends on the
first-mount effect (`waitFor` also works; the suite uses `flush` for
brevity).

## Opening the listbox and picking an option

There is no native `<select>`, so `userEvent.selectOptions` does not
apply. Open the button, then click or key onto an option:

```tsx
function getList(): HTMLElement {
    return document.querySelector(".theme-chooser-list") as HTMLElement;
}

/** Open the listbox and click the option for `slug`. */
function pick(slug: string, themes: string[]): void {
    fireEvent.click(screen.getByRole("button"));
    const opts = document.querySelectorAll(".theme-chooser-option");
    fireEvent.click(opts[themes.indexOf(slug)]);
}
```

Keyboard equivalents drive `fireEvent.keyDown` against the button (to
open) and against the list element (to move and commit).

## Asserting the managed link

```tsx
test("§7.7 — managed <link> in head", async () => {
    render(<ThemeChooser {...baseProps} />);
    await flush();
    const link = document.head.querySelector<HTMLLinkElement>(
        'link[data-lily-theme-chooser="theme"]'
    );
    expect(link?.href).toMatch(/\/t\/light\.css$/);
});
```

The query selector matches on the `name` discriminator. When the
test uses a custom `name`, update the selector.

## Asserting user selection

```tsx
test("§7.8 — choosing an option updates the DOM", async () => {
    const onChange = vi.fn();
    render(<ThemeChooser {...baseProps} onChange={onChange} />);
    await flush();

    pick("dark", baseProps.themes);
    await flush();

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(onChange).toHaveBeenCalledWith("dark");
    expect(
        document.head
            .querySelector<HTMLLinkElement>('link[data-lily-theme-chooser="theme"]')
            ?.href
    ).toMatch(/\/t\/dark\.css$/);
});
```

Options are addressed by index into `themes` (their DOM order matches),
or by their visible label via `screen.getByText("Dark")`.

## Asserting the keyboard contract

```tsx
test("§7.16 — Enter selects, closes, and returns focus", async () => {
    render(<ThemeChooser {...baseProps} />);
    const button = screen.getByRole("button");
    const list = getList();

    fireEvent.keyDown(button, { key: "ArrowDown" }); // open on "light"
    fireEvent.keyDown(list, { key: "ArrowDown" });   // move to "dark"
    fireEvent.keyDown(list, { key: "Enter" });
    await flush();

    expect(list.hasAttribute("hidden")).toBe(true);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.activeElement).toBe(button);
});
```

The active option is asserted through `aria-activedescendant` on the
list (compare against `list.children[i].id`), not through
`document.activeElement` — the listbox holds focus, the options do not.

Typeahead timing (§7.17) needs `vi.useFakeTimers()` plus
`vi.advanceTimersByTime(600)` to cross the 500 ms buffer reset; restore
real timers in a `finally`.

## Asserting persistence

```tsx
test("§7.9 — storageKey persists", async () => {
    const { unmount } = render(
        <ThemeChooser {...baseProps} storageKey="lily-theme" />
    );
    await flush();
    pick("dark", baseProps.themes);
    await flush();
    expect(localStorage.getItem("lily-theme")).toBe("dark");
    unmount();

    document.documentElement.removeAttribute("data-theme");
    document.head
        .querySelectorAll("link[data-lily-theme-chooser]")
        .forEach((n) => n.remove());

    render(<ThemeChooser {...baseProps} storageKey="lily-theme" />);
    await flush();
    expect(document.documentElement.dataset.theme).toBe("dark");
});
```

## Asserting the controlled `value` short-circuit

```tsx
test("§7.10 — value prop wins", async () => {
    localStorage.setItem("lily-theme", "dark");
    render(
        <ThemeChooser
            {...baseProps}
            value="light"
            storageKey="lily-theme"
            defaultValue="abyss"
        />
    );
    await flush();
    expect(document.documentElement.dataset.theme).toBe("light");
});
```

## Asserting URL normalisation

```tsx
test("§7.11 — themesUrl without trailing slash", async () => {
    render(<ThemeChooser label="t" themesUrl="/themes" themes={["light"]} />);
    await flush();
    const link = document.head.querySelector<HTMLLinkElement>(
        'link[data-lily-theme-chooser="theme"]'
    );
    expect(link?.href).toMatch(/\/themes\/light\.css$/);
    // Crucially, no double slash:
    expect(link?.href).not.toMatch(/\/\/light/);
});
```

## Asserting spread props

```tsx
test("§7.12 — extra attributes spread onto the root div", () => {
    render(<ThemeChooser {...baseProps} data-testid="custom" id="my-id" />);
    const el = screen.getByTestId("custom");
    expect(el.id).toBe("my-id");
    expect(el.tagName).toBe("DIV");
    expect(el.className).toContain("theme-chooser");
});
```

## Asserting custom children

`children` replaces the glyph inside the button, so assert both that the
default `.theme-chooser-icon` is gone and that the args arrived:

```tsx
test("§7.13 — custom children replaces the glyph", async () => {
    render(
        <ThemeChooser {...baseProps} value="dark">
            {({ value, open, labelFor }) => (
                <span
                    data-testid="custom"
                    data-open={String(open)}
                    data-value={value}
                    data-label-light={labelFor("light")}
                />
            )}
        </ThemeChooser>
    );
    await flush();
    const custom = screen.getByTestId("custom");
    expect(custom.closest("button")?.className).toContain("theme-chooser-button");
    expect(document.querySelector(".theme-chooser-icon")).toBeNull();
    expect(custom.getAttribute("data-open")).toBe("false");
    expect(custom.getAttribute("data-value")).toBe("dark");
    expect(custom.getAttribute("data-label-light")).toBe("Light");
});
```

## Pure helper tests

```tsx
test("normalizeThemesUrl appends trailing slash", () => {
    expect(normalizeThemesUrl("/t")).toBe("/t/");
    expect(normalizeThemesUrl("/t/")).toBe("/t/");
});

test("themeHref composes the URL", () => {
    expect(themeHref("/t/", "dark", ".css")).toBe("/t/dark.css");
    expect(themeHref("/t", "dark", ".css")).toBe("/t/dark.css");
});
```

## StrictMode

Wrap the test render in `<React.StrictMode>` for one case to catch
double-mount bugs:

```tsx
test("StrictMode — no double-resolve", async () => {
    const onChange = vi.fn();
    render(
        <React.StrictMode>
            <ThemeChooser {...baseProps} onChange={onChange} />
        </React.StrictMode>
    );
    await flush();
    expect(document.documentElement.dataset.theme).toBe("light");
    // The initial apply may fire onChange once; not twice.
    expect(onChange).toHaveBeenCalledTimes(1);
});
```

## What not to test

- React's render pipeline. Assume `useEffect` runs.
- CSS / styling — including the listbox's open/close positioning, which
  the package deliberately does not ship.
- `scrollIntoView` on the active option; jsdom does not implement it,
  which is why the component calls it optionally.
- Theme CSS file fetching (the helper only sets the href; the
  browser does the fetch).
- Cross-tab sync.
