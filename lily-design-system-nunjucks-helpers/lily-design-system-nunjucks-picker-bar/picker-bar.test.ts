// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import {
  autoInit,
  initPickerBar,
  DEFAULT_THEMES,
  DEFAULT_SIZES,
} from "./picker-bar.client.js";

// ---------------------------------------------------------------------
// Nunjucks env that can resolve both "./picker-bar.njk" (this package)
// and the four sibling packages' "lily-design-system-nunjucks-*-picker/
// dist/*.njk" templates. The catalog root is the second search path so
// a bare "lily-design-system-nunjucks-theme-picker/dist/theme-picker.njk"
// resolves the same way it would from an installed node_modules — see
// picker-bar.njk's own header comment.
// ---------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogRoot = path.join(__dirname, "..");
const env = nunjucks.configure([__dirname, catalogRoot], {
  autoescape: true,
  throwOnUndefined: false,
  trimBlocks: true,
  lstripBlocks: true,
});

const LABELS = {
  theme: "Theme",
  locale: "Language",
  textSize: "Text size",
  share: "Share",
};
const THEMES_URL = "/assets/themes/";
const LOCALES = ["en", "cy"];

function renderMacro(opts: Record<string, unknown>): string {
  const src =
    `{% from "./picker-bar.njk" import pickerBar %}` + `{{ pickerBar(opts) }}`;
  return env.renderString(src, { opts });
}

function mountIntoBody(html: string): HTMLElement {
  document.body.innerHTML = html;
  return document.body.querySelector(
    "[data-lily-picker-bar-root]",
  ) as HTMLElement;
}

function setup(opts: Record<string, unknown> = {}) {
  const root = mountIntoBody(
    renderMacro({
      labels: LABELS,
      themesUrl: THEMES_URL,
      locales: LOCALES,
      ...opts,
    }),
  );
  const controller = initPickerBar(root);
  return { root, controller };
}

function click(el: Element) {
  el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
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
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("lang");
  document.documentElement.removeAttribute("dir");
  document.documentElement.removeAttribute("data-text-size");
});

describe("PickerBar — DEFAULT_THEMES / DEFAULT_SIZES agree with the macro (§3, §5.1, §5.2)", () => {
  test("client.js DEFAULT_THEMES has 45 entries and matches the macro's rendered option order", () => {
    expect(DEFAULT_THEMES).toHaveLength(45);
    const html = renderMacro({ labels: LABELS, themesUrl: THEMES_URL, locales: LOCALES });
    document.body.innerHTML = html;
    const values = Array.from(
      document.querySelectorAll(".theme-picker-option"),
    ).map((el) => el.getAttribute("data-value"));
    expect(values).toEqual(DEFAULT_THEMES);
  });

  test("is alphabetical, with the UK & US themes moved to the bottom as one alphabetical group", () => {
    const nonUkUs = DEFAULT_THEMES.filter((t) => !t.startsWith("united-"));
    const ukUs = DEFAULT_THEMES.filter((t) => t.startsWith("united-"));
    expect(nonUkUs).toEqual([...nonUkUs].sort());
    expect(ukUs).toEqual([...ukUs].sort());
    expect(DEFAULT_THEMES).toEqual([...nonUkUs, ...ukUs]);
  });

  test("client.js DEFAULT_SIZES matches the macro's rendered option order, largest first", () => {
    expect(DEFAULT_SIZES).toEqual([
      "largest",
      "larger",
      "large",
      "normal",
      "small",
      "smaller",
      "smallest",
    ]);
    const html = renderMacro({ labels: LABELS, themesUrl: THEMES_URL, locales: LOCALES });
    document.body.innerHTML = html;
    const values = Array.from(
      document.querySelectorAll(".text-size-picker-option"),
    ).map((el) => el.getAttribute("data-value"));
    expect(values).toEqual(DEFAULT_SIZES);
  });
});

describe("PickerBar — composition (§4, §7.1–§7.4)", () => {
  test("§7.1 renders the root with the base class plus the consumer's class", () => {
    const { root } = setup({ classes: "my-picker-bar" });
    expect(root.classList.contains("picker-bar")).toBe(true);
    expect(root.classList.contains("my-picker-bar")).toBe(true);
    expect(root.hasAttribute("data-lily-picker-bar-root")).toBe(true);
  });

  test("§7.2 renders all four pickers, each named from `labels`", () => {
    const { root } = setup();
    expect(
      root.querySelector(".theme-picker-button")?.getAttribute("aria-label"),
    ).toBe("Theme");
    expect(
      root.querySelector(".locale-picker-button")?.getAttribute("aria-label"),
    ).toBe("Language");
    expect(
      root
        .querySelector(".text-size-picker-button")
        ?.getAttribute("aria-label"),
    ).toBe("Text size");
    expect(
      root.querySelector(".share-picker-button")?.getAttribute("aria-label"),
    ).toBe("Share");
  });

  test("§7.2 renders the four picker roots in theme, locale, text-size, share order", () => {
    const { root } = setup();
    const roots = Array.from(
      root.querySelectorAll(
        ":scope > [data-lily-theme-picker-root], :scope > [data-lily-locale-picker-root], :scope > [data-lily-text-size-picker-root], :scope > [data-lily-share-picker-root]",
      ),
    ).map((el) => el.className.split(" ")[0]);
    expect(roots).toEqual([
      "theme-picker",
      "locale-picker",
      "text-size-picker",
      "share-picker",
    ]);
  });

  test("§7.5 spreads extra attributes onto the root", () => {
    const { root } = setup({ attributes: { "data-testid": "header-picker-bar" } });
    expect(root.getAttribute("data-testid")).toBe("header-picker-bar");
  });
});

describe("PickerBar — theme-picker wiring (§5.1, §7.3, §7.6)", () => {
  test("§7.3 forwards themesUrl and uses DEFAULT_THEMES when `themes` is omitted", () => {
    const { root } = setup();
    const options = root.querySelectorAll(".theme-picker-option");
    expect(options).toHaveLength(45);
    expect(options[0].textContent?.trim()).toBe("Abyss");
    expect(
      root
        .querySelector("[data-lily-theme-picker-root]")
        ?.getAttribute("data-lily-theme-picker-themes-url"),
    ).toBe(THEMES_URL);
  });

  test("§7.6 an explicit `themes` prop overrides the default", () => {
    const { root } = setup({ themes: ["light", "dark"] });
    expect(root.querySelectorAll(".theme-picker-option")).toHaveLength(2);
  });

  test("§7.7 `themeProps` reaches ThemePicker (storageKey persists a selection)", async () => {
    const { root } = setup({ themeProps: { storageKey: "lily-theme" } });
    const button = root.querySelector(
      ".theme-picker-button",
    ) as HTMLButtonElement;
    click(button);
    const option = root.querySelector(".theme-picker-option") as HTMLElement;
    click(option);
    expect(localStorage.getItem("lily-theme")).toBe("abyss");
  });
});

describe("PickerBar — locale-picker wiring (§5.2, §7.4)", () => {
  test("§7.4 forwards the required `locales` list", () => {
    const { root } = setup();
    expect(root.querySelectorAll(".locale-picker-option")).toHaveLength(
      LOCALES.length,
    );
  });
});

describe("PickerBar — text-size-picker wiring (§5.3, §7.8, §7.9)", () => {
  test("§7.8 uses DEFAULT_SIZES when `sizes` is omitted, in largest-to-smallest order", () => {
    const { root } = setup();
    const options = Array.from(
      root.querySelectorAll(".text-size-picker-option"),
    ).map((el) => el.textContent?.trim());
    expect(options).toEqual([
      "Largest",
      "Larger",
      "Large",
      "Normal",
      "Small",
      "Smaller",
      "Smallest",
    ]);
  });

  test("§7.9 defaults the initial (server-resolved) value to 'normal'", () => {
    const { root } = setup();
    const input = root.querySelector(
      "[data-lily-text-size-picker-input]",
    ) as HTMLInputElement;
    expect(input.value).toBe("normal");
  });

  test("§7.9 `textSizeProps.defaultValue` overrides the built-in 'normal' default", () => {
    const { root } = setup({ textSizeProps: { defaultValue: "small" } });
    const input = root.querySelector(
      "[data-lily-text-size-picker-input]",
    ) as HTMLInputElement;
    expect(input.value).toBe("small");
  });
});

describe("PickerBar — share-picker wiring (§5.4, §7.10)", () => {
  test("§7.10 forwards `shareTargets` to SharePicker's list", () => {
    const { root } = setup({
      shareTargets: [
        { id: "email", label: "Email", href: "mailto:?body=x" },
      ],
    });
    expect(root.querySelector(".share-picker-target")?.textContent?.trim()).toBe(
      "Email",
    );
  });
});

describe("PickerBar — autoInit (§4.3)", () => {
  test("wires every [data-lily-picker-bar-root] on the page", () => {
    document.body.innerHTML =
      renderMacro({ labels: LABELS, themesUrl: THEMES_URL, locales: LOCALES }) +
      renderMacro({ labels: LABELS, themesUrl: THEMES_URL, locales: LOCALES });
    const controllers = autoInit();
    expect(controllers).toHaveLength(2);
    expect(controllers[0].theme).not.toBeNull();
    expect(controllers[0].locale).not.toBeNull();
    expect(controllers[0].textSize).not.toBeNull();
    expect(controllers[0].share).not.toBeNull();
  });
});
