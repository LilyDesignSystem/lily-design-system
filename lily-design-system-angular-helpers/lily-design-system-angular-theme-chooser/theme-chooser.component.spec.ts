import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  ThemeChooser,
  CIRCLE_WITH_RIGHT_HALF_BLACK,
  matchSystemTheme,
  normaliseThemesUrl,
  themeHref,
  themeName,
} from "./theme-chooser.component";

const THEMES = ["light", "dark", "abyss"];
const URL_TRAILING = "/assets/themes/";
const URL_NO_TRAILING = "/assets/themes";

function getManagedLink(name = "theme"): HTMLLinkElement | null {
  return document.head.querySelector<HTMLLinkElement>(
    `link[data-lily-theme-chooser="${name}"]`,
  );
}

function flush(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}

/** Fixtures created by a test, destroyed after it so listeners unwind. */
let fixtures: ComponentFixture<unknown>[] = [];

/** Create + render a ThemeChooser with the supplied inputs. */
function mount(inputs: Record<string, unknown> = {}): ComponentFixture<ThemeChooser> {
  const fixture = TestBed.createComponent(ThemeChooser);
  fixture.componentRef.setInput("label", "Theme");
  fixture.componentRef.setInput("themesUrl", URL_TRAILING);
  fixture.componentRef.setInput("themes", THEMES);
  for (const [key, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  fixtures.push(fixture);
  return fixture;
}

/** Mount, let the initial-value effect settle, and re-render. */
async function mountSettled(
  inputs: Record<string, unknown> = {},
): Promise<ComponentFixture<ThemeChooser>> {
  const fixture = mount(inputs);
  await flush();
  fixture.detectChanges();
  return fixture;
}

function q<T extends Element>(fixture: ComponentFixture<unknown>, sel: string): T {
  return fixture.nativeElement.querySelector(sel) as T;
}

function button(fixture: ComponentFixture<unknown>): HTMLButtonElement {
  return q<HTMLButtonElement>(fixture, ".theme-chooser-button");
}

function list(fixture: ComponentFixture<unknown>): HTMLUListElement {
  return q<HTMLUListElement>(fixture, ".theme-chooser-list");
}

function options(fixture: ComponentFixture<unknown>): HTMLLIElement[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll(".theme-chooser-option"),
  ) as HTMLLIElement[];
}

/** Dispatch a bubbling keydown and re-render. */
function press(
  fixture: ComponentFixture<unknown>,
  target: HTMLElement,
  key: string,
): void {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
  fixture.detectChanges();
}

/** Click an element and re-render. */
function click(fixture: ComponentFixture<unknown>, target: HTMLElement): void {
  target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  fixture.detectChanges();
}

/** Open the listbox and click the option for `slug`. */
async function pick(
  fixture: ComponentFixture<unknown>,
  slug: string,
  themes: string[] = THEMES,
): Promise<void> {
  click(fixture, button(fixture));
  click(fixture, options(fixture)[themes.indexOf(slug)]);
  await flush();
  fixture.detectChanges();
}

beforeEach(() => {
  document.documentElement.removeAttribute("data-theme");
  document.head
    .querySelectorAll("link[data-lily-theme-chooser]")
    .forEach((n) => n.remove());
  try {
    localStorage.clear();
  } catch {
    /* ignore */
  }
});

afterEach(() => {
  for (const fixture of fixtures) fixture.destroy();
  fixtures = [];
  document.documentElement.removeAttribute("data-theme");
});

describe("ThemeChooser — pure helpers (§7.19)", () => {
  test("normaliseThemesUrl keeps a trailing slash", () => {
    expect(normaliseThemesUrl("/a/")).toBe("/a/");
  });

  test("normaliseThemesUrl appends a missing trailing slash", () => {
    expect(normaliseThemesUrl("/a")).toBe("/a/");
  });

  test("themeHref builds the href", () => {
    expect(themeHref("/a", "light", ".css")).toBe("/a/light.css");
    expect(themeHref("/a/", "light", ".css")).toBe("/a/light.css");
  });
});

describe("ThemeChooser — markup contract (§4.2, §7.1–§7.5)", () => {
  test("§7.1 renders a button that controls a listbox", () => {
    const fixture = mount();
    const btn = button(fixture);
    expect(btn.tagName).toBe("BUTTON");
    expect(btn.getAttribute("type")).toBe("button");
    expect(btn.getAttribute("aria-haspopup")).toBe("listbox");
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    const listId = btn.getAttribute("aria-controls");
    expect(listId).toBeTruthy();
    expect(list(fixture).id).toBe(listId);
    expect(list(fixture).getAttribute("role")).toBe("listbox");
  });

  test("§7.1 the root is a div carrying the class hook", () => {
    const fixture = mount({ className: "extra" });
    const root = q<HTMLElement>(fixture, ".theme-chooser");
    expect(root.tagName).toBe("DIV");
    expect(root.classList.contains("theme-chooser")).toBe(true);
    expect(root.classList.contains("extra")).toBe(true);
  });

  test("§7.1 the button renders the half-circle glyph, hidden from assistive tech", () => {
    const fixture = mount();
    const icon = q<HTMLElement>(fixture, ".theme-chooser-icon");
    // U+25D1 CIRCLE WITH RIGHT HALF BLACK, decimal &#9681;
    expect(icon.textContent).toBe("\u25D1");
    expect(CIRCLE_WITH_RIGHT_HALF_BLACK).toBe("\u25D1");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
  });

  test("§7.2 aria-label names the button and the listbox", () => {
    const fixture = mount({ label: "Choose theme" });
    expect(button(fixture).getAttribute("aria-label")).toBe("Choose theme");
    expect(list(fixture).getAttribute("aria-label")).toBe("Choose theme");
  });

  test("§7.3 one option per theme; the hidden input carries the supplied name", async () => {
    const fixture = await mountSettled({ name: "appearance" });
    expect(options(fixture).length).toBe(THEMES.length);
    const hidden = q<HTMLInputElement>(fixture, 'input[type="hidden"]');
    expect(hidden.name).toBe("appearance");
    expect(hidden.value).toBe("light");
  });

  test("§7.3 option ids are unique per instance", () => {
    const a = mount();
    const b = mount();
    const idsA = options(a).map((o) => o.id);
    const idsB = options(b).map((o) => o.id);
    expect(new Set([...idsA, ...idsB]).size).toBe(idsA.length + idsB.length);
    expect(idsA.every((id) => id.length > 0)).toBe(true);
  });

  test("§7.4 the listbox is hidden until the button is activated", () => {
    const fixture = mount();
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
    click(fixture, button(fixture));
    expect(list(fixture).hasAttribute("hidden")).toBe(false);
    expect(button(fixture).getAttribute("aria-expanded")).toBe("true");
  });

  test("§7.4 the active theme is the aria-selected option", async () => {
    const fixture = await mountSettled();
    click(fixture, button(fixture));
    const selected = fixture.nativeElement.querySelectorAll(
      '[role="option"][aria-selected="true"]',
    ) as NodeListOf<HTMLElement>;
    expect(selected.length).toBe(1);
    expect(selected[0].textContent?.trim()).toBe("Light");
  });

  test("§7.4 the active option carries data-active while open", () => {
    const fixture = mount();
    click(fixture, button(fixture));
    const active = fixture.nativeElement.querySelectorAll(
      ".theme-chooser-option[data-active]",
    ) as NodeListOf<HTMLElement>;
    expect(active.length).toBe(1);
  });

  test("§7.5 default labels title-case the slug (no 'default' string)", () => {
    const fixture = mount({ themes: ["light", "dark"] });
    const text = (fixture.nativeElement.textContent ?? "") as string;
    expect(text).toMatch(/Light/);
    expect(text).toMatch(/Dark/);
    expect(text).not.toMatch(/default/i);
  });

  test("§7.5 themeLabels override the default title-case label", () => {
    const fixture = mount({
      themes: ["light", "dark"],
      themeLabels: { light: "Bright", dark: "Midnight" },
    });
    const text = (fixture.nativeElement.textContent ?? "") as string;
    expect(text).toMatch(/Bright/);
    expect(text).toMatch(/Midnight/);
  });
});

describe("ThemeChooser — keyboard contract (APG listbox, §7.14–§7.18)", () => {
  async function openWith(key: string): Promise<ComponentFixture<ThemeChooser>> {
    const fixture = await mountSettled();
    press(fixture, button(fixture), key);
    await flush();
    fixture.detectChanges();
    return fixture;
  }

  test("§7.14 ArrowDown, Enter and Space all open the listbox", async () => {
    for (const key of ["ArrowDown", "Enter", " "]) {
      const fixture = await openWith(key);
      expect(list(fixture).hasAttribute("hidden")).toBe(false);
      expect(button(fixture).getAttribute("aria-expanded")).toBe("true");
    }
  });

  test("§7.14 opening puts the active descendant on the selected theme", async () => {
    const fixture = await openWith("ArrowDown");
    // "light" resolves as the initial theme, so it is index 0.
    expect(list(fixture).getAttribute("aria-activedescendant")).toBe(
      list(fixture).children[0].id,
    );
  });

  test("§7.14 ArrowUp opens with the last option active", async () => {
    const fixture = await openWith("ArrowUp");
    expect(list(fixture).getAttribute("aria-activedescendant")).toBe(
      list(fixture).children[THEMES.length - 1].id,
    );
  });

  test("§7.14 opening moves focus to the listbox", async () => {
    const fixture = await openWith("ArrowDown");
    expect(document.activeElement).toBe(list(fixture));
  });

  test("§7.15 ArrowDown / ArrowUp move the active descendant and clamp", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[0].id);
    press(fixture, ul, "ArrowDown");
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[1].id);
    press(fixture, ul, "ArrowUp");
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[0].id);
    // Clamps at the top rather than wrapping.
    press(fixture, ul, "ArrowUp");
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[0].id);
  });

  test("§7.15 ArrowDown clamps at the last option", async () => {
    const fixture = await openWith("ArrowUp");
    const ul = list(fixture);
    press(fixture, ul, "ArrowDown");
    expect(ul.getAttribute("aria-activedescendant")).toBe(
      ul.children[THEMES.length - 1].id,
    );
  });

  test("§7.15 Home and End jump to the first and last option", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "End");
    expect(ul.getAttribute("aria-activedescendant")).toBe(
      ul.children[THEMES.length - 1].id,
    );
    press(fixture, ul, "Home");
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[0].id);
  });

  test("§7.16 Enter selects the active option, applies it, and closes", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "ArrowDown");
    press(fixture, ul, "Enter");
    await flush();
    fixture.detectChanges();
    expect(ul.hasAttribute("hidden")).toBe(true);
    expect(button(fixture).getAttribute("aria-expanded")).toBe("false");
    expect(document.documentElement.dataset["theme"]).toBe("dark");
  });

  test("§7.16 Enter returns focus to the button", async () => {
    const fixture = await openWith("ArrowDown");
    press(fixture, list(fixture), "Enter");
    await flush();
    fixture.detectChanges();
    expect(document.activeElement).toBe(button(fixture));
  });

  test("§7.16 Space selects the active option and closes", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "ArrowDown");
    press(fixture, ul, " ");
    await flush();
    fixture.detectChanges();
    expect(ul.hasAttribute("hidden")).toBe(true);
    expect(document.documentElement.dataset["theme"]).toBe("dark");
  });

  test("§7.17 Escape closes without changing the theme", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "ArrowDown");
    press(fixture, ul, "Escape");
    await flush();
    fixture.detectChanges();
    expect(ul.hasAttribute("hidden")).toBe(true);
    expect(document.documentElement.dataset["theme"]).toBe("light");
  });

  test("§7.17 Escape returns focus to the button", async () => {
    const fixture = await openWith("ArrowDown");
    press(fixture, list(fixture), "Escape");
    await flush();
    fixture.detectChanges();
    expect(document.activeElement).toBe(button(fixture));
  });

  test("§7.17 Tab closes without stealing focus back to the button", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "Tab");
    await flush();
    fixture.detectChanges();
    expect(ul.hasAttribute("hidden")).toBe(true);
    // Focus is left where it was for the browser's own Tab handling to
    // move it on; the component must not pull it back to the button.
    expect(document.activeElement).not.toBe(button(fixture));
    expect(document.activeElement).toBe(ul);
  });

  test("§7.18 typeahead moves the active descendant by label prefix", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "a");
    // "Abyss" is index 2 in THEMES.
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[2].id);
  });

  test("§7.18 the typeahead buffer resets after the 500 ms pause", async () => {
    vi.useFakeTimers();
    try {
      const fixture = mount();
      press(fixture, button(fixture), "ArrowDown");
      const ul = list(fixture);
      press(fixture, ul, "d");
      expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[1].id);
      // Without a reset, "d" + "a" would match nothing; after the pause
      // the buffer is empty so "a" alone matches "Abyss".
      vi.advanceTimersByTime(600);
      press(fixture, ul, "a");
      expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[2].id);
    } finally {
      vi.useRealTimers();
    }
  });

  test("§7.18 clicking an option selects and applies it", async () => {
    const fixture = await mountSettled();
    await pick(fixture, "abyss");
    expect(document.documentElement.dataset["theme"]).toBe("abyss");
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
  });

  test("§7.18 clicking outside the root closes the listbox", async () => {
    const fixture = await mountSettled();
    click(fixture, button(fixture));
    expect(list(fixture).hasAttribute("hidden")).toBe(false);
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    fixture.detectChanges();
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
  });
});

describe("ThemeChooser — dynamic loading (§5, §7.6–§7.11)", () => {
  test("§7.6 default initial value is 'light' when present in themes", async () => {
    await mountSettled();
    expect(document.documentElement.dataset["theme"]).toBe("light");
  });

  test("§7.6 default initial value falls back to themes[0] when 'light' is absent", async () => {
    await mountSettled({ themes: ["dark", "abyss"] });
    expect(document.documentElement.dataset["theme"]).toBe("dark");
  });

  test("§7.7 injects a managed <link> with the resolved href", async () => {
    await mountSettled();
    const link = getManagedLink();
    expect(link).not.toBeNull();
    expect(link!.rel).toBe("stylesheet");
    expect(link!.href.endsWith("/assets/themes/light.css")).toBe(true);
  });

  test("§7.8 selecting an option updates href, data-theme, and emits themeChange", async () => {
    const fixture = await mountSettled();
    const onChange = vi.fn();
    fixture.componentInstance.themeChange.subscribe(onChange);
    await pick(fixture, "abyss");
    expect(document.documentElement.dataset["theme"]).toBe("abyss");
    expect(getManagedLink()!.href.endsWith("/assets/themes/abyss.css")).toBe(true);
    expect(onChange).toHaveBeenCalledWith("abyss");
  });

  test("§7.8 the hidden input tracks the selected value", async () => {
    const fixture = await mountSettled();
    await pick(fixture, "abyss");
    expect(q<HTMLInputElement>(fixture, 'input[type="hidden"]').value).toBe("abyss");
  });

  test("§7.8 name discriminates the managed <link>", async () => {
    await mountSettled({ name: "appearance" });
    expect(getManagedLink("appearance")).not.toBeNull();
    expect(getManagedLink("theme")).toBeNull();
  });

  test("§7.9 persists to localStorage and reads back on a fresh mount", async () => {
    const fixture = await mountSettled({ storageKey: "lily-theme" });
    await pick(fixture, "dark");
    expect(localStorage.getItem("lily-theme")).toBe("dark");
    fixture.destroy();

    document.documentElement.removeAttribute("data-theme");
    document.head
      .querySelectorAll("link[data-lily-theme-chooser]")
      .forEach((n) => n.remove());

    await mountSettled({ storageKey: "lily-theme" });
    expect(document.documentElement.dataset["theme"]).toBe("dark");
  });

  test("§7.10 a supplied value input wins over storage and defaults", async () => {
    localStorage.setItem("lily-theme", "abyss");
    await mountSettled({ value: "light", storageKey: "lily-theme" });
    expect(document.documentElement.dataset["theme"]).toBe("light");
  });

  test("§7.11 missing trailing slash on themesUrl still yields one slash", async () => {
    await mountSettled({ themesUrl: URL_NO_TRAILING });
    expect(getManagedLink()!.href.endsWith("/assets/themes/light.css")).toBe(true);
  });

  test("§7.11 a custom target receives data-theme", async () => {
    const target = document.createElement("section");
    document.body.appendChild(target);
    await mountSettled({ target });
    expect(target.getAttribute("data-theme")).toBe("light");
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
    target.remove();
  });
});

@Component({
  standalone: true,
  imports: [ThemeChooser],
  template: `
    <lily-theme-chooser
      label="Theme"
      [themesUrl]="url"
      [themes]="themes"
      [value]="'dark'"
    >
      <ng-template let-args>
        <span
          data-testid="custom"
          [attr.data-open]="args.open"
          [attr.data-value]="args.value"
          [attr.data-label-light]="args.labelFor('light')"
          >custom glyph</span
        >
      </ng-template>
    </lily-theme-chooser>
  `,
})
class IconTemplateHost {
  readonly url = URL_TRAILING;
  readonly themes = THEMES;
}

describe("ThemeChooser — custom icon template (§7.12–§7.13)", () => {
  test("§7.12 className is appended to the root div", () => {
    const fixture = mount({ className: "extra" });
    expect(q<HTMLElement>(fixture, ".theme-chooser").classList.contains("extra")).toBe(
      true,
    );
  });

  test("§7.13 a projected ng-template replaces the glyph and receives ChildArgs", async () => {
    const fixture = TestBed.createComponent(IconTemplateHost);
    fixture.detectChanges();
    fixtures.push(fixture);
    await flush();
    fixture.detectChanges();

    const custom = q<HTMLElement>(fixture, '[data-testid="custom"]');
    expect(custom).toBeTruthy();
    // The custom glyph replaces the default half-circle inside the button.
    expect(custom.closest("button")?.className).toContain("theme-chooser-button");
    expect(fixture.nativeElement.querySelector(".theme-chooser-icon")).toBeNull();
    expect(custom.getAttribute("data-open")).toBe("false");
    expect(custom.getAttribute("data-value")).toBe("dark");
    expect(custom.getAttribute("data-label-light")).toBe("Light");
  });
});


// ---------------------------------------------------------------
// System-preference detection (§7.20) and the exported label resolver.
//
// jsdom does not implement window.matchMedia, so every test that needs
// a colour-scheme preference installs its own stub and removes it
// afterwards. That absence is itself a case worth asserting: it is the
// same shape as SSR, where matchSystemTheme must return "" rather than
// throw.
// ---------------------------------------------------------------

type MatchMediaHost = { matchMedia?: (query: string) => MediaQueryList };

/** Install a matchMedia stub reporting the given colour-scheme preference. */
function stubMatchMedia(prefersDark: boolean): void {
  (window as unknown as MatchMediaHost).matchMedia = (query: string) =>
    ({
      media: query,
      matches: prefersDark && query.includes("prefers-color-scheme: dark"),
    }) as MediaQueryList;
}

/** Remove the stub, restoring jsdom's (absent) matchMedia. */
function clearMatchMedia(): void {
  delete (window as unknown as MatchMediaHost).matchMedia;
}

describe("ThemeChooser — themeName (§7.19)", () => {
  test("themeName title-cases each hyphen-separated word", () => {
    expect(themeName("high-contrast")).toBe("High Contrast");
    expect(themeName("light")).toBe("Light");
  });

  test("themeName handles a long multi-word slug", () => {
    expect(
      themeName("united-kingdom-national-health-service-england-for-patients"),
    ).toBe("United Kingdom National Health Service England For Patients");
  });

  test("labelFor delegates to themeName so there is one implementation", async () => {
    const fixture = await mountSettled();
    expect(fixture.componentInstance.labelFor("high-contrast")).toBe(
      themeName("high-contrast"),
    );
  });

  test("themeLabels still override themeName", async () => {
    const fixture = await mountSettled({ themeLabels: { dark: "Night" } });
    expect(fixture.componentInstance.labelFor("dark")).toBe("Night");
  });
});

describe("ThemeChooser — matchSystemTheme (§7.20)", () => {
  afterEach(() => clearMatchMedia());

  test("resolves dark when the OS prefers a dark colour scheme", () => {
    stubMatchMedia(true);
    expect(matchSystemTheme(THEMES)).toBe("dark");
  });

  test("resolves light when the OS does not prefer dark", () => {
    stubMatchMedia(false);
    expect(matchSystemTheme(THEMES)).toBe("light");
  });

  test('returns "" when the preferred slug is not in themes', () => {
    stubMatchMedia(true);
    expect(matchSystemTheme(["abyss", "solarized"])).toBe("");
    stubMatchMedia(false);
    expect(matchSystemTheme(["abyss", "solarized"])).toBe("");
  });

  test('returns "" when matchMedia is unavailable (SSR)', () => {
    clearMatchMedia();
    expect(matchSystemTheme(THEMES)).toBe("");
  });
});

describe("ThemeChooser — detectFromSystem (§7.20)", () => {
  afterEach(() => clearMatchMedia());

  test("detectFromSystem resolves the initial theme from the OS preference", async () => {
    stubMatchMedia(true);
    await mountSettled({ detectFromSystem: true });
    expect(document.documentElement.dataset["theme"]).toBe("dark");
  });

  test("detection is off unless opted in", async () => {
    stubMatchMedia(true);
    await mountSettled();
    // Without detectFromSystem the resolution falls through to "light".
    expect(document.documentElement.dataset["theme"]).toBe("light");
  });

  test("storage still beats detection", async () => {
    stubMatchMedia(true);
    localStorage.setItem("lily-theme", "abyss");
    await mountSettled({ detectFromSystem: true, storageKey: "lily-theme" });
    expect(document.documentElement.dataset["theme"]).toBe("abyss");
  });

  test("an explicit value still beats detection", async () => {
    stubMatchMedia(true);
    await mountSettled({ detectFromSystem: true, value: "abyss" });
    expect(document.documentElement.dataset["theme"]).toBe("abyss");
  });

  test("detection falls through to defaultValue when the OS slug is absent", async () => {
    stubMatchMedia(true);
    await mountSettled({
      detectFromSystem: true,
      themes: ["abyss", "solarized"],
      defaultValue: "solarized",
    });
    expect(document.documentElement.dataset["theme"]).toBe("solarized");
  });
});
