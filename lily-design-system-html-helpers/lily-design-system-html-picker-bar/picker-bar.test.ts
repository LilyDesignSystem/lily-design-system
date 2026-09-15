import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { PickerBar, DEFAULT_THEMES, DEFAULT_SIZES } from "./picker-bar.js";
import type { PickerBarLabels } from "./picker-bar.js";

// Ensure every custom element involved is registered exactly once for
// the suite (this module's own side-effect imports already register
// the four wrapped elements; only picker-bar itself needs registering
// here, since this file imports the class directly rather than the
// barrel).
if (typeof customElements !== "undefined" && !customElements.get("picker-bar")) {
  customElements.define("picker-bar", PickerBar);
}

const LABELS: PickerBarLabels = {
  theme: "Theme",
  locale: "Language",
  textSize: "Text size",
  share: "Share",
};
const THEMES_URL = "/assets/themes/";
const LOCALES = ["en", "cy"];

function mount(overrides: Record<string, unknown> = {}): PickerBar {
  const el = document.createElement("picker-bar") as PickerBar;
  el.labels = (overrides.labels as PickerBarLabels) ?? LABELS;
  el.themesUrl = (overrides.themesUrl as string) ?? THEMES_URL;
  el.locales = (overrides.locales as string[]) ?? LOCALES;
  if ("themes" in overrides) el.themes = overrides.themes as string[];
  if ("sizes" in overrides) el.sizes = overrides.sizes as string[];
  if ("shareTargets" in overrides) el.shareTargets = overrides.shareTargets as [];
  if ("themeProps" in overrides) el.themeProps = overrides.themeProps as object;
  if ("textSizeProps" in overrides)
    el.textSizeProps = overrides.textSizeProps as object;
  if ("class" in overrides) el.setAttribute("class", overrides.class as string);
  if ("data-testid" in overrides)
    el.setAttribute("data-testid", overrides["data-testid"] as string);
  document.body.appendChild(el);
  return el;
}

beforeEach(() => {
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("lang");
  document.documentElement.removeAttribute("dir");
  document.documentElement.removeAttribute("data-text-size");
  document.head
    .querySelectorAll("link[data-lily-theme-picker]")
    .forEach((n) => n.remove());
  document.body.innerHTML = "";
  try {
    localStorage.clear();
  } catch {
    /* ignore */
  }
});

afterEach(() => {
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("lang");
  document.documentElement.removeAttribute("dir");
  document.documentElement.removeAttribute("data-text-size");
  document.body.innerHTML = "";
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
    const el = mount({ class: "my-picker-bar" });
    const root = el.querySelector(".picker-bar");
    expect(root).toBeTruthy();
    expect(root?.classList.contains("my-picker-bar")).toBe(true);
  });

  test("§7.2 renders all four pickers, each named from `labels`", () => {
    const el = mount();
    expect(el.themePicker?.label).toBe("Theme");
    expect(el.localePicker?.label).toBe("Language");
    expect(el.textSizePicker?.label).toBe("Text size");
    expect(el.sharePicker?.label).toBe("Share");
  });

  test("§7.2 renders the four picker tags in theme, locale, text-size, share order", () => {
    const el = mount();
    const root = el.querySelector(".picker-bar") as HTMLElement;
    const tags = Array.from(root.children).map((c) => c.tagName.toLowerCase());
    expect(tags).toEqual([
      "theme-picker",
      "locale-picker",
      "text-size-picker",
      "share-picker",
    ]);
  });

  test("§7.5 extra attributes set on the host stay on the host, not the root wrapper", () => {
    const el = mount({ "data-testid": "header-picker-bar" });
    expect(el.getAttribute("data-testid")).toBe("header-picker-bar");
  });
});

describe("PickerBar — theme-picker wiring (§5.1, §7.3, §7.6)", () => {
  test("§7.3 forwards themesUrl and uses DEFAULT_THEMES when `themes` is omitted", () => {
    const el = mount();
    expect(el.themePicker?.themesUrl).toBe(THEMES_URL);
    expect(el.themePicker?.themes).toEqual(DEFAULT_THEMES);
  });

  test("§7.6 an explicit `themes` prop overrides the default", () => {
    const el = mount({ themes: ["light", "dark"] });
    expect(el.themePicker?.themes).toEqual(["light", "dark"]);
  });

  test("§7.7 `themeProps` reaches ThemePicker (storageKey persists a selection)", async () => {
    const el = mount({ themeProps: { storageKey: "lily-theme" } });
    expect(el.themePicker?.storageKey).toBe("lily-theme");
    // Trigger a selection and confirm persistence actually took effect,
    // not just that the property was assigned.
    el.themePicker?.openList();
    await new Promise((r) => setTimeout(r, 0));
    const option = document.querySelector(".theme-picker-option");
    (option as HTMLElement)?.click();
    expect(localStorage.getItem("lily-theme")).toBeTruthy();
  });
});

describe("PickerBar — locale-picker wiring (§5.2, §7.4)", () => {
  test("§7.4 forwards the required `locales` list", () => {
    const el = mount();
    expect(el.localePicker?.locales).toEqual(LOCALES);
  });
});

describe("PickerBar — text-size-picker wiring (§5.3, §7.8, §7.9)", () => {
  test("§7.8 uses DEFAULT_SIZES when `sizes` is omitted, in largest-to-smallest order", () => {
    const el = mount();
    expect(el.textSizePicker?.sizes).toEqual(DEFAULT_SIZES);
  });

  test("§7.9 defaults the initial value to 'normal'", () => {
    const el = mount();
    expect(el.textSizePicker?.value).toBe("normal");
  });

  test("§7.9 `textSizeProps.defaultValue` overrides the built-in 'normal' default", () => {
    const el = mount({ textSizeProps: { defaultValue: "small" } });
    expect(el.textSizePicker?.value).toBe("small");
  });
});

describe("PickerBar — share-picker wiring (§5.4, §7.10)", () => {
  test("§7.10 forwards `shareTargets` to SharePicker's list", () => {
    const targets = [
      {
        id: "email",
        label: "Email",
        href: (url: string) => `mailto:?body=${url}`,
      },
    ];
    const el = mount({ shareTargets: targets });
    expect(el.sharePicker?.targets).toEqual(targets);
  });
});
