# AGENTS / testing — ThemePicker

Test specifics for the React `ThemePicker` helper. Read
[`../../AGENTS/testing.md`](../../AGENTS/testing.md) for the
catalog-wide stack; this file is the per-helper contract.

## Test file

[`../ThemePicker.test.tsx`](../ThemePicker.test.tsx) — one numbered
test per [`spec.md §7`](../spec.md#7-testing-acceptance-criteria)
acceptance criterion.

## Required reset between tests

The picker mutates `document.head` and `document.documentElement`.
Reset both, plus `localStorage`:

```ts
beforeEach(() => {
    document.head
        .querySelectorAll("link[data-lily-theme-picker]")
        .forEach((el) => el.remove());
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
});
```

## §7 acceptance map

| # | Assertion | Hook                                                              |
| - | --------- | ----------------------------------------------------------------- |
| 1 | `<fieldset>` with `role="radiogroup"` | `screen.getByRole("radiogroup").tagName === "FIELDSET"` |
| 2 | `aria-label` is the supplied `label`  | `getByRole("radiogroup").getAttribute("aria-label")`    |
| 3 | One radio per `themes[]`, sharing `name` | `getAllByRole("radio").length === themes.length`     |
| 4 | Each radio's `value` is the slug      | iterate, assert `.value`                                |
| 5 | Default label is `themeLabels[slug]` or title-cased | check span text content                  |
| 6 | Initial value resolves to "light" if in themes else `themes[0]` | `waitFor` `dataset.theme`        |
| 7 | Managed `<link>` exists with correct href | `head.querySelector('link[data-lily-theme-picker]').href` |
| 8 | Selecting a radio updates link / data-theme / fires onChange | `userEvent.click` + assertions    |
| 9 | `storageKey` persists across mounts   | first render writes; unmount; second render reads      |
| 10 | `value` prop wins over storage/default | preset localStorage; render with `value="dark"`; assert dark applied |
| 11 | `themesUrl` without trailing `/` still works | render with `themesUrl="/t"`; assert href has one slash |
| 12 | Extra attributes spread onto `<fieldset>` | render with `data-testid="x"`; query by data attribute |
| 13 | Custom `children` render prop receives `ChildArgs` | render with mock children; assert call args |

## Mounting

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemePicker } from "./ThemePicker";

const baseProps = {
    label: "Theme",
    themesUrl: "/t/",
    themes: ["light", "dark", "abyss"],
};

test("7.6 — initial value resolves to light", async () => {
    render(<ThemePicker {...baseProps} />);
    await waitFor(() => {
        expect(document.documentElement.dataset.theme).toBe("light");
    });
});
```

`waitFor` is required for any assertion that depends on the
first-mount effect.

## Asserting the managed link

```tsx
test("7.7 — managed <link> in head", async () => {
    render(<ThemePicker {...baseProps} />);
    await waitFor(() => {
        const link = document.head.querySelector<HTMLLinkElement>(
            'link[data-lily-theme-picker="theme"]'
        );
        expect(link?.href).toMatch(/\/t\/light\.css$/);
    });
});
```

The query selector matches on the `name` discriminator. When the
test uses a custom `name`, update the selector.

## Asserting user selection

```tsx
test("7.8 — selecting updates DOM", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ThemePicker {...baseProps} onChange={onChange} />);
    await waitFor(() => {
        expect(document.documentElement.dataset.theme).toBe("light");
    });

    await user.click(screen.getByRole("radio", { name: "Dark" }));

    await waitFor(() => {
        expect(document.documentElement.dataset.theme).toBe("dark");
        expect(onChange).toHaveBeenCalledWith("dark");
        expect(
            document.head
                .querySelector<HTMLLinkElement>('link[data-lily-theme-picker="theme"]')
                ?.href
        ).toMatch(/\/t\/dark\.css$/);
    });
});
```

`user.click` on the label triggers the change event on the inner
radio. `getByRole("radio", { name: "Dark" })` matches via the radio's
accessible name (the visible label text).

## Asserting persistence

```tsx
test("7.9 — storageKey persists", async () => {
    const user = userEvent.setup();
    const { unmount } = render(
        <ThemePicker {...baseProps} storageKey="lily-theme" />
    );
    await waitFor(() => {
        expect(document.documentElement.dataset.theme).toBe("light");
    });
    await user.click(screen.getByRole("radio", { name: "Dark" }));
    await waitFor(() => {
        expect(localStorage.getItem("lily-theme")).toBe("dark");
    });
    unmount();

    document.documentElement.removeAttribute("data-theme");

    render(<ThemePicker {...baseProps} storageKey="lily-theme" />);
    await waitFor(() => {
        expect(document.documentElement.dataset.theme).toBe("dark");
    });
});
```

## Asserting the controlled `value` short-circuit

```tsx
test("7.10 — value prop wins", async () => {
    localStorage.setItem("lily-theme", "dark");
    render(
        <ThemePicker
            {...baseProps}
            value="light"
            storageKey="lily-theme"
            defaultValue="abyss"
        />
    );
    await waitFor(() => {
        expect(document.documentElement.dataset.theme).toBe("light");
    });
});
```

## Asserting URL normalisation

```tsx
test("7.11 — themesUrl without trailing slash", async () => {
    render(<ThemePicker label="t" themesUrl="/themes" themes={["light"]} />);
    await waitFor(() => {
        const link = document.head.querySelector<HTMLLinkElement>(
            'link[data-lily-theme-picker="theme"]'
        );
        expect(link?.href).toMatch(/\/themes\/light\.css$/);
        // Crucially, no double slash:
        expect(link?.href).not.toMatch(/\/\/light/);
    });
});
```

## Asserting spread props

```tsx
test("7.12 — extra attributes spread onto fieldset", () => {
    render(<ThemePicker {...baseProps} data-testid="custom" id="my-id" />);
    const fs = screen.getByTestId("custom");
    expect(fs.id).toBe("my-id");
    expect(fs.tagName).toBe("FIELDSET");
});
```

## Asserting custom children

```tsx
test("7.13 — custom children receives ChildArgs", () => {
    const spy = vi.fn(() => <span>custom</span>);
    render(<ThemePicker {...baseProps}>{spy}</ThemePicker>);
    expect(spy).toHaveBeenCalled();
    const args = spy.mock.calls[0][0];
    expect(args.themes).toEqual(["light", "dark", "abyss"]);
    expect(args.name).toBe("theme");
    expect(typeof args.setTheme).toBe("function");
    expect(typeof args.labelFor).toBe("function");
    expect(args.labelFor("dark")).toBe("Dark");
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
            <ThemePicker {...baseProps} onChange={onChange} />
        </React.StrictMode>
    );
    await waitFor(() => {
        expect(document.documentElement.dataset.theme).toBe("light");
    });
    // The initial apply may fire onChange once; not twice.
    expect(onChange).toHaveBeenCalledTimes(1);
});
```

## What not to test

- React's render pipeline. Assume `useEffect` runs.
- CSS / styling.
- Theme CSS file fetching (the helper only sets the href; the
  browser does the fetch).
- Cross-tab sync.
