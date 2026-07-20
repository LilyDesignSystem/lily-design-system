import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { TestBed } from "@angular/core/testing";

import {
  LocaleSelect,
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

function selectOption(
  select: HTMLSelectElement,
  value: string,
): void {
  select.value = value;
  select.dispatchEvent(new Event("change"));
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
  resetRoot();
});

describe("LocaleSelect — pure helpers (§7.2)", () => {
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

describe("LocaleSelect — markup contract (§7.1)", () => {
  test("§7.1 renders a native <select> root", () => {
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Language");
    fixture.componentRef.setInput("locales", LOCALES);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("select.locale-select");
    expect(el).toBeTruthy();
    expect(el.tagName).toBe("SELECT");
  });

  test("§7.2 aria-label is the supplied label", () => {
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Choose language");
    fixture.componentRef.setInput("locales", LOCALES);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("select.locale-select");
    expect(el.getAttribute("aria-label")).toBe("Choose language");
  });

  test("§7.3 one option per locale; the select carries the supplied name", () => {
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Language");
    fixture.componentRef.setInput("locales", LOCALES);
    fixture.componentRef.setInput("name", "lang");
    fixture.detectChanges();
    const options = fixture.nativeElement.querySelectorAll(
      "option",
    ) as NodeListOf<HTMLOptionElement>;
    // One placeholder option plus one option per locale.
    expect(options.length).toBe(LOCALES.length + 1);
    const select = fixture.nativeElement.querySelector(
      "select.locale-select",
    ) as HTMLSelectElement;
    expect(select.name).toBe("lang");
  });

  test("§7.4 each option carries the locale code as its value, after the empty placeholder", () => {
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Language");
    fixture.componentRef.setInput("locales", LOCALES);
    fixture.detectChanges();
    const options = fixture.nativeElement.querySelectorAll(
      "option",
    ) as NodeListOf<HTMLOptionElement>;
    expect(Array.from(options).map((o) => o.value)).toEqual(["", ...LOCALES]);
  });

  test("§7.5 each option carries lang in BCP 47 hyphen form", () => {
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Language");
    fixture.componentRef.setInput("locales", ["en", "en_US", "zh_Hant_TW"]);
    fixture.detectChanges();
    // Skip index 0: the placeholder is not a locale and carries no lang.
    const options = fixture.nativeElement.querySelectorAll<HTMLElement>(
      ".locale-select-option",
    );
    expect(options[1].getAttribute("lang")).toBe("en");
    expect(options[2].getAttribute("lang")).toBe("en-US");
    expect(options[3].getAttribute("lang")).toBe("zh-Hant-TW");
  });

  test("§7.24 the placeholder option renders the label and stays displayed", async () => {
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Locale");
    fixture.componentRef.setInput("locales", LOCALES);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      "select.locale-select",
    ) as HTMLSelectElement;
    const placeholder = select.querySelector(
      ".locale-select-placeholder",
    ) as HTMLOptionElement;
    expect(placeholder.textContent?.trim()).toBe("Locale");
    expect(placeholder.value).toBe("");
    // The closed control shows the placeholder, not the active locale.
    expect(select.value).toBe("");
    expect(document.documentElement.getAttribute("lang")).toBe("en");
  });

  test("§7.25 the placeholder input overrides the label as placeholder text", () => {
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Choose a locale");
    fixture.componentRef.setInput("placeholder", "Locale");
    fixture.componentRef.setInput("locales", LOCALES);
    fixture.detectChanges();

    const placeholder = fixture.nativeElement.querySelector(
      ".locale-select-placeholder",
    ) as HTMLOptionElement;
    expect(placeholder.textContent?.trim()).toBe("Locale");
    const select = fixture.nativeElement.querySelector(
      "select.locale-select",
    ) as HTMLSelectElement;
    expect(select.getAttribute("aria-label")).toBe("Choose a locale");
  });

  test("§7.26 choosing a locale applies it and snaps the select back to the placeholder", async () => {
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Locale");
    fixture.componentRef.setInput("locales", LOCALES);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      "select.locale-select",
    ) as HTMLSelectElement;
    selectOption(select, LOCALES[1]);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();

    expect(document.documentElement.getAttribute("lang")).toBe(
      LOCALES[1].replace(/_/g, "-"),
    );
    expect(select.value).toBe("");
  });

  test("§7.6 visible option text uses localeLabels override when supplied", () => {
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Language");
    fixture.componentRef.setInput("locales", ["en", "fr"]);
    fixture.componentRef.setInput("localeLabels", {
      en: "English",
      fr: "Français",
    });
    fixture.detectChanges();
    const text = (fixture.nativeElement.textContent ?? "") as string;
    expect(text).toMatch(/English/);
    expect(text).toMatch(/Français/);
  });

  test("§7.6 falls back to defaultLocaleLabels when localeLabels missing", () => {
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Language");
    fixture.componentRef.setInput("locales", ["en_US"]);
    fixture.detectChanges();
    const text = (fixture.nativeElement.textContent ?? "") as string;
    expect(text).toMatch(/English \(United States\)/);
  });
});

describe("LocaleSelect — locale application (§7.3)", () => {
  test("§7.13 sets target.lang to the BCP 47 form of the resolved initial locale", async () => {
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Language");
    fixture.componentRef.setInput("locales", LOCALES);
    fixture.componentRef.setInput("defaultValue", "en_US");
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(document.documentElement.lang).toBe("en-US");
  });

  test("§7.14 sets dir=rtl for an RTL initial locale", async () => {
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Language");
    fixture.componentRef.setInput("locales", ["ar", "en"]);
    fixture.componentRef.setInput("defaultValue", "ar");
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(document.documentElement.dir).toBe("rtl");
  });

  test("§7.14 sets dir=ltr for an LTR initial locale", async () => {
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Language");
    fixture.componentRef.setInput("locales", ["en", "ar"]);
    fixture.componentRef.setInput("defaultValue", "en");
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(document.documentElement.dir).toBe("ltr");
  });

  test("§7.15 when applyDir=false, dir is never written", async () => {
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Language");
    fixture.componentRef.setInput("locales", ["ar", "en"]);
    fixture.componentRef.setInput("defaultValue", "ar");
    fixture.componentRef.setInput("applyDir", false);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(document.documentElement.hasAttribute("dir")).toBe(false);
    expect(document.documentElement.lang).toBe("ar");
  });

  test("§7.16 selecting a different option updates lang, dir, and emits localeChange", async () => {
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Language");
    fixture.componentRef.setInput("locales", LOCALES);
    fixture.componentRef.setInput("defaultValue", "en");
    const onChange = vi.fn();
    fixture.componentInstance.localeChange.subscribe(onChange);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      "select.locale-select",
    ) as HTMLSelectElement;
    selectOption(select, "ar");
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
    expect(onChange).toHaveBeenCalledWith("ar");
  });

  test("§7.16 localeChange receives the consumer-form code (not BCP 47)", async () => {
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Language");
    fixture.componentRef.setInput("locales", LOCALES);
    fixture.componentRef.setInput("defaultValue", "en");
    const onChange = vi.fn();
    fixture.componentInstance.localeChange.subscribe(onChange);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      "select.locale-select",
    ) as HTMLSelectElement;
    selectOption(select, "en_US");
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(onChange).toHaveBeenLastCalledWith("en_US");
    expect(document.documentElement.lang).toBe("en-US");
  });

  test("§7.17 a custom target receives lang and dir", async () => {
    const target = document.createElement("section");
    document.body.appendChild(target);
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Language");
    fixture.componentRef.setInput("locales", ["ar", "en"]);
    fixture.componentRef.setInput("defaultValue", "ar");
    fixture.componentRef.setInput("target", target);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(target.getAttribute("lang")).toBe("ar");
    expect(target.getAttribute("dir")).toBe("rtl");
    expect(document.documentElement.hasAttribute("lang")).toBe(false);
    expect(document.documentElement.hasAttribute("dir")).toBe(false);
    target.remove();
  });
});

describe("LocaleSelect — initial-value resolution (§7.4)", () => {
  test("§7.18 persists to localStorage and reads back on a fresh mount", async () => {
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Language");
    fixture.componentRef.setInput("locales", LOCALES);
    fixture.componentRef.setInput("storageKey", "lily-locale");
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      "select.locale-select",
    ) as HTMLSelectElement;
    selectOption(select, "fr");
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(localStorage.getItem("lily-locale")).toBe("fr");
    fixture.destroy();
    resetRoot();

    const f2 = TestBed.createComponent(LocaleSelect);
    f2.componentRef.setInput("label", "Language");
    f2.componentRef.setInput("locales", LOCALES);
    f2.componentRef.setInput("storageKey", "lily-locale");
    f2.detectChanges();
    await flush();
    f2.detectChanges();
    expect(document.documentElement.lang).toBe("fr");
  });

  test("§7.19 a supplied non-empty value input wins over storage and defaults", async () => {
    localStorage.setItem("lily-locale", "ar");
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Language");
    fixture.componentRef.setInput("locales", LOCALES);
    fixture.componentRef.setInput("value", "en");
    fixture.componentRef.setInput("storageKey", "lily-locale");
    fixture.componentRef.setInput("defaultValue", "fr");
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(document.documentElement.lang).toBe("en");
  });

  test("§7.20 navigator detection resolves exact match", async () => {
    const original = Object.getOwnPropertyDescriptor(window.navigator, "languages");
    Object.defineProperty(window.navigator, "languages", {
      configurable: true,
      get: () => ["fr-CA", "fr"],
    });
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Language");
    fixture.componentRef.setInput("locales", ["en", "fr_CA", "fr"]);
    fixture.componentRef.setInput("detectFromNavigator", true);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(document.documentElement.lang).toBe("fr-CA");
    if (original) Object.defineProperty(window.navigator, "languages", original);
  });

  test("§7.21 navigator detection falls back to language-only match", async () => {
    const original = Object.getOwnPropertyDescriptor(window.navigator, "languages");
    Object.defineProperty(window.navigator, "languages", {
      configurable: true,
      get: () => ["fr-CA"],
    });
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Language");
    fixture.componentRef.setInput("locales", ["en", "fr"]);
    fixture.componentRef.setInput("detectFromNavigator", true);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
    expect(document.documentElement.lang).toBe("fr");
    if (original) Object.defineProperty(window.navigator, "languages", original);
  });
});

describe("LocaleSelect — class hook (§7.5)", () => {
  test("§7.22 className is appended to the root select", () => {
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Language");
    fixture.componentRef.setInput("locales", LOCALES);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("select.locale-select");
    expect(el.classList.contains("extra")).toBe(true);
  });

  test("§7.23 underscored codes yield BCP 47 lang on the option", () => {
    const fixture = TestBed.createComponent(LocaleSelect);
    fixture.componentRef.setInput("label", "Language");
    fixture.componentRef.setInput("locales", ["fr_CA"]);
    fixture.detectChanges();
    // :not(.locale-select-placeholder) skips the leading placeholder option.
    const option = fixture.nativeElement.querySelector<HTMLElement>(
      ".locale-select-option:not(.locale-select-placeholder)",
    );
    expect(option?.getAttribute("lang")).toBe("fr-CA");
  });
});
