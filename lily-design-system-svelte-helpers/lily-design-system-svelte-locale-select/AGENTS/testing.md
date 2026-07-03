# Testing — LocaleSelect (Svelte)

The select's test suite lives in
[`../LocaleSelect.test.ts`](../LocaleSelect.test.ts) and asserts
every numbered acceptance criterion in `spec/index.md` §7. This file
documents the test harness and the conventions specific to this
helper. For the catalog-wide test rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/svelte";
import { tick } from "svelte";
import LocaleSelect, {
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
} from "./LocaleSelect.svelte";

beforeEach(() => {
    // Reset shared state between tests.
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
    localStorage.clear();
});
```

## Pure-helper tests

`bcp47LocaleTag`, `isRtlLocale`, `localeName`, and
`matchNavigatorLanguage` are pure — no `render` needed:

```ts
it("§7.7 bcp47LocaleTag(en_US) === en-US", () => {
    expect(bcp47LocaleTag("en_US")).toBe("en-US");
});

it("§7.10 isRtlLocale handles script subtags", () => {
    expect(isRtlLocale("uz_Arab_AF")).toBe(true);
});

it("§7.12 localeName looks up the English name", () => {
    expect(localeName("en_US")).toBe("English (United States)");
});
```

## Standard render

```ts
it("§7.1 renders a select", async () => {
    const { container } = render(LocaleSelect, {
        props: { label: "Language", locales: ["en", "fr"] },
    });
    await tick();
    const root = container.querySelector("select");
    expect(root).not.toBeNull();
    expect(root!.getAttribute("aria-label")).toBe("Language");
});
```

## Asserting `lang` and `dir`

```ts
expect(document.documentElement.lang).toBe("ar");
expect(document.documentElement.dir).toBe("rtl");
```

## Asserting per-option `lang`

```ts
const options = container.querySelectorAll("option.locale-select-option");
expect(options[0].getAttribute("lang")).toBe("en");
expect(options[1].getAttribute("lang")).toBe("fr-CA");
```

## Driving a select change

```ts
import { fireEvent } from "@testing-library/svelte";

const select = container.querySelector("select") as HTMLSelectElement;
select.value = "fr";
await fireEvent.change(select);
expect(document.documentElement.lang).toBe("fr");
```

## Mocking `navigator.languages`

```ts
it("§7.20 detectFromNavigator picks an exact match", async () => {
    Object.defineProperty(navigator, "languages", {
        configurable: true,
        get: () => ["fr-FR", "en"],
    });
    render(LocaleSelect, {
        props: {
            label: "L",
            locales: ["en", "fr_FR", "ar"],
            detectFromNavigator: true,
        },
    });
    await tick();
    expect(document.documentElement.lang).toBe("fr-FR");
});
```

`Object.defineProperty(navigator, "languages", { ... })` works in
jsdom; resetting between tests is the cleanest way to avoid
cross-contamination.

## Mocking `localStorage`

`localStorage` works natively in jsdom; just `clear()` between
tests. To simulate a thrown read:

```ts
const original = Storage.prototype.getItem;
Storage.prototype.getItem = () => { throw new Error("private mode"); };
// … run test …
Storage.prototype.getItem = original;
```

The select swallows the error inside try/catch.

## Driving a `bind:value` test

`bind:value` is sugar; inside a test we either inspect the side
effect (`document.documentElement.lang`, the `localStorage` write)
or spy on `onChange`:

```ts
const onChange = vi.fn();
render(LocaleSelect, {
    props: {
        label: "L",
        locales: ["en", "fr", "ar"],
        onChange,
    },
});
await tick();
expect(onChange).toHaveBeenCalledWith("en");
```

To observe the bind-back side, mount the select inside a tiny
wrapper `.svelte` fixture that does `bind:value` and asserts the
new value on its own `$state`. Most tests don't need this — the
`onChange` spy is enough.

## Snippet tests

Use `createRawSnippet` to construct a snippet on the fly:

```ts
import { createRawSnippet } from "svelte";

it("§7.23 children snippet receives ChildArgs", async () => {
    let captured: any = null;
    const children = createRawSnippet((args) => {
        captured = args();
        return { render: () => "<div></div>" };
    });
    render(LocaleSelect, {
        props: { label: "L", locales: ["en", "fr"], children },
    });
    await tick();
    expect(captured.locales).toEqual(["en", "fr"]);
    expect(typeof captured.setLocale).toBe("function");
    expect(typeof captured.tagFor).toBe("function");
    expect(typeof captured.isRtl).toBe("function");
    expect(captured.tagFor("en_US")).toBe("en-US");
    expect(captured.isRtl("ar")).toBe(true);
});
```

## SSR sanity test

```ts
import { render as ssrRender } from "svelte/server";

it("renders cleanly under SSR", () => {
    const { html } = ssrRender(LocaleSelect, {
        props: {
            label: "Language",
            locales: ["en", "fr"],
            value: "fr",
        },
    });
    expect(html).toContain("<select");
    expect(html).toContain('aria-label="Language"');
    expect(html).toContain('value="fr"');
});
```

This guarantees no `document.*` access leaked into the render path.

## One test per §7 acceptance

Each `it(...)` description starts with the clause number, e.g.
`it("§7.16 selecting an option updates lang and dir …", …)`. Keep
the naming convention so a reviewer can spot a missing clause.

Section map:

| §7 group        | Test focus                                              |
| --------------- | ------------------------------------------------------- |
| 7.1 markup      | DOM contract: select, name, option value, lang          |
| 7.2 pure helpers| bcp47LocaleTag, isRtlLocale, localeName                 |
| 7.3 application | target.lang, target.dir, applyDir, onChange             |
| 7.4 init value  | storage / value / navigator / defaultValue ordering     |
| 7.5 spread/slot | restProps fall-through and ChildArgs contract           |
