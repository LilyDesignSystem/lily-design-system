# Testing — ThemeSelect (Angular)

The picker's test suite lives in
[`../theme-select.component.spec.ts`](../theme-select.component.spec.ts)
and asserts every numbered acceptance criterion in `spec.md` §7.
This file documents the test harness and the conventions specific
to this helper. For the catalog-wide test rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { TestBed, type ComponentFixture } from "@angular/core/testing";
import {
    ThemeSelect,
    themeHref,
    normaliseThemesUrl,
} from "./theme-select.component";

beforeEach(() => {
    // Reset shared state between tests.
    document.head.innerHTML = "";
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
});

function mount(
    inputs: Record<string, unknown>,
): ComponentFixture<ThemeSelect> {
    const fixture = TestBed.createComponent(ThemeSelect);
    for (const [key, value] of Object.entries(inputs)) {
        fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    return fixture;
}
```

Each test re-runs the whole `effect()` lifecycle by calling
`mount({ inputs… })`.

## Async waits

The picker's `effect()` callback fires synchronously inside
`fixture.detectChanges()`. When the effect writes back to `value`
(initial-value resolution), a second `detectChanges()` flushes the
follow-up tick:

```ts
const fixture = mount({ /* … */ });
// detectChanges() above runs the first effect pass; if value was
// resolved to a new slug, a second pass applies it.
fixture.detectChanges();
```

For DOM async (e.g. a `<link>`'s `load` event), use
`vi.waitFor()`:

```ts
import { vi } from "vitest";

await vi.waitFor(() => {
    const link = document.head.querySelector('link[data-lily-theme-select="theme"]');
    expect(link?.getAttribute("href")).toContain("dark.css");
});
```

## `[(value)]` emulation

Two-way binding via `[(value)]` desugars to `[value]="x"` plus
`(valueChange)="x = $event"` in Angular 17+. To assert two-way
binding, subscribe to the model:

```ts
const fixture = mount({ label: "T", themesUrl: "/t/", themes: ["light", "dark"] });
const emissions: string[] = [];
fixture.componentRef.instance.value.subscribe(v => emissions.push(v));

const select = fixture.nativeElement.querySelector("select") as HTMLSelectElement;
select.value = "dark";
select.dispatchEvent(new Event("change", { bubbles: true }));
fixture.detectChanges();

expect(emissions.at(-1)).toBe("dark");
```

`model()` signals support `.subscribe(...)` directly because they
expose an `OutputEmitterRef` for the implicit `valueChange` half.

## Triggering a select change

```ts
const select = fixture.nativeElement.querySelector("select") as HTMLSelectElement;
select.value = "dark";
select.dispatchEvent(new Event("change", { bubbles: true }));
fixture.detectChanges();
```

Directly dispatching `change` mirrors how a real user selection
flows through Angular's `(change)` binding.

## Asserting the managed `<link>`

```ts
const link = document.head.querySelector<HTMLLinkElement>(
    'link[data-lily-theme-select="theme"]',
);
expect(link).not.toBeNull();
expect(link!.href).toMatch(/\/t\/light\.css$/);
```

`href` on an `HTMLLinkElement` resolves to an absolute URL, so use
a regex with the suffix rather than an exact match.

## Asserting `data-theme`

```ts
expect(document.documentElement.dataset.theme).toBe("light");
```

`dataset.theme` is the camelCase view of `data-theme`.

## Asserting `localStorage`

```ts
expect(localStorage.getItem("my-app:theme")).toBe("dark");
```

Run `localStorage.clear()` in `beforeEach` to keep tests isolated.

## Pure-helper tests

`normaliseThemesUrl` and `themeHref` are pure — no `TestBed`
needed:

```ts
it("§7.13 normaliseThemesUrl appends a slash", () => {
    expect(normaliseThemesUrl("/x")).toBe("/x/");
    expect(normaliseThemesUrl("/x/")).toBe("/x/");
});

it("§7.13 themeHref builds the full URL", () => {
    expect(themeHref("/x/", "dark", ".css")).toBe("/x/dark.css");
});
```

## Output assertions

```ts
const events: string[] = [];
fixture.componentRef.instance.themeChange.subscribe((slug) => events.push(slug));

const select = fixture.nativeElement.querySelector("select") as HTMLSelectElement;
select.value = "dark";
select.dispatchEvent(new Event("change", { bubbles: true }));
fixture.detectChanges();

expect(events).toContain("dark");
```

`themeChange` fires on every successful apply, including the
initial-value resolution that happens during mount.

## SSR sanity

A lightweight SSR sanity check is "the component module imports
without touching `document`":

```ts
it("imports cleanly without DOM access", async () => {
    const mod = await import("./theme-select.component");
    expect(mod.ThemeSelect).toBeDefined();
});
```

For full SSR rendering, use `@angular/ssr`'s `renderApplication`
inside a separate spec file. The catalog ships no such spec because
`typeof document` guards in the effect callback give the same
protection.

## What every §7 test asserts

See the per-clause map in
[`../spec.md` §7](../spec.md#7-testing-acceptance-criteria). Each
`it(...)` description starts with the clause number, e.g.
`it("§7.6 resolves the initial theme to 'light' …", …)`. Keep the
naming convention so a reviewer can spot a missing clause.
