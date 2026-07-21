# Testing conventions for Lily React helpers

All helpers in this directory use the same vitest + jsdom +
`@testing-library/react` test stack. Per-helper `{Pascal}.test.tsx`
files contain one numbered test per acceptance criterion in
`spec/index.md §7`.

## Stack

| Layer                  | Tool                                             |
| ---------------------- | ------------------------------------------------ |
| Test runner            | `vitest`                                         |
| DOM                    | `jsdom` via `vitest --environment jsdom`         |
| React rendering        | `@testing-library/react`                         |
| User interaction       | `@testing-library/user-event`                    |
| Assertions             | vitest's `expect` + `@testing-library/jest-dom`  |
| Type-checking          | `tsc --noEmit` against `tsconfig.json`           |

## Configuring vitest

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        setupFiles: ["./test-setup.ts"],
    },
});
```

```ts
// test-setup.ts
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
    cleanup();
});
```

`cleanup()` is critical for the helpers because they write to
`document.head` (the managed `<link>` for ThemeChooser) and to
`document.documentElement` (the `lang`/`dir`/`data-theme`
attributes). Each test resets the document between cases.

## Per-test reset

Both helpers mutate global state (`document.head`,
`document.documentElement`, `localStorage`). Reset between tests:

```ts
beforeEach(() => {
    // Reset document.head — remove managed <link> from previous tests.
    document.head
        .querySelectorAll("link[data-lily-theme-chooser]")
        .forEach((el) => el.remove());

    // Reset document.documentElement.
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");

    // Reset localStorage.
    localStorage.clear();
});
```

## Asserting against the spec

Tests are numbered to match `spec/index.md §7`. The shape is:

```ts
describe("ThemeChooser — §7 acceptance", () => {
    test("7.1 — renders a select with the base class", () => {
        render(<ThemeChooser label="Theme" themesUrl="/t/" themes={["light", "dark"]} />);
        const select = screen.getByRole("combobox", { name: "Theme" });
        expect(select.tagName).toBe("SELECT");
    });

    test("7.6 — initial value resolves to light when present", async () => {
        render(<ThemeChooser label="Theme" themesUrl="/t/" themes={["light", "dark"]} />);
        await waitFor(() => {
            expect(document.documentElement.dataset.theme).toBe("light");
        });
    });
});
```

`waitFor` is required because the first-mount effect runs after the
render phase. The empty dep array means it runs once after mount;
the assertion has to wait for it.

## Driving user input

Use `@testing-library/user-event` to drive the select:

```ts
import userEvent from "@testing-library/user-event";

test("7.8 — choosing an option updates link and data-theme", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
        <ThemeChooser
            label="Theme"
            themesUrl="/t/"
            themes={["light", "dark"]}
            onChange={onChange}
        />
    );
    await waitFor(() => {
        expect(document.documentElement.dataset.theme).toBe("light");
    });

    await user.selectOptions(
        screen.getByRole("combobox", { name: "Theme" }),
        "dark"
    );

    await waitFor(() => {
        expect(document.documentElement.dataset.theme).toBe("dark");
        expect(onChange).toHaveBeenCalledWith("dark");
    });
});
```

Note: `userEvent.selectOptions` fires the native `change` event on
the `<select>`, which the component's `onChange` handler reads.
Passing `fireEvent.change(select, { target: { value: "dark" } })`
directly also works.

## Controlled vs uncontrolled

Test both modes:

```ts
test("controlled — value prop wins over storage", () => {
    localStorage.setItem("k", "dark");
    render(
        <ThemeChooser
            label="t" themesUrl="/t/" themes={["light", "dark"]}
            value="light" storageKey="k"
        />
    );
    // No waitFor: controlled value applies on first effect tick anyway.
});

test("uncontrolled — storage wins over default", () => {
    localStorage.setItem("k", "dark");
    render(
        <ThemeChooser
            label="t" themesUrl="/t/" themes={["light", "dark"]}
            storageKey="k"
        />
    );
    // Wait for resolution effect.
});
```

## Asserting DOM contract

The component writes to three places. Each assertion type:

```ts
// 1. data-theme on root.
expect(document.documentElement.dataset.theme).toBe("dark");

// 2. Managed <link> in head.
const link = document.head.querySelector<HTMLLinkElement>(
    'link[data-lily-theme-chooser="theme"]'
);
expect(link?.href).toContain("/t/dark.css");

// 3. Callback.
expect(onChange).toHaveBeenCalledWith("dark");
```

## Mocking navigator.languages

For `LocaleChooser.detectFromNavigator` tests:

```ts
beforeEach(() => {
    Object.defineProperty(navigator, "languages", {
        configurable: true,
        get: () => ["fr-CA", "en"],
    });
});

afterEach(() => {
    Object.defineProperty(navigator, "languages", {
        configurable: true,
        get: () => [], // restore
    });
});
```

## React 19 StrictMode

When the consumer wraps with `<React.StrictMode>`, every effect runs
twice. The component's `initialisedRef` guards against this:

```tsx
const initialisedRef = React.useRef(false);
React.useEffect(() => {
    if (initialisedRef.current) return;
    initialisedRef.current = true;
    // …
}, []);
```

Test under StrictMode to catch double-mount bugs:

```tsx
render(
    <React.StrictMode>
        <ThemeChooser {...props} />
    </React.StrictMode>
);
```

## Pure-helper tests

`bcp47LocaleTag`, `isRtlLocale`, `themeHref`, `normalizeThemesUrl`,
`matchNavigatorLanguage`, `localeName` are exported so consumers can
reuse them. They get their own test cases:

```ts
test("bcp47LocaleTag converts underscore to hyphen", () => {
    expect(bcp47LocaleTag("en_US")).toBe("en-US");
    expect(bcp47LocaleTag("zh_Hant_TW")).toBe("zh-Hant-TW");
});

test("isRtlLocale detects RTL languages", () => {
    expect(isRtlLocale("ar")).toBe(true);
    expect(isRtlLocale("he_IL")).toBe(true);
    expect(isRtlLocale("uz_Arab_AF")).toBe(true);
    expect(isRtlLocale("en")).toBe(false);
});
```

## Coverage target

Each helper's test file must contain at least one assertion per `spec/index.md
§7` numbered item. `bin/test` (the repo-wide verifier) checks for the
presence of `{Pascal}.test.tsx` in each helper directory but does not
enforce per-§ coverage. Reviewers do.

## What NOT to test

- Don't test React's own rendering pipeline. The component assumes
  `useState` works.
- Don't snapshot. The DOM is the contract; named assertions are
  clearer than blobs.
- Don't test CSS. The helpers ship none.
- Don't test consumer integration (Next.js, Remix). Those live in
  the consumer's repo.
- Don't test `Intl.DisplayNames`. It's a runtime fallback and
  optional.
