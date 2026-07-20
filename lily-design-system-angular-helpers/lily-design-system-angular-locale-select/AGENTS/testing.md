# Testing — LocaleSelect (Angular)

The select's test suite lives in
[`../locale-select.component.spec.ts`](../locale-select.component.spec.ts)
and asserts every numbered acceptance criterion in `spec/index.md` §7.
This file documents the test harness and the conventions specific
to this helper. For the catalog-wide test rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```ts
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { TestBed, type ComponentFixture } from "@angular/core/testing";
import {
    LocaleSelect,
    GLOBE_WITH_MERIDIANS,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
} from "./locale-select.component";

const LOCALES = ["en", "en_US", "fr", "fr_CA", "ar"];

beforeEach(() => {
    // Reset shared state between tests.
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
    localStorage.clear();
});

function mount(
    inputs: Record<string, unknown> = {},
): ComponentFixture<LocaleSelect> {
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Language");
    fixture.componentRef.setInput("locales", LOCALES);
    for (const [key, value] of Object.entries(inputs)) {
        fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    fixtures.push(fixture);
    return fixture;
}
```

## Destroy every fixture

The component registers a `(document:click)` host listener, so a
leaked fixture keeps reacting to clicks dispatched by later tests.
Collect fixtures and destroy them in `afterEach`:

```ts
let fixtures: ComponentFixture<unknown>[] = [];

afterEach(() => {
    for (const fixture of fixtures) fixture.destroy();
    fixtures = [];
});
```

## Settling the initial-value effect

Initial-value resolution writes back through `value.set(...)`, which
schedules a second effect run. Tests that assert on the resolved
locale must let the microtask queue drain first:

```ts
const flush = () => new Promise<void>((r) => setTimeout(r, 0));

async function mountSettled(
    inputs: Record<string, unknown> = {},
): Promise<ComponentFixture<LocaleSelect>> {
    const fixture = mount(inputs);
    await flush();
    fixture.detectChanges();
    return fixture;
}
```

The same applies after any interaction that opens or closes the list:
focus moves inside a `queueMicrotask`, so `await flush()` before
asserting on `document.activeElement`.

## Pure-helper tests

`bcp47LocaleTag`, `isRtlLocale`, `localeName`, and
`matchNavigatorLanguage` are pure — no `TestBed` needed:

```ts
test("§7.7 bcp47LocaleTag(en_US) === en-US", () => {
    expect(bcp47LocaleTag("en_US")).toBe("en-US");
});

test("§7.10 isRtlLocale handles script subtags", () => {
    expect(isRtlLocale("uz_Arab_AF")).toBe(true);
});
```

## Element accessors

Three selectors cover almost every assertion:

```ts
const button = (f: ComponentFixture<unknown>) =>
    f.nativeElement.querySelector(".locale-select-button") as HTMLButtonElement;

const list = (f: ComponentFixture<unknown>) =>
    f.nativeElement.querySelector(".locale-select-list") as HTMLUListElement;

const options = (f: ComponentFixture<unknown>) =>
    Array.from(
        f.nativeElement.querySelectorAll(".locale-select-option"),
    ) as HTMLLIElement[];
```

## Standard mount

```ts
test("§7.1 renders a button that controls a listbox", () => {
    const fixture = mount();
    const btn = button(fixture);
    expect(btn.getAttribute("type")).toBe("button");
    expect(btn.getAttribute("aria-haspopup")).toBe("listbox");
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    expect(list(fixture).id).toBe(btn.getAttribute("aria-controls"));
    expect(list(fixture).getAttribute("role")).toBe("listbox");
});
```

## Asserting `lang` and `dir`

```ts
expect(document.documentElement.lang).toBe("ar");
expect(document.documentElement.dir).toBe("rtl");
```

## Asserting per-option `lang`

```ts
const opts = options(fixture);
expect(opts[0].getAttribute("lang")).toBe("en");
expect(opts[1].getAttribute("lang")).toBe("en-US");
// The chrome carries none of its own.
expect(button(fixture).hasAttribute("lang")).toBe(false);
expect(list(fixture).hasAttribute("lang")).toBe(false);
```

## Choosing an option

Open the list, then click the option. Both are bubbling
`MouseEvent`s; the outside-click host listener ignores them because
they originate inside the root.

```ts
function click(f: ComponentFixture<unknown>, target: HTMLElement): void {
    target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    f.detectChanges();
}

async function pick(
    f: ComponentFixture<unknown>,
    code: string,
    locales: string[] = LOCALES,
): Promise<void> {
    click(f, button(f));
    click(f, options(f)[locales.indexOf(code)]);
    await flush();
    f.detectChanges();
}

const fixture = await mountSettled();
await pick(fixture, "fr");
expect(document.documentElement.lang).toBe("fr");
```

## Driving the keyboard

Keydowns must bubble — the handlers are bound on the button and the
`<ul>`, not on individual options:

```ts
function press(
    f: ComponentFixture<unknown>,
    target: HTMLElement,
    key: string,
): void {
    target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
    f.detectChanges();
}

const fixture = await mountSettled();
press(fixture, button(fixture), "ArrowDown");
await flush();
fixture.detectChanges();

const ul = list(fixture);
expect(ul.hasAttribute("hidden")).toBe(false);
expect(document.activeElement).toBe(ul);

press(fixture, ul, "ArrowDown");
expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[1].id);
```

Assert the active option through `aria-activedescendant` (or the
`data-active` attribute), never through `document.activeElement` on
an option — focus stays on the `<ul>`.

## Testing the typeahead buffer reset

The 500 ms buffer needs fake timers:

```ts
vi.useFakeTimers();
try {
    const fixture = mount({ value: "en" });
    press(fixture, button(fixture), "ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "a");           // "Arabic"
    vi.advanceTimersByTime(600);       // buffer clears
    press(fixture, ul, "f");           // "French", not "af"
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[2].id);
} finally {
    vi.useRealTimers();
}
```

## Asserting `localeChange` output

```ts
const fixture = await mountSettled({ defaultValue: "en" });
const onChange = vi.fn();
fixture.componentInstance.localeChange.subscribe(onChange);

await pick(fixture, "en_US");

// Consumer form, not the BCP 47 tag.
expect(onChange).toHaveBeenLastCalledWith("en_US");
expect(document.documentElement.lang).toBe("en-US");
```

## Testing the projected icon template

`contentChild()` needs a real host component; `setInput` cannot
project content:

```ts
@Component({
    standalone: true,
    imports: [LocaleSelect],
    template: `
        <lily-locale-select label="Language" [locales]="locales" [value]="'fr'">
            <ng-template let-args>
                <span data-testid="custom" [attr.data-value]="args.value"></span>
            </ng-template>
        </lily-locale-select>
    `,
})
class IconTemplateHost {
    readonly locales = LOCALES;
}

const fixture = TestBed.createComponent(IconTemplateHost);
fixture.detectChanges();

const custom = fixture.nativeElement.querySelector('[data-testid="custom"]');
expect(custom.closest("button")?.className).toContain("locale-select-button");
// The default glyph is replaced, not supplemented.
expect(fixture.nativeElement.querySelector(".locale-select-icon")).toBeNull();
```

## Mocking `navigator.languages`

```ts
it("§7.20 detectFromNavigator picks an exact match", () => {
    Object.defineProperty(navigator, "languages", {
        configurable: true,
        get: () => ["fr-FR", "en"],
    });
    const fixture = mount({
        label: "L",
        locales: ["en", "fr_FR", "ar"],
        detectFromNavigator: true,
    });
    fixture.detectChanges();
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

## `[(value)]` emulation

Two-way binding via `[(value)]` desugars to `[value]="x"` plus
`(valueChange)="x = $event"`. Simulate it manually:

```ts
const fixture = mount({ label: "L", locales: ["en", "fr"], value: "en" });
fixture.componentRef.instance.value.subscribe((next) => {
    fixture.componentRef.setInput("value", next);
});
```

## Asserting initial-value resolution

```ts
test("§7.18 storageKey writes the active code to localStorage", async () => {
    await mountSettled({ locales: ["en", "fr"], storageKey: "x" });
    expect(localStorage.getItem("x")).toBe("en");
});
```

## Scoped target

```ts
const region = document.createElement("section");
document.body.appendChild(region);

await mountSettled({ locales: ["en", "fr"], target: region });

expect(region.getAttribute("lang")).toBe("en");
expect(document.documentElement.hasAttribute("lang")).toBe(false);
region.remove();
```

## SSR sanity

A lightweight SSR sanity check is "the component module imports
without touching `document`":

```ts
it("imports cleanly without DOM access", async () => {
    const mod = await import("./locale-select.component");
    expect(mod.LocaleSelect).toBeDefined();
});
```

## jsdom gaps

jsdom does not implement `Element.prototype.scrollIntoView`. The
component calls it optionally (`el?.scrollIntoView?.({ block:
"nearest" })`) precisely so the suite runs without a stub — do not
add one, and do not assert on scrolling.

## One test per §7 acceptance

Each `test(...)` description starts with the clause number, e.g.
`test("§7.16 selecting a different option updates lang, dir, and emits localeChange", …)`.
Keep the naming convention so a reviewer can spot a missing clause.
Several tests may share a clause number when a clause has multiple
assertions, but every clause must have at least one test and every
test must name a clause.

Section map:

| §7 group          | Clauses | Test focus                                              |
| ----------------- | ------- | ------------------------------------------------------- |
| 7.1 markup        | 1–6     | button + listbox DOM contract, glyph, ids, `lang`, labels |
| 7.2 pure helpers  | 7–12    | bcp47LocaleTag, isRtlLocale, localeName                  |
| 7.3 application   | 13–17   | target.lang, target.dir, applyDir, `localeChange`, hidden input |
| 7.4 init value    | 18–21   | storage / value / navigator / defaultValue ordering      |
| 7.5 class + icon  | 22–23   | className on the root div; projected `<ng-template>`     |
| 7.6 keyboard      | 24–28   | open keys, move + clamp, commit, cancel, typeahead, pointer |
