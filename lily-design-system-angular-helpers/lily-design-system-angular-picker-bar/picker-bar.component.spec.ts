import { ComponentFixture, TestBed } from "@angular/core/testing";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { PickerBar, DEFAULT_THEMES, DEFAULT_SIZES } from "./picker-bar.component";

const LABELS = {
  theme: "Theme",
  locale: "Language",
  textSize: "Text size",
  share: "Share",
};
const THEMES_URL = "/assets/themes/";
const LOCALES = ["en", "cy"];

let fixtures: ComponentFixture<unknown>[] = [];

function mount(inputs: Record<string, unknown> = {}): ComponentFixture<PickerBar> {
  const fixture = TestBed.createComponent(PickerBar);
  fixture.componentRef.setInput("labels", LABELS);
  fixture.componentRef.setInput("themesUrl", THEMES_URL);
  fixture.componentRef.setInput("locales", LOCALES);
  for (const [key, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  fixtures.push(fixture);
  return fixture;
}

function flush(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}

async function mountSettled(
  inputs: Record<string, unknown> = {},
): Promise<ComponentFixture<PickerBar>> {
  const fixture = mount(inputs);
  await flush();
  fixture.detectChanges();
  return fixture;
}

function root(fixture: ComponentFixture<unknown>): HTMLDivElement {
  return fixture.nativeElement.querySelector(".picker-bar") as HTMLDivElement;
}

function button(
  fixture: ComponentFixture<unknown>,
  name: string,
): HTMLButtonElement {
  const buttons = Array.from(
    fixture.nativeElement.querySelectorAll("button"),
  ) as HTMLButtonElement[];
  const found = buttons.find((b) => b.getAttribute("aria-label") === name);
  if (!found) throw new Error(`no button named "${name}"`);
  return found;
}

function click(fixture: ComponentFixture<unknown>, target: HTMLElement): void {
  target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  fixture.detectChanges();
}

beforeEach(() => {
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("lang");
  document.documentElement.removeAttribute("dir");
  document.documentElement.removeAttribute("data-text-size");
  document.head
    .querySelectorAll("link[data-lily-theme-picker]")
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
  document.documentElement.removeAttribute("lang");
  document.documentElement.removeAttribute("dir");
  document.documentElement.removeAttribute("data-text-size");
});

describe("PickerBar — DEFAULT_THEMES (§3, §5.1)", () => {
  test("has all 45 Lily reference theme slugs", () => {
    expect(DEFAULT_THEMES).toHaveLength(45);
  });

  test("is alphabetical, with the UK & US themes moved to the bottom as one alphabetical group", () => {
    const nonUkUs = DEFAULT_THEMES.filter((t) => !t.startsWith("united-"));
    const ukUs = DEFAULT_THEMES.filter((t) => t.startsWith("united-"));
    expect(nonUkUs).toEqual([...nonUkUs].sort());
    expect(ukUs).toEqual([...ukUs].sort());
    expect(DEFAULT_THEMES).toEqual([...nonUkUs, ...ukUs]);
  });

  test("first entry is 'abyss', last is 'united-states-web-design-system'", () => {
    expect(DEFAULT_THEMES[0]).toBe("abyss");
    expect(DEFAULT_THEMES[DEFAULT_THEMES.length - 1]).toBe(
      "united-states-web-design-system",
    );
  });
});

describe("PickerBar — DEFAULT_SIZES (§3, §5.2)", () => {
  test("is the seven-step scale, largest first", () => {
    expect(DEFAULT_SIZES).toEqual([
      "largest",
      "larger",
      "large",
      "normal",
      "small",
      "smaller",
      "smallest",
    ]);
  });
});

describe("PickerBar — composition (§4, §7.1–§7.4)", () => {
  test("§7.1 renders the root with the base class plus the consumer's class", () => {
    const fixture = mount({ className: "my-picker-bar" });
    const el = root(fixture);
    expect(el).toBeTruthy();
    expect(el.classList.contains("my-picker-bar")).toBe(true);
  });

  test("§7.2 renders all four pickers, each named from `labels`", () => {
    const fixture = mount();
    expect(button(fixture, "Theme")).toBeTruthy();
    expect(button(fixture, "Language")).toBeTruthy();
    expect(button(fixture, "Text size")).toBeTruthy();
    expect(button(fixture, "Share")).toBeTruthy();
  });

  test("§7.2 renders the four picker root class hooks in theme, locale, text-size, share order", () => {
    const fixture = mount();
    // Angular does not strip the wrapping custom-element tag in tests, so
    // each picker's own root <div> is a grandchild of .picker-bar, one
    // level inside its <lily-*-picker> host.
    const roots = Array.from(fixture.nativeElement.querySelectorAll(".picker-bar > *"))
      .map((host) => (host as HTMLElement).querySelector("div"))
      .map((div) => div?.className.split(" ")[0]);
    expect(roots).toEqual([
      "theme-picker",
      "locale-picker",
      "text-size-picker",
      "share-picker",
    ]);
  });
});

describe("PickerBar — theme-picker wiring (§5.1, §7.3, §7.6)", () => {
  test("§7.3 forwards themesUrl and uses DEFAULT_THEMES when `themes` is omitted", async () => {
    const fixture = await mountSettled();
    click(fixture, button(fixture, "Theme"));
    const options = fixture.nativeElement.querySelectorAll(
      ".theme-picker-option",
    );
    expect(options).toHaveLength(45);
    expect(options[0].textContent?.trim()).toBe("Abyss");
    expect(options[37].textContent?.trim()).toBe(
      "United Kingdom Government Digital Service",
    );
  });

  test("§7.6 an explicit `themes` prop overrides the default", async () => {
    const fixture = await mountSettled({ themes: ["light", "dark"] });
    click(fixture, button(fixture, "Theme"));
    const options = fixture.nativeElement.querySelectorAll(
      ".theme-picker-option",
    );
    expect(options).toHaveLength(2);
  });

  test("§7.7 `themeStorageKey` reaches ThemePicker (a selection persists)", async () => {
    const fixture = await mountSettled({ themeStorageKey: "lily-theme" });
    click(fixture, button(fixture, "Theme"));
    const options = fixture.nativeElement.querySelectorAll(
      ".theme-picker-option",
    );
    click(fixture, options[0]);
    expect(localStorage.getItem("lily-theme")).toBe("abyss");
  });
});

describe("PickerBar — locale-picker wiring (§5.2, §7.4)", () => {
  test("§7.4 forwards the required `locales` list", async () => {
    const fixture = await mountSettled();
    click(fixture, button(fixture, "Language"));
    const options = fixture.nativeElement.querySelectorAll(
      ".locale-picker-option",
    );
    expect(options).toHaveLength(LOCALES.length);
  });
});

describe("PickerBar — text-size-picker wiring (§5.3, §7.8, §7.9)", () => {
  test("§7.8 uses DEFAULT_SIZES when `sizes` is omitted, in largest-to-smallest order", async () => {
    const fixture = await mountSettled();
    click(fixture, button(fixture, "Text size"));
    const labels = Array.from(
      fixture.nativeElement.querySelectorAll(".text-size-picker-option"),
    ).map((el) => (el as HTMLElement).textContent?.trim());
    expect(labels).toEqual([
      "Largest",
      "Larger",
      "Large",
      "Normal",
      "Small",
      "Smaller",
      "Smallest",
    ]);
  });

  test("§7.9 defaults the initial value to 'normal'", async () => {
    const fixture = await mountSettled();
    const hidden = fixture.nativeElement.querySelector(
      'input[name="text-size"]',
    ) as HTMLInputElement;
    expect(hidden.value).toBe("normal");
  });

  test("§7.9 `textSizeDefaultValue` overrides the built-in 'normal' default", async () => {
    const fixture = await mountSettled({ textSizeDefaultValue: "small" });
    const hidden = fixture.nativeElement.querySelector(
      'input[name="text-size"]',
    ) as HTMLInputElement;
    expect(hidden.value).toBe("small");
  });
});

describe("PickerBar — share-picker wiring (§5.4, §7.10)", () => {
  test("§7.10 forwards `shareTargets` to SharePicker's list", async () => {
    const fixture = await mountSettled({
      shareTargets: [
        {
          id: "email",
          label: "Email",
          href: (url: string) => `mailto:?body=${url}`,
        },
      ],
    });
    click(fixture, button(fixture, "Share"));
    expect(fixture.nativeElement.textContent).toContain("Email");
  });
});
