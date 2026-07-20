import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  LocaleSelect,
  GLOBE_WITH_MERIDIANS,
  bcp47LocaleTag,
  isRtlLocale,
  localeName,
  matchNavigatorLanguage,
} from "./locale-select.component";

const LOCALES = ["en", "en_US", "fr", "fr_CA", "ar"];

function flush(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}

function resetRoot(): void {
  document.documentElement.removeAttribute("lang");
  document.documentElement.removeAttribute("dir");
}

/** Fixtures created by a test, destroyed after it so listeners unwind. */
let fixtures: ComponentFixture<unknown>[] = [];

/** Create + render a LocaleSelect with the supplied inputs. */
function mount(inputs: Record<string, unknown> = {}): ComponentFixture<LocaleSelect> {
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

/** Mount, let the initial-value effect settle, and re-render. */
async function mountSettled(
  inputs: Record<string, unknown> = {},
): Promise<ComponentFixture<LocaleSelect>> {
  const fixture = mount(inputs);
  await flush();
  fixture.detectChanges();
  return fixture;
}

function q<T extends Element>(fixture: ComponentFixture<unknown>, sel: string): T {
  return fixture.nativeElement.querySelector(sel) as T;
}

function button(fixture: ComponentFixture<unknown>): HTMLButtonElement {
  return q<HTMLButtonElement>(fixture, ".locale-select-button");
}

function list(fixture: ComponentFixture<unknown>): HTMLUListElement {
  return q<HTMLUListElement>(fixture, ".locale-select-list");
}

function options(fixture: ComponentFixture<unknown>): HTMLLIElement[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll(".locale-select-option"),
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

/** Open the listbox and click the option for `code`. */
async function pick(
  fixture: ComponentFixture<unknown>,
  code: string,
  locales: string[] = LOCALES,
): Promise<void> {
  click(fixture, button(fixture));
  click(fixture, options(fixture)[locales.indexOf(code)]);
  await flush();
  fixture.detectChanges();
}

beforeEach(() => {
  resetRoot();
  try {
    localStorage.clear();
  } catch {
    /* ignore */
  }
});

afterEach(() => {
  for (const fixture of fixtures) fixture.destroy();
  fixtures = [];
  resetRoot();
});

describe("LocaleSelect — pure helpers (§7.7–§7.12)", () => {
  test("§7.7 bcp47LocaleTag converts en_US to en-US", () => {
    expect(bcp47LocaleTag("en_US")).toBe("en-US");
  });

  test("§7.8 bcp47LocaleTag converts zh_Hant_TW to zh-Hant-TW", () => {
    expect(bcp47LocaleTag("zh_Hant_TW")).toBe("zh-Hant-TW");
  });

  test("§7.9 bcp47LocaleTag leaves en untouched", () => {
    expect(bcp47LocaleTag("en")).toBe("en");
  });

  test("§7.10 RTL detection for ar, he_IL, and Arabic-script Uzbek", () => {
    expect(isRtlLocale("ar")).toBe(true);
    expect(isRtlLocale("he_IL")).toBe(true);
    expect(isRtlLocale("uz_Arab_AF")).toBe(true);
  });

  test("§7.11 LTR detection for en and fr_CA", () => {
    expect(isRtlLocale("en")).toBe(false);
    expect(isRtlLocale("fr_CA")).toBe(false);
  });

  test("§7.12 localeName resolves en_US via the built-in table", () => {
    expect(localeName("en_US")).toBe("English (United States)");
  });

  test("RTL detection is case-insensitive on script subtag", () => {
    expect(isRtlLocale("uz_arab_af")).toBe(true);
    expect(isRtlLocale("UZ_ARAB_AF")).toBe(true);
  });

  test("matchNavigatorLanguage exact match wins", () => {
    expect(matchNavigatorLanguage(["fr-CA"], ["en", "fr_CA"])).toBe("fr_CA");
  });

  test("matchNavigatorLanguage language-only fallback", () => {
    expect(matchNavigatorLanguage(["fr-CA"], ["en", "fr"])).toBe("fr");
  });

  test("matchNavigatorLanguage returns empty when no match", () => {
    expect(matchNavigatorLanguage(["xx-YY"], ["en", "fr"])).toBe("");
  });
});

describe("LocaleSelect — markup contract (§4.3, §7.1–§7.6)", () => {
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
    const root = q<HTMLElement>(fixture, ".locale-select");
    expect(root.tagName).toBe("DIV");
    expect(root.classList.contains("locale-select")).toBe(true);
    expect(root.classList.contains("extra")).toBe(true);
  });

  test("§7.1 the button renders the globe glyph, hidden from assistive tech", () => {
    const fixture = mount();
    const icon = q<HTMLElement>(fixture, ".locale-select-icon");
    // U+1F310 GLOBE WITH MERIDIANS + U+FE0E VARIATION SELECTOR-15.
    // VS15 forces text presentation so the globe renders monochrome,
    // matching theme-select's U+25D1 rather than the colour-emoji font.
    expect(icon.textContent).toBe("\u{1F310}\uFE0E");
    expect(GLOBE_WITH_MERIDIANS).toBe("\u{1F310}\uFE0E");
    expect(Array.from(GLOBE_WITH_MERIDIANS)).toEqual(["\u{1F310}", "\uFE0E"]);
    expect(icon.getAttribute("aria-hidden")).toBe("true");
  });

  test("§7.2 aria-label names the button and the listbox", () => {
    const fixture = mount({ label: "Choose language" });
    expect(button(fixture).getAttribute("aria-label")).toBe("Choose language");
    expect(list(fixture).getAttribute("aria-label")).toBe("Choose language");
  });

  test("§7.3 one option per locale; the hidden input carries the supplied name", async () => {
    const fixture = await mountSettled({ name: "lang" });
    expect(options(fixture).length).toBe(LOCALES.length);
    const hidden = q<HTMLInputElement>(fixture, 'input[type="hidden"]');
    expect(hidden.name).toBe("lang");
    expect(hidden.value).toBe("en");
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

  test("§7.4 the active locale is the aria-selected option", async () => {
    const fixture = await mountSettled();
    click(fixture, button(fixture));
    const selected = fixture.nativeElement.querySelectorAll(
      '[role="option"][aria-selected="true"]',
    ) as NodeListOf<HTMLElement>;
    expect(selected.length).toBe(1);
    expect(selected[0].getAttribute("lang")).toBe("en");
  });

  test("§7.4 the active option carries data-active while open", () => {
    const fixture = mount();
    click(fixture, button(fixture));
    const active = fixture.nativeElement.querySelectorAll(
      ".locale-select-option[data-active]",
    ) as NodeListOf<HTMLElement>;
    expect(active.length).toBe(1);
  });

  test("§7.5 each option carries lang in BCP 47 hyphen form", () => {
    const fixture = mount({ locales: ["en", "en_US", "zh_Hant_TW"] });
    const opts = options(fixture);
    expect(opts[0].getAttribute("lang")).toBe("en");
    expect(opts[1].getAttribute("lang")).toBe("en-US");
    expect(opts[2].getAttribute("lang")).toBe("zh-Hant-TW");
  });

  test("§7.5 the button and the list carry no lang of their own", () => {
    const fixture = mount();
    expect(button(fixture).hasAttribute("lang")).toBe(false);
    expect(list(fixture).hasAttribute("lang")).toBe(false);
  });

  test("§7.6 visible option text uses localeLabels override when supplied", () => {
    const fixture = mount({
      locales: ["en", "fr"],
      localeLabels: { en: "English", fr: "Français" },
    });
    const text = (fixture.nativeElement.textContent ?? "") as string;
    expect(text).toMatch(/English/);
    expect(text).toMatch(/Français/);
  });

  test("§7.6 falls back to defaultLocaleLabels when localeLabels missing", () => {
    const fixture = mount({ locales: ["en_US"] });
    const text = (fixture.nativeElement.textContent ?? "") as string;
    expect(text).toMatch(/English \(United States\)/);
  });
});

describe("LocaleSelect — keyboard contract (APG listbox, §7.24–§7.28)", () => {
  async function openWith(key: string): Promise<ComponentFixture<LocaleSelect>> {
    const fixture = await mountSettled();
    press(fixture, button(fixture), key);
    await flush();
    fixture.detectChanges();
    return fixture;
  }

  test("§7.24 ArrowDown, Enter and Space all open the listbox", async () => {
    for (const key of ["ArrowDown", "Enter", " "]) {
      const fixture = await openWith(key);
      expect(list(fixture).hasAttribute("hidden")).toBe(false);
      expect(button(fixture).getAttribute("aria-expanded")).toBe("true");
    }
  });

  test("§7.24 opening puts the active descendant on the selected locale", async () => {
    const fixture = await openWith("ArrowDown");
    // "en" resolves as the initial locale, so it is index 0.
    expect(list(fixture).getAttribute("aria-activedescendant")).toBe(
      list(fixture).children[0].id,
    );
  });

  test("§7.24 ArrowUp opens with the last option active", async () => {
    const fixture = await openWith("ArrowUp");
    expect(list(fixture).getAttribute("aria-activedescendant")).toBe(
      list(fixture).children[LOCALES.length - 1].id,
    );
  });

  test("§7.24 opening moves focus to the listbox", async () => {
    const fixture = await openWith("ArrowDown");
    expect(document.activeElement).toBe(list(fixture));
  });

  test("§7.25 ArrowDown / ArrowUp move the active descendant and clamp", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "ArrowDown");
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[1].id);
    press(fixture, ul, "ArrowUp");
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[0].id);
    // Clamps at the top rather than wrapping.
    press(fixture, ul, "ArrowUp");
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[0].id);
  });

  test("§7.25 ArrowDown clamps at the last option", async () => {
    const fixture = await openWith("ArrowUp");
    const ul = list(fixture);
    press(fixture, ul, "ArrowDown");
    expect(ul.getAttribute("aria-activedescendant")).toBe(
      ul.children[LOCALES.length - 1].id,
    );
  });

  test("§7.25 Home and End jump to the first and last option", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "End");
    expect(ul.getAttribute("aria-activedescendant")).toBe(
      ul.children[LOCALES.length - 1].id,
    );
    press(fixture, ul, "Home");
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[0].id);
  });

  test("§7.26 Enter selects the active option, applies it, and closes", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "ArrowDown");
    press(fixture, ul, "Enter");
    await flush();
    fixture.detectChanges();
    expect(ul.hasAttribute("hidden")).toBe(true);
    expect(button(fixture).getAttribute("aria-expanded")).toBe("false");
    expect(document.documentElement.getAttribute("lang")).toBe("en-US");
  });

  test("§7.26 Enter returns focus to the button", async () => {
    const fixture = await openWith("ArrowDown");
    press(fixture, list(fixture), "Enter");
    await flush();
    fixture.detectChanges();
    expect(document.activeElement).toBe(button(fixture));
  });

  test("§7.26 Space selects the active option and closes", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "ArrowDown");
    press(fixture, ul, " ");
    await flush();
    fixture.detectChanges();
    expect(ul.hasAttribute("hidden")).toBe(true);
    expect(document.documentElement.getAttribute("lang")).toBe("en-US");
  });

  test("§7.27 Escape closes without changing the locale", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "ArrowDown");
    press(fixture, ul, "Escape");
    await flush();
    fixture.detectChanges();
    expect(ul.hasAttribute("hidden")).toBe(true);
    expect(document.documentElement.getAttribute("lang")).toBe("en");
  });

  test("§7.27 Escape returns focus to the button", async () => {
    const fixture = await openWith("ArrowDown");
    press(fixture, list(fixture), "Escape");
    await flush();
    fixture.detectChanges();
    expect(document.activeElement).toBe(button(fixture));
  });

  test("§7.27 Tab closes without stealing focus back to the button", async () => {
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

  test("§7.28 typeahead moves the active descendant by label prefix", async () => {
    const fixture = await openWith("ArrowDown");
    const ul = list(fixture);
    press(fixture, ul, "F");
    // "French" is index 2 in LOCALES.
    expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[2].id);
  });

  test("§7.28 the typeahead buffer resets after the 500 ms pause", async () => {
    vi.useFakeTimers();
    try {
      const fixture = mount({ value: "en" });
      press(fixture, button(fixture), "ArrowDown");
      const ul = list(fixture);
      press(fixture, ul, "a");
      // "Arabic" is index 4 in LOCALES.
      expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[4].id);
      // Without a reset, "a" + "f" would match nothing; after the pause
      // the buffer is empty so "f" alone matches "French".
      vi.advanceTimersByTime(600);
      press(fixture, ul, "f");
      expect(ul.getAttribute("aria-activedescendant")).toBe(ul.children[2].id);
    } finally {
      vi.useRealTimers();
    }
  });

  test("§7.28 clicking an option selects and applies it", async () => {
    const fixture = await mountSettled();
    await pick(fixture, "ar");
    expect(document.documentElement.getAttribute("lang")).toBe("ar");
    expect(document.documentElement.getAttribute("dir")).toBe("rtl");
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
  });

  test("§7.28 clicking outside the root closes the listbox", async () => {
    const fixture = await mountSettled();
    click(fixture, button(fixture));
    expect(list(fixture).hasAttribute("hidden")).toBe(false);
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    fixture.detectChanges();
    expect(list(fixture).hasAttribute("hidden")).toBe(true);
  });
});

describe("LocaleSelect — locale application (§5.5, §7.13–§7.17)", () => {
  test("§7.13 sets target.lang to the BCP 47 form of the resolved initial locale", async () => {
    await mountSettled({ defaultValue: "en_US" });
    expect(document.documentElement.lang).toBe("en-US");
  });

  test("§7.14 sets dir=rtl for an RTL initial locale", async () => {
    await mountSettled({ locales: ["ar", "en"], defaultValue: "ar" });
    expect(document.documentElement.dir).toBe("rtl");
  });

  test("§7.14 sets dir=ltr for an LTR initial locale", async () => {
    await mountSettled({ locales: ["en", "ar"], defaultValue: "en" });
    expect(document.documentElement.dir).toBe("ltr");
  });

  test("§7.15 when applyDir=false, dir is never written", async () => {
    await mountSettled({
      locales: ["ar", "en"],
      defaultValue: "ar",
      applyDir: false,
    });
    expect(document.documentElement.hasAttribute("dir")).toBe(false);
    expect(document.documentElement.lang).toBe("ar");
  });

  test("§7.16 selecting a different option updates lang, dir, and emits localeChange", async () => {
    const fixture = await mountSettled({ defaultValue: "en" });
    const onChange = vi.fn();
    fixture.componentInstance.localeChange.subscribe(onChange);
    await pick(fixture, "ar");
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
    expect(onChange).toHaveBeenCalledWith("ar");
  });

  test("§7.16 localeChange receives the consumer-form code (not BCP 47)", async () => {
    const fixture = await mountSettled({ defaultValue: "en" });
    const onChange = vi.fn();
    fixture.componentInstance.localeChange.subscribe(onChange);
    await pick(fixture, "en_US");
    expect(onChange).toHaveBeenLastCalledWith("en_US");
    expect(document.documentElement.lang).toBe("en-US");
  });

  test("§7.16 the hidden input tracks the selected value", async () => {
    const fixture = await mountSettled({ defaultValue: "en" });
    await pick(fixture, "fr");
    expect(q<HTMLInputElement>(fixture, 'input[type="hidden"]').value).toBe("fr");
  });

  test("§7.17 a custom target receives lang and dir", async () => {
    const target = document.createElement("section");
    document.body.appendChild(target);
    await mountSettled({ locales: ["ar", "en"], defaultValue: "ar", target });
    expect(target.getAttribute("lang")).toBe("ar");
    expect(target.getAttribute("dir")).toBe("rtl");
    // Document root must remain untouched.
    expect(document.documentElement.hasAttribute("lang")).toBe(false);
    expect(document.documentElement.hasAttribute("dir")).toBe(false);
    target.remove();
  });
});

describe("LocaleSelect — initial-value resolution (§5.2, §5.3, §7.18–§7.21)", () => {
  test("§7.18 persists to localStorage and reads back on a fresh mount", async () => {
    const fixture = await mountSettled({ storageKey: "lily-locale" });
    await pick(fixture, "fr");
    expect(localStorage.getItem("lily-locale")).toBe("fr");
    fixture.destroy();
    resetRoot();

    await mountSettled({ storageKey: "lily-locale" });
    expect(document.documentElement.lang).toBe("fr");
  });

  test("§7.19 a supplied non-empty value input wins over storage and defaults", async () => {
    localStorage.setItem("lily-locale", "ar");
    await mountSettled({
      value: "en",
      storageKey: "lily-locale",
      defaultValue: "fr",
    });
    expect(document.documentElement.lang).toBe("en");
  });

  test("§7.20 navigator detection resolves exact match", async () => {
    const original = Object.getOwnPropertyDescriptor(window.navigator, "languages");
    Object.defineProperty(window.navigator, "languages", {
      configurable: true,
      get: () => ["fr-CA", "fr"],
    });
    await mountSettled({
      locales: ["en", "fr_CA", "fr"],
      detectFromNavigator: true,
    });
    expect(document.documentElement.lang).toBe("fr-CA");
    if (original) Object.defineProperty(window.navigator, "languages", original);
  });

  test("§7.21 navigator detection falls back to language-only match", async () => {
    const original = Object.getOwnPropertyDescriptor(window.navigator, "languages");
    Object.defineProperty(window.navigator, "languages", {
      configurable: true,
      get: () => ["fr-CA"],
    });
    await mountSettled({ locales: ["en", "fr"], detectFromNavigator: true });
    expect(document.documentElement.lang).toBe("fr");
    if (original) Object.defineProperty(window.navigator, "languages", original);
  });
});

@Component({
  standalone: true,
  imports: [LocaleSelect],
  template: `
    <lily-locale-select label="Language" [locales]="locales" [value]="'fr'">
      <ng-template let-args>
        <span
          data-testid="custom"
          [attr.data-open]="args.open"
          [attr.data-value]="args.value"
          [attr.data-label-en-us]="args.labelFor('en_US')"
          >custom glyph</span
        >
      </ng-template>
    </lily-locale-select>
  `,
})
class IconTemplateHost {
  readonly locales = LOCALES;
}

describe("LocaleSelect — custom icon template (§7.22–§7.23)", () => {
  test("§7.22 className is appended to the root div", () => {
    const fixture = mount({ className: "extra" });
    expect(q<HTMLElement>(fixture, ".locale-select").classList.contains("extra")).toBe(
      true,
    );
  });

  test("§7.23 a projected ng-template replaces the glyph and receives ChildArgs", async () => {
    const fixture = TestBed.createComponent(IconTemplateHost);
    fixture.detectChanges();
    fixtures.push(fixture);
    await flush();
    fixture.detectChanges();

    const custom = q<HTMLElement>(fixture, '[data-testid="custom"]');
    expect(custom).toBeTruthy();
    // The custom glyph replaces the default globe inside the button.
    expect(custom.closest("button")?.className).toContain("locale-select-button");
    expect(fixture.nativeElement.querySelector(".locale-select-icon")).toBeNull();
    expect(custom.getAttribute("data-open")).toBe("false");
    expect(custom.getAttribute("data-value")).toBe("fr");
    expect(custom.getAttribute("data-label-en-us")).toBe("English (United States)");
  });
});
