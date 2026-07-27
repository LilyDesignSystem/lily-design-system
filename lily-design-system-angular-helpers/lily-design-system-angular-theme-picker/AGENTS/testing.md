# Testing — ThemeChooser (Angular)

The select's test suite lives in
[`../theme-chooser.component.spec.ts`](../theme-chooser.component.spec.ts)
and asserts every numbered acceptance criterion in `spec/index.md` §7.
This file documents the test harness and the conventions specific
to this helper. For the catalog-wide test rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```ts
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { TestBed, type ComponentFixture } from "@angular/core/testing";
import {
    ThemeChooser,
    CIRCLE_WITH_RIGHT_HALF_BLACK,
    themeHref,
    normaliseThemesUrl,
} from "./theme-chooser.component";

let fixtures: ComponentFixture<unknown>[] = [];

beforeEach(() => {
    // Reset shared state between tests.
    document.documentElement.removeAttribute("data-theme");
    document.head
        .querySelectorAll("link[data-lily-theme-chooser]")
        .forEach((n) => n.remove());
    localStorage.clear();
});

afterEach(() => {
    // Destroy fixtures so the (document:click) host binding unwinds.
    for (const fixture of fixtures) fixture.destroy();
    fixtures = [];
    document.documentElement.removeAttribute("data-theme");
});

function mount(
    inputs: Record<string, unknown> = {},
): ComponentFixture<ThemeChooser> {
    const fixture = TestBed.createComponent(ThemeChooser);
    fixture.componentRef.setInput("label", "Theme");
    fixture.componentRef.setInput("themesUrl", "/assets/themes/");
    fixture.componentRef.setInput("themes", ["light", "dark", "abyss"]);
    for (const [key, value] of Object.entries(inputs)) {
        fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    fixtures.push(fixture);
    return fixture;
}
```

**Destroying fixtures in `afterEach` is not optional.** The component
registers a `(document:click)` host binding; leaked fixtures keep
listening and a later test's click closes an earlier test's listbox.

Query helpers worth having, since every assertion reaches for the
same three elements:

```ts
const button = (f) => f.nativeElement.querySelector(".theme-chooser-button");
const list   = (f) => f.nativeElement.querySelector(".theme-chooser-list");
const options = (f) =>
    Array.from(f.nativeElement.querySelectorAll(".theme-chooser-option"));
```

## Async waits

Two async hops matter:

1. The `effect()`'s initial-value write-back, which needs a
   macrotask flush plus a re-render.
2. `openList()` / `closeList()`, which move focus inside a
   `queueMicrotask` (the target is `hidden` at call time).

A `flush()` + `detectChanges()` pair covers both:

```ts
const flush = () => new Promise<void>((r) => setTimeout(r, 0));

const fixture = mount();
await flush();
fixture.detectChanges();
```

## `[(value)]` emulation

Two-way binding via `[(value)]` desugars to `[value]="x"` plus
`(valueChange)="x = $event"` in Angular 17+. To assert two-way
binding, subscribe to the model:

```ts
const fixture = mount();
const emissions: string[] = [];
fixture.componentInstance.value.subscribe((v) => emissions.push(v));

click(fixture, button(fixture));       // open
click(fixture, options(fixture)[1]);   // choose "dark"
await flush();
fixture.detectChanges();

expect(emissions.at(-1)).toBe("dark");
```

`model()` signals support `.subscribe(...)` directly because they
expose an `OutputEmitterRef` for the implicit `valueChange` half.

## Driving the control

Clicks and keydowns must bubble, and every one needs a re-render:

```ts
function click(fixture: ComponentFixture<unknown>, target: HTMLElement): void {
    target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    fixture.detectChanges();
}

function press(
    fixture: ComponentFixture<unknown>,
    target: HTMLElement,
    key: string,
): void {
    target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
    fixture.detectChanges();
}
```

Open-then-choose is the common path:

```ts
click(fixture, button(fixture));
click(fixture, options(fixture)[2]);
await flush();
fixture.detectChanges();
```

Keyboard equivalents target the button to open and the `<ul>`
afterwards — never an `<li>`, which never receives focus:

```ts
press(fixture, button(fixture), "ArrowDown");  // opens, focuses the <ul>
await flush();
fixture.detectChanges();
press(fixture, list(fixture), "ArrowDown");    // moves the active option
press(fixture, list(fixture), "Enter");        // selects and closes
```

## Asserting open state and the active option

Open state lives on two attributes; the active option on a third:

```ts
expect(list(fixture).hasAttribute("hidden")).toBe(false);
expect(button(fixture).getAttribute("aria-expanded")).toBe("true");
expect(list(fixture).getAttribute("aria-activedescendant"))
    .toBe(list(fixture).children[1].id);
```

Assert against `children[i].id` rather than a hardcoded id string —
`nextThemeChooserId()` increments across the whole test file, so the
absolute numbers depend on how many components mounted before.

For uniqueness, mount two and compare the id sets:

```ts
const a = mount(), b = mount();
const idsA = options(a).map((o) => o.id);
const idsB = options(b).map((o) => o.id);
expect(new Set([...idsA, ...idsB]).size).toBe(idsA.length + idsB.length);
```

## Testing the typeahead buffer reset

The 500 ms reset needs fake timers:

```ts
vi.useFakeTimers();
try {
    const fixture = mount();
    press(fixture, button(fixture), "ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "d");
    vi.advanceTimersByTime(600);
    // The buffer is empty again, so "a" alone matches "Abyss".
    press(fixture, ul, "a");
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[2].id);
} finally {
    vi.useRealTimers();
}
```

Note `vi.useFakeTimers()` also stops the `flush()` helper resolving,
so use `mount()` (not the settled variant) inside fake-timer blocks.

## Testing the custom glyph template

`contentChild(TemplateRef)` needs real projection, so wrap the
component in a host:

```ts
@Component({
    standalone: true,
    imports: [ThemeChooser],
    template: `
        <lily-theme-chooser label="Theme" [themesUrl]="url" [themes]="themes">
            <ng-template let-args>
                <span data-testid="custom" [attr.data-value]="args.value">…</span>
            </ng-template>
        </lily-theme-chooser>
    `,
})
class IconTemplateHost {
    readonly url = "/assets/themes/";
    readonly themes = ["light", "dark", "abyss"];
}
```

Then assert the custom node sits inside the button and the default
glyph is gone:

```ts
const custom = fixture.nativeElement.querySelector('[data-testid="custom"]');
expect(custom.closest("button")?.className).toContain("theme-chooser-button");
expect(fixture.nativeElement.querySelector(".theme-chooser-icon")).toBeNull();
```

## jsdom gaps

`scrollIntoView` is not implemented in jsdom. The component calls it
optionally (`el?.scrollIntoView?.(…)`), so no stub is needed — but
don't assert on scrolling.

## Asserting the managed `<link>`

```ts
const link = document.head.querySelector<HTMLLinkElement>(
    'link[data-lily-theme-chooser="theme"]',
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
test("§7.19 normaliseThemesUrl appends a slash", () => {
    expect(normaliseThemesUrl("/x")).toBe("/x/");
    expect(normaliseThemesUrl("/x/")).toBe("/x/");
});

test("§7.19 themeHref builds the full URL", () => {
    expect(themeHref("/x/", "dark", ".css")).toBe("/x/dark.css");
});
```

## Output assertions

```ts
const events: string[] = [];
fixture.componentInstance.themeChange.subscribe((slug) => events.push(slug));

click(fixture, button(fixture));
click(fixture, options(fixture)[1]);
await flush();
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
    const mod = await import("./theme-chooser.component");
    expect(mod.ThemeChooser).toBeDefined();
});
```

For full SSR rendering, use `@angular/ssr`'s `renderApplication`
inside a separate spec file. The catalog ships no such spec because
`typeof document` guards in the effect callback give the same
protection.

## What every §7 test asserts

See the per-clause map in
[`../spec/index.md` §7](../spec/index.md#7-testing-acceptance-criteria)
— clauses §7.1 through §7.19. Each `test(...)` description starts with
the clause number, e.g.
`test("§7.6 default initial value is 'light' when present in themes", …)`.
Keep the naming convention so a reviewer can spot a missing clause;
several clauses have more than one test, but every test names exactly
one clause and every clause has at least one test.

The suite groups them into four `describe` blocks: markup contract
(§7.1–§7.5), keyboard contract (§7.14–§7.18), dynamic loading
(§7.6–§7.11), and the custom icon template (§7.12–§7.13), plus a
`TestBed`-free block for the pure helpers (§7.19).
