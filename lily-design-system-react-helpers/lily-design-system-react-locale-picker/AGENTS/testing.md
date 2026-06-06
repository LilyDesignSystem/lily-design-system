# AGENTS / testing — LocalePicker

Test specifics for the React `LocalePicker` helper. Read
[`../../AGENTS.md`](../../AGENTS.md) for the catalog-wide React stack;
this file is the per-helper contract.

## Stack

- **Runner.** vitest in `jsdom` environment.
- **Renderer.** `@testing-library/react`.
- **User events.** `@testing-library/user-event` (preferred) or
  `fireEvent`.

## Test file

[`../LocalePicker.test.tsx`](../LocalePicker.test.tsx) — one numbered
test per [`spec.md §7`](../spec.md#7-testing-acceptance-criteria)
acceptance criterion.

## Required reset between tests

The picker mutates `document.documentElement.lang` and `.dir`. Reset
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
| 7.1  | `<fieldset role="radiogroup">` | `screen.getByRole("radiogroup").tagName === "FIELDSET"`       |
| 7.2  | `aria-label` is `label`        | `screen.getByLabelText(label)`                                |
| 7.3  | One radio per locale, shared `name` | `screen.getAllByRole("radio")`                           |
| 7.4  | Each option `<label lang>`     | iterate option `<label>` elements, assert `.lang`             |
| 7.5  | Default rendering uses `defaultLocaleLabels` | check `.textContent` per option               |
| 7.6  | Document root gets `lang`+`dir` after mount | `waitFor` `documentElement.lang` / `.dir`        |
| 7.7  | `bcp47LocaleTag("en_US")`      | pure                                                          |
| 7.8  | `bcp47LocaleTag("zh_Hant_TW")` | pure                                                          |
| 7.9  | `bcp47LocaleTag("en")`         | pure                                                          |
| 7.10 | `isRtlLocale` RTL cases        | pure (ar, he_IL, uz_Arab_AF)                                  |
| 7.11 | `isRtlLocale` LTR cases        | pure (en, fr_CA)                                              |
| 7.12 | `localeName("en_US")`          | pure (from `locales.tsv`)                                     |
| 7.13 | Storage key persists           | first render writes; unmount; second render reads             |
| 7.14 | `value` prop wins              | preset storage; render with `value`; assert applied           |
| 7.15 | `applyDir={false}` omits dir   | RTL value, assert `documentElement.dir === ""`                |
| 7.16 | Custom `target`                | render with `target={ref}`; assert `target.lang`, root unchanged |
| 7.17 | `onChange` fires on apply      | `vi.fn()` spy in `onChange`                                   |
| 7.18 | `children` render prop         | mock `children`, assert `ChildArgs` shape                     |
| 7.19 | Extra attrs spread             | render with `data-testid`; query by data attribute            |

## Mounting

```tsx
import { render, screen, waitFor, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import LocalePicker, {
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
} from "./LocalePicker";

const LOCALES = ["en", "en_US", "fr", "fr_CA", "ar"];

test("§7.6 — initial value applies lang+dir to document root", async () => {
    render(<LocalePicker label="Language" locales={LOCALES} defaultValue="ar" />);
    await waitFor(() => {
        expect(document.documentElement.lang).toBe("ar");
        expect(document.documentElement.dir).toBe("rtl");
    });
});
```

`waitFor` is required for any assertion that depends on the first-mount
effect.

## Asserting the language attribute round-trip

```tsx
test("§7.6 — en_US is written as en-US (BCP 47 hyphen)", async () => {
    render(<LocalePicker label="Language" locales={LOCALES} defaultValue="en_US" />);
    await waitFor(() => {
        expect(document.documentElement.lang).toBe("en-US");
    });
});
```

The underscore form on input becomes the hyphen form on the `lang`
attribute. The `value` mirrors the consumer form back.

## Asserting user selection

```tsx
import userEvent from "@testing-library/user-event";

test("§7.17 — selecting a radio fires onChange and updates lang/dir", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
        <LocalePicker
            label="Language"
            locales={LOCALES}
            defaultValue="en"
            onChange={onChange}
        />
    );
    await waitFor(() => {
        expect(document.documentElement.lang).toBe("en");
    });

    await user.click(screen.getByRole("radio", { name: "Arabic" }));

    await waitFor(() => {
        expect(document.documentElement.lang).toBe("ar");
        expect(document.documentElement.dir).toBe("rtl");
        expect(onChange).toHaveBeenCalledWith("ar");
    });
});
```

`user.click` on the label triggers the change event on the inner radio.
`getByRole("radio", { name: "Arabic" })` matches via the radio's
accessible name (the visible label text).

## Asserting persistence

```tsx
test("§7.13 — storageKey survives unmount/remount", async () => {
    const user = userEvent.setup();
    const { unmount } = render(
        <LocalePicker
            label="Language"
            locales={LOCALES}
            storageKey="lily-locale"
            defaultValue="en"
        />,
    );
    await waitFor(() => {
        expect(document.documentElement.lang).toBe("en");
    });
    await user.click(screen.getByRole("radio", { name: "French" }));
    await waitFor(() => {
        expect(localStorage.getItem("lily-locale")).toBe("fr");
    });
    unmount();

    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");

    render(
        <LocalePicker
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
test("§7.14 — value prop wins over storage and defaultValue", async () => {
    localStorage.setItem("lily-locale", "ar");
    render(
        <LocalePicker
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
        <LocalePicker
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
test("§7.16 — custom target receives lang/dir, root is untouched", async () => {
    const target = document.createElement("section");
    document.body.appendChild(target);

    render(
        <LocalePicker
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
test("§7.19 — extra attributes spread onto fieldset", () => {
    render(
        <LocalePicker
            label="Language"
            locales={LOCALES}
            data-testid="custom"
            id="my-id"
        />,
    );
    const fs = screen.getByTestId("custom");
    expect(fs.id).toBe("my-id");
    expect(fs.tagName).toBe("FIELDSET");
});
```

## Asserting the `children` render prop

```tsx
test("§7.18 — children receives ChildArgs", () => {
    const spy = vi.fn<[ChildArgs], React.ReactNode>(() => <span>x</span>);
    render(
        <LocalePicker label="Language" locales={LOCALES}>
            {spy}
        </LocalePicker>,
    );
    expect(spy).toHaveBeenCalled();
    const args = spy.mock.calls[0][0];
    expect(args.locales).toEqual(LOCALES);
    expect(args.name).toBe("locale");
    expect(typeof args.setLocale).toBe("function");
    expect(typeof args.labelFor).toBe("function");
    expect(typeof args.tagFor).toBe("function");
    expect(typeof args.isRtl).toBe("function");
    expect(args.tagFor("en_US")).toBe("en-US");
    expect(args.isRtl("ar")).toBe(true);
    expect(args.labelFor("en_US")).toBe("English (United States)");
});
```

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
            <LocalePicker
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
test("§7.6 — detectFromNavigator picks first matching language", async () => {
    const original = navigator.languages;
    Object.defineProperty(navigator, "languages", {
        value: ["fr-CA", "en"],
        configurable: true,
    });

    render(
        <LocalePicker
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
- Cross-tab `storage` events (consumer concern).
- Server-side rendering output (see `ssr.md` for the e2e approach).

## Running the suite

```bash
cd lily-design-system-react-helpers/lily-design-system-react-locale-picker
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
