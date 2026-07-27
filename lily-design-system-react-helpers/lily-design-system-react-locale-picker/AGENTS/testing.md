# AGENTS / testing — LocaleChooser

Test specifics for the React `LocaleChooser` helper. Read
[`../../AGENTS.md`](../../AGENTS.md) for the catalog-wide React stack;
this file is the per-helper contract.

## Stack

- **Runner.** vitest in `jsdom` environment.
- **Renderer.** `@testing-library/react`.
- **User events.** `fireEvent`. The reference suite uses it throughout:
  the control's own keyboard handlers are what is under test, so the
  extra realism `@testing-library/user-event` adds (pointer sequences,
  focus simulation) buys little and makes the `keyDown`-on-the-`<ul>`
  assertions harder to express.

## Test file

[`../LocaleChooser.test.tsx`](../LocaleChooser.test.tsx) — one numbered
test per [`spec/index.md §7`](../spec/index.md#7-testing-acceptance-criteria)
acceptance criterion.

## Required reset between tests

The select mutates `document.documentElement.lang` and `.dir`. Reset
those, plus `localStorage`:

```ts
function resetRoot(): void {
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
}

beforeEach(() => {
    resetRoot();
    try {
        localStorage.clear();
    } catch { /* ignore */ }
});

afterEach(() => {
    cleanup();
    resetRoot();
});
```

`cleanup()` is from `@testing-library/react` and unmounts any rendered
trees.

## §7 acceptance map

The spec's §7 has both component-contract tests and pure-helper tests.
Map each §7 clause to one or more vitest test ids:

| §7 # | Topic                          | Hook                                                          |
| ---- | ------------------------------ | ------------------------------------------------------------- |
| 7.1  | Button + listbox + root div    | `screen.getByRole("button")` attrs; `.locale-chooser-icon`; root `tagName === "DIV"` |
| 7.2  | `aria-label` names both        | `getByRole("button", { name })`; list `aria-label`            |
| 7.3  | One option per locale, hidden input `name` | `document.querySelectorAll(".locale-chooser-option")`; `input[type="hidden"]` |
| 7.4  | `hidden` until activated; one `aria-selected` | click the button; assert `hidden` / `aria-expanded` |
| 7.5  | Each option `lang`; none on button or list | iterate options, assert `.getAttribute("lang")` |
| 7.6  | Labels from `localeLabels` / `defaultLocaleLabels` | `screen.getByText(...)`               |
| 7.7  | `bcp47LocaleTag("en_US")`      | pure                                                          |
| 7.8  | `bcp47LocaleTag("zh_Hant_TW")` | pure                                                          |
| 7.9  | `bcp47LocaleTag("en")`         | pure                                                          |
| 7.10 | `isRtlLocale` RTL cases        | pure (ar, he_IL, uz_Arab_AF)                                  |
| 7.11 | `isRtlLocale` LTR cases        | pure (en, fr_CA)                                              |
| 7.12 | `localeName("en_US")`          | pure (from `locales.tsv`)                                     |
| 7.13 | Initial `lang` is BCP 47 form  | `flush()`, assert `documentElement.lang`                      |
| 7.14 | `dir` is rtl / ltr             | RTL and LTR `defaultValue`, assert `documentElement.dir`      |
| 7.15 | `applyDir={false}` omits dir   | RTL value, assert `!documentElement.hasAttribute("dir")`      |
| 7.16 | Selection updates lang/dir, fires `onChange` (consumer form) | `pick(code)`, `vi.fn()` spy |
| 7.17 | Custom `target`                | render with `target`; assert `target.lang`, root untouched    |
| 7.18 | Storage key persists           | first render writes; unmount; second render reads             |
| 7.19 | `value` prop wins              | preset storage; render with `value`; assert applied           |
| 7.20 | Navigator exact match          | stub `navigator.languages`; assert resolved locale            |
| 7.21 | Navigator language-only match  | stub `["fr-CA"]` against `["en","fr"]`                        |
| 7.22 | Extra attrs spread onto the root div | render with `data-testid`; assert `tagName === "DIV"`   |
| 7.23 | `children` replaces the glyph  | assert no `.locale-chooser-icon`; assert `value` / `open` / `labelFor` |
| 7.24 | Opening keys and focus transfer | `fireEvent.keyDown(button, { key })`; assert `document.activeElement` |
| 7.25 | Active-descendant movement, clamping, Home / End, `data-active` | `fireEvent.keyDown(list, …)`; assert `aria-activedescendant` |
| 7.26 | Select / cancel / Tab, and focus return | `Enter`, `Space`, `Escape`, `Tab` on the list         |
| 7.27 | Typeahead and pointer          | printable keys, buffer reset via fake timers, option click, outside click |

## Mounting

```tsx
import { render, screen, waitFor, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import LocaleChooser, {
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
} from "./LocaleChooser";

const LOCALES = ["en", "en_US", "fr", "fr_CA", "ar"];

test("§7.13 — initial value applies lang+dir to document root", async () => {
    render(<LocaleChooser label="Language" locales={LOCALES} defaultValue="ar" />);
    await waitFor(() => {
        expect(document.documentElement.lang).toBe("ar");
        expect(document.documentElement.dir).toBe("rtl");
    });
});
```

`waitFor` is required for any assertion that depends on the first-mount
effect.

## Three helpers the suite leans on

The listbox has no accessible-name query shortcut while it is `hidden`,
selecting a locale is now two interactions rather than one, and focus
moves in an effect after the commit. The suite defines all three as
small helpers:

```tsx
/** Yield one macrotask so post-commit effects have run. */
function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
}

function getList(): HTMLElement {
    return document.querySelector(".locale-chooser-list") as HTMLElement;
}

/** Open the listbox and click the option for `code`. */
function pick(code: string, locales: string[] = LOCALES): void {
    fireEvent.click(screen.getByRole("button"));
    const opts = document.querySelectorAll(".locale-chooser-option");
    fireEvent.click(opts[locales.indexOf(code)]);
}
```

`pick()` replaces the old `user.selectOptions(...)` call everywhere a
test needs to change the locale.

## Asserting the language attribute round-trip

```tsx
test("§7.13 — en_US is written as en-US (BCP 47 hyphen)", async () => {
    render(<LocaleChooser label="Language" locales={LOCALES} defaultValue="en_US" />);
    await waitFor(() => {
        expect(document.documentElement.lang).toBe("en-US");
    });
});
```

The underscore form on input becomes the hyphen form on the `lang`
attribute. The `value` mirrors the consumer form back.

## Asserting user selection

```tsx
test("§7.16 — selecting an option fires onChange and updates lang/dir", async () => {
    const onChange = vi.fn();
    render(
        <LocaleChooser
            label="Language"
            locales={LOCALES}
            defaultValue="en"
            onChange={onChange}
        />
    );
    await waitFor(() => {
        expect(document.documentElement.lang).toBe("en");
    });

    pick("ar");

    await waitFor(() => {
        expect(document.documentElement.lang).toBe("ar");
        expect(document.documentElement.dir).toBe("rtl");
        expect(onChange).toHaveBeenCalledWith("ar");
    });
});
```

`getByRole("button")` matches the trigger via its `aria-label`. The
options are queried by class, not by `getAllByRole("option")`, because
the listbox is `hidden` until the button is clicked and hidden subtrees
are excluded from the accessibility tree.

## Asserting the keyboard contract

The keyboard suite drives `fireEvent.keyDown` on the button to open and
on the `<ul>` to navigate, then asserts `aria-activedescendant` against
the list's children ids:

```tsx
function openWith(key: string) {
    render(<LocaleChooser label="Language" locales={LOCALES} />);
    const button = screen.getByRole("button");
    fireEvent.keyDown(button, { key });
    return { button, list: getList() };
}

test("§7.25 — ArrowDown / ArrowUp move the active descendant and clamp", () => {
    const { list } = openWith("ArrowDown");
    fireEvent.keyDown(list, { key: "ArrowDown" });
    expect(list.getAttribute("aria-activedescendant")).toBe(list.children[1].id);
    fireEvent.keyDown(list, { key: "ArrowUp" });
    fireEvent.keyDown(list, { key: "ArrowUp" }); // clamps, does not wrap
    expect(list.getAttribute("aria-activedescendant")).toBe(list.children[0].id);
});

test("§7.26 — Enter selects, closes, and returns focus to the button", async () => {
    const { button, list } = openWith("ArrowDown");
    fireEvent.keyDown(list, { key: "ArrowDown" });
    fireEvent.keyDown(list, { key: "Enter" });
    await flush();
    expect(list.hasAttribute("hidden")).toBe(true);
    expect(document.activeElement).toBe(button);
});
```

Focus assertions need `await flush()` because focus moves in an effect
after the commit, not synchronously with the key event.

Typeahead's buffer reset is the one place fake timers are required:

```tsx
test("§7.27 — the typeahead buffer resets after the idle window", () => {
    vi.useFakeTimers();
    try {
        render(<LocaleChooser label="Language" locales={LOCALES} />);
        const list = getList();
        fireEvent.keyDown(screen.getByRole("button"), { key: "ArrowDown" });
        fireEvent.keyDown(list, { key: "a" });
        vi.advanceTimersByTime(600);
        fireEvent.keyDown(list, { key: "f" });
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[2].id);
    } finally {
        vi.useRealTimers();
    }
});
```

Always restore real timers in a `finally`, or later tests inherit the
fake clock.

## Asserting persistence

```tsx
test("§7.18 — storageKey survives unmount/remount", async () => {
    const { unmount } = render(
        <LocaleChooser
            label="Language"
            locales={LOCALES}
            storageKey="lily-locale"
            defaultValue="en"
        />,
    );
    await waitFor(() => {
        expect(document.documentElement.lang).toBe("en");
    });
    pick("fr");
    await waitFor(() => {
        expect(localStorage.getItem("lily-locale")).toBe("fr");
    });
    unmount();

    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");

    render(
        <LocaleChooser
            label="Language"
            locales={LOCALES}
            storageKey="lily-locale"
        />,
    );
    await waitFor(() => {
        expect(document.documentElement.lang).toBe("fr");
    });
});
```

## Asserting the controlled `value` short-circuit

```tsx
test("§7.19 — value prop wins over storage and defaultValue", async () => {
    localStorage.setItem("lily-locale", "ar");
    render(
        <LocaleChooser
            label="Language"
            locales={LOCALES}
            value="fr"
            storageKey="lily-locale"
            defaultValue="en_US"
        />,
    );
    await waitFor(() => {
        expect(document.documentElement.lang).toBe("fr");
    });
});
```

## Asserting `applyDir={false}`

```tsx
test("§7.15 — applyDir={false} skips dir attribute", async () => {
    render(
        <LocaleChooser
            label="Language"
            locales={LOCALES}
            defaultValue="ar"
            applyDir={false}
        />,
    );
    await waitFor(() => {
        expect(document.documentElement.lang).toBe("ar");
    });
    expect(document.documentElement.dir).toBe("");
});
```

## Asserting custom `target`

```tsx
test("§7.17 — custom target receives lang/dir, root is untouched", async () => {
    const target = document.createElement("section");
    document.body.appendChild(target);

    render(
        <LocaleChooser
            label="Language"
            locales={LOCALES}
            defaultValue="ar"
            target={target}
        />,
    );

    await waitFor(() => {
        expect(target.getAttribute("lang")).toBe("ar");
        expect(target.getAttribute("dir")).toBe("rtl");
    });
    expect(document.documentElement.lang).toBe("");

    document.body.removeChild(target);
});
```

## Asserting spread props

```tsx
test("§7.22 — extra attributes spread onto the root div", () => {
    render(
        <LocaleChooser
            label="Language"
            locales={LOCALES}
            data-testid="custom"
            id="my-id"
        />,
    );
    const el = screen.getByTestId("custom");
    expect(el.id).toBe("my-id");
    expect(el.tagName).toBe("DIV");
    expect(el.className).toContain("locale-chooser");
});
```

## Asserting the `children` render prop

`children` replaces the glyph inside the button, so assert both that
the default `.locale-chooser-icon` is gone and that the custom node
lands inside `.locale-chooser-button`:

```tsx
test("§7.23 — children replace the button glyph and receive ChildArgs", async () => {
    render(
        <LocaleChooser label="Language" locales={LOCALES} value="fr">
            {(args: ChildArgs) => (
                <span
                    data-testid="custom"
                    data-open={String(args.open)}
                    data-value={args.value}
                    data-label-en-us={args.labelFor("en_US")}
                >
                    custom glyph
                </span>
            )}
        </LocaleChooser>,
    );
    await flush();
    const node = screen.getByTestId("custom");
    expect(node.closest("button")?.className).toContain("locale-chooser-button");
    expect(document.querySelector(".locale-chooser-icon")).toBeNull();
    expect(node.getAttribute("data-open")).toBe("false");
    expect(node.getAttribute("data-value")).toBe("fr");
    expect(node.getAttribute("data-label-en-us")).toBe("English (United States)");
});
```

A companion test opens the listbox and asserts `data-open` flips to
`"true"`, which is the only way `open` is observable.

## Pure helper tests

Pure helpers don't need React rendering, just a `test()` block:

```tsx
test("§7.7 — bcp47LocaleTag(en_US) === en-US", () => {
    expect(bcp47LocaleTag("en_US")).toBe("en-US");
});

test("§7.10 — isRtlLocale handles base lang and script subtag", () => {
    expect(isRtlLocale("ar")).toBe(true);
    expect(isRtlLocale("he_IL")).toBe(true);
    expect(isRtlLocale("uz_Arab_AF")).toBe(true);
});

test("matchNavigatorLanguage exact then language-only", () => {
    expect(matchNavigatorLanguage(["fr-CA"], ["en", "fr_CA"])).toBe("fr_CA");
    expect(matchNavigatorLanguage(["fr-CA"], ["en", "fr"])).toBe("fr");
    expect(matchNavigatorLanguage(["xx-YY"], ["en", "fr"])).toBe("");
});
```

## StrictMode

Wrap one test render in `<React.StrictMode>` to catch double-mount bugs:

```tsx
test("StrictMode — first-mount effect runs once", async () => {
    const onChange = vi.fn();
    render(
        <React.StrictMode>
            <LocaleChooser
                label="Language"
                locales={LOCALES}
                defaultValue="fr"
                onChange={onChange}
            />
        </React.StrictMode>,
    );
    await waitFor(() => {
        expect(document.documentElement.lang).toBe("fr");
    });
    expect(onChange).toHaveBeenCalledTimes(1);
});
```

The `initialisedRef` guard ensures the resolver runs once even under
StrictMode's intentional double-invocation.

## navigator.languages mocking

```tsx
test("§7.21 — detectFromNavigator picks first matching language", async () => {
    const original = navigator.languages;
    Object.defineProperty(navigator, "languages", {
        value: ["fr-CA", "en"],
        configurable: true,
    });

    render(
        <LocaleChooser
            label="Language"
            locales={["en", "fr"]}
            detectFromNavigator
        />,
    );
    await waitFor(() => {
        expect(document.documentElement.lang).toBe("fr");
    });

    Object.defineProperty(navigator, "languages", {
        value: original,
        configurable: true,
    });
});
```

## What not to test

- React's render pipeline. Assume `useEffect` runs.
- CSS / styling.
- `Intl.DisplayNames` output (browser-specific; the helper handles the
  fallback chain).
- `scrollIntoView` on the active option — jsdom does not implement it,
  which is why the call site is optional (`el?.scrollIntoView?.(…)`).
- Cross-tab `storage` events (consumer concern).
- Server-side rendering output (see `ssr.md` for the e2e approach).

## Running the suite

```bash
cd lily-design-system-react-helpers/lily-design-system-react-locale-chooser
pnpm vitest run
```

Or in watch mode while iterating:

```bash
pnpm vitest
```

## References

- vitest:
  <https://vitest.dev/>
- `@testing-library/react`:
  <https://testing-library.com/docs/react-testing-library/intro/>
- `@testing-library/user-event`:
  <https://testing-library.com/docs/user-event/intro>
- jsdom:
  <https://github.com/jsdom/jsdom>
