import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ThemePicker, normaliseThemesUrl, themeHref } from "./theme-picker.component";

const THEMES = ["light", "dark", "abyss"];
const URL_TRAILING = "/assets/themes/";
const URL_NO_TRAILING = "/assets/themes";

function getManagedLink(name = "theme"): HTMLLinkElement | null {
  return document.head.querySelector<HTMLLinkElement>(
    `link[data-lily-theme-picker="${name}"]`,
  );
}

function flush(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}

beforeEach(() => {
  document.documentElement.removeAttribute("data-theme");
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
  document.documentElement.removeAttribute("data-theme");
});

describe("ThemePicker — pure helpers (§7.13)", () => {
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

describe("ThemePicker — markup contract (§7.1–§7.5, §7.12)", () => {
  test("§7.1 renders a fieldset with role=radiogroup", () => {
    const fixture = TestBed.createComponent(ThemePicker);
    fixture.componentRef.setInput("label", "Theme");
    fixture.componentRef.setInput("themesUrl", URL_TRAILING);
    fixture.componentRef.setInput("themes", THEMES);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("fieldset.theme-picker");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("radiogroup");
  });

  test("§7.2 aria-label is the supplied label", () => {
    const fixture = TestBed.createComponent(ThemePicker);
    fixture.componentRef.setInput("label", "Choose theme");
    fixture.componentRef.setInput("themesUrl", URL_TRAILING);
    fixture.componentRef.setInput("themes", THEMES);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("fieldset.theme-picker");
    expect(el.getAttribute("aria-label")).toBe("Choose theme");
  });

  test("§7.3 one radio per theme, sharing the supplied name", () => {
    const fixture = TestBed.createComponent(ThemePicker);
    fixture.componentRef.setInput("label", "Theme");
    fixture.componentRef.setInput("themesUrl", URL_TRAILING);
    fixture.componentRef.setInput("themes", THEMES);
    fixture.componentRef.setInput("name", "appearance");
    fixture.detectChanges();
    const radios = fixture.nativeElement.querySelectorAll(
      'input[type="radio"]',
    ) as NodeListOf<HTMLInputElement>;
    expect(radios.length).toBe(3);
    expect(Array.from(radios).every((r) => r.name === "appearance")).toBe(true);
  });

  test("§7.4 each radio carries the slug as its value", () => {
    const fixture = TestBed.createComponent(ThemePicker);
    fixture.componentRef.setInput("label", "Theme");
    fixture.componentRef.setInput("themesUrl", URL_TRAILING);
    fixture.componentRef.setInput("themes", THEMES);
    fixture.detectChanges();
    const radios = fixture.nativeElement.querySelectorAll(
      'input[type="radio"]',
    ) as NodeListOf<HTMLInputElement>;
    expect(Array.from(radios).map((r) => r.value)).toEqual(THEMES);
  });

  test("§7.5 default labels title-case the slug (no 'default' string)", () => {
    const fixture = TestBed.createComponent(ThemePicker);
    fixture.componentRef.setInput("label", "Theme");
    fixture.componentRef.setInput("themesUrl", URL_TRAILING);
    fixture.componentRef.setInput("themes", ["light", "dark"]);
    fixture.detectChanges();
    const text = (fixture.nativeElement.textContent ?? "") as string;
    expect(text).toMatch(/Light/);
    expect(text).toMatch(/Dark/);
    expect(text).not.toMatch(/default/i);
  });

  test("§7.5 themeLabels override the default title-case label", () => {
    const fixture = TestBed.createComponent(ThemePicker);
    fixture.componentRef.setInput("label", "Theme");
    fixture.componentRef.setInput("themesUrl", URL_TRAILING);
    fixture.componentRef.setInput("themes", ["light", "dark"]);
    fixture.componentRef.setInput("themeLabels", {
      light: "Bright",
      dark: "Midnight",
    });
    fixture.detectChanges();
    const text = (fixture.nativeElement.textContent ?? "") as string;
    expect(text).toMatch(/Bright/);
    expect(text).toMatch(/Midnight/);
  });

  test("§7.12 className is appended to the root fieldset", () => {
    const fixture = TestBed.createComponent(ThemePicker);
    fixture.componentRef.setInput("label", "Theme");
    fixture.componentRef.setInput("themesUrl", URL_TRAILING);
    fixture.componentRef.setInput("themes", THEMES);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("fieldset.theme-picker");
    expect(el.classList.contains("extra")).toBe(true);
  });
});

describe("ThemePicker — dynamic loading (§7.6–§7.11)", () => {
  test("§7.6 default initial value is 'light' when present in themes", async () => {
    const fixture = TestBed.createComponent(ThemePicker);
    fixture.componentRef.setInput("label", "Theme");
    fixture.componentRef.setInput("themesUrl", URL_TRAILING);
    fixture.componentRef.setInput("themes", THEMES);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(document.documentElement.dataset["theme"]).toBe("light");
  });

  test("§7.6 default initial value falls back to themes[0] when 'light' is absent", async () => {
    const fixture = TestBed.createComponent(ThemePicker);
    fixture.componentRef.setInput("label", "Theme");
    fixture.componentRef.setInput("themesUrl", URL_TRAILING);
    fixture.componentRef.setInput("themes", ["dark", "abyss"]);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(document.documentElement.dataset["theme"]).toBe("dark");
  });

  test("§7.7 injects a managed <link> with the resolved href", async () => {
    const fixture = TestBed.createComponent(ThemePicker);
    fixture.componentRef.setInput("label", "Theme");
    fixture.componentRef.setInput("themesUrl", URL_TRAILING);
    fixture.componentRef.setInput("themes", THEMES);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    const link = getManagedLink();
    expect(link).not.toBeNull();
    expect(link!.rel).toBe("stylesheet");
    expect(link!.href.endsWith("/assets/themes/light.css")).toBe(true);
  });

  test("§7.8 selecting a radio updates href, data-theme, and emits themeChange", async () => {
    const fixture = TestBed.createComponent(ThemePicker);
    fixture.componentRef.setInput("label", "Theme");
    fixture.componentRef.setInput("themesUrl", URL_TRAILING);
    fixture.componentRef.setInput("themes", THEMES);
    const onChange = vi.fn();
    fixture.componentInstance.themeChange.subscribe(onChange);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();

    const radios = fixture.nativeElement.querySelectorAll(
      'input[type="radio"]',
    ) as NodeListOf<HTMLInputElement>;
    radios[2].click(); // abyss
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();

    expect(document.documentElement.dataset["theme"]).toBe("abyss");
    expect(getManagedLink()!.href.endsWith("/assets/themes/abyss.css")).toBe(true);
    expect(onChange).toHaveBeenCalledWith("abyss");
  });

  test("§7.9 persists to localStorage and reads back on a fresh mount", async () => {
    const fixture = TestBed.createComponent(ThemePicker);
    fixture.componentRef.setInput("label", "Theme");
    fixture.componentRef.setInput("themesUrl", URL_TRAILING);
    fixture.componentRef.setInput("themes", THEMES);
    fixture.componentRef.setInput("storageKey", "lily-theme");
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();

    const radios = fixture.nativeElement.querySelectorAll(
      'input[type="radio"]',
    ) as NodeListOf<HTMLInputElement>;
    radios[1].click(); // dark
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(localStorage.getItem("lily-theme")).toBe("dark");
    fixture.destroy();

    document.documentElement.removeAttribute("data-theme");
    document.head
      .querySelectorAll("link[data-lily-theme-picker]")
      .forEach((n) => n.remove());

    const f2 = TestBed.createComponent(ThemePicker);
    f2.componentRef.setInput("label", "Theme");
    f2.componentRef.setInput("themesUrl", URL_TRAILING);
    f2.componentRef.setInput("themes", THEMES);
    f2.componentRef.setInput("storageKey", "lily-theme");
    f2.detectChanges();
    await flush();
    f2.detectChanges();
    expect(document.documentElement.dataset["theme"]).toBe("dark");
  });

  test("§7.10 a supplied value input wins over storage and defaults", async () => {
    localStorage.setItem("lily-theme", "abyss");
    const fixture = TestBed.createComponent(ThemePicker);
    fixture.componentRef.setInput("label", "Theme");
    fixture.componentRef.setInput("themesUrl", URL_TRAILING);
    fixture.componentRef.setInput("themes", THEMES);
    fixture.componentRef.setInput("value", "light");
    fixture.componentRef.setInput("storageKey", "lily-theme");
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(document.documentElement.dataset["theme"]).toBe("light");
  });

  test("§7.11 missing trailing slash on themesUrl still yields one slash", async () => {
    const fixture = TestBed.createComponent(ThemePicker);
    fixture.componentRef.setInput("label", "Theme");
    fixture.componentRef.setInput("themesUrl", URL_NO_TRAILING);
    fixture.componentRef.setInput("themes", THEMES);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(getManagedLink()!.href.endsWith("/assets/themes/light.css")).toBe(true);
  });
});
