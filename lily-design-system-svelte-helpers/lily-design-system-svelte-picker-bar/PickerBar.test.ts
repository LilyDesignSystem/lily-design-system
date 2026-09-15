import { render, screen, fireEvent } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import PickerBar, { DEFAULT_THEMES, DEFAULT_SIZES } from "./PickerBar.svelte";

const LABELS = {
  theme: "Theme",
  locale: "Language",
  textSize: "Text size",
  share: "Share",
};
const THEMES_URL = "/assets/themes/";
const LOCALES = ["en", "cy"];

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

function renderBar(extraProps: Record<string, unknown> = {}) {
  return render(PickerBar, {
    props: {
      labels: LABELS,
      themesUrl: THEMES_URL,
      locales: LOCALES,
      ...extraProps,
    },
  });
}

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
    const { container } = renderBar({ class: "my-picker-bar" });
    const root = container.querySelector(".picker-bar");
    expect(root).toBeTruthy();
    expect(root?.classList.contains("my-picker-bar")).toBe(true);
  });

  test("§7.2 renders all four pickers, each named from `labels`", () => {
    renderBar();
    expect(screen.getByRole("button", { name: "Theme" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Language" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Text size" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Share" })).toBeTruthy();
  });

  test("§7.2 renders the four picker root class hooks in theme, locale, text-size, share order", () => {
    const { container } = renderBar();
    const roots = Array.from(
      container.querySelectorAll(".picker-bar > div"),
    ).map((el) => el.className.split(" ")[0]);
    expect(roots).toEqual([
      "theme-picker",
      "locale-picker",
      "text-size-picker",
      "share-picker",
    ]);
  });

  test("§7.5 spreads extra attributes onto the root", () => {
    const { container } = renderBar({ "data-testid": "header-picker-bar" });
    expect(
      container.querySelector('[data-testid="header-picker-bar"]'),
    ).toBeTruthy();
  });
});

describe("PickerBar — theme-picker wiring (§5.1, §7.3, §7.6)", () => {
  test("§7.3 forwards themesUrl and uses DEFAULT_THEMES when `themes` is omitted", async () => {
    renderBar();
    await fireEvent.click(screen.getByRole("button", { name: "Theme" }));
    const options = document.querySelectorAll(".theme-picker-option");
    expect(options).toHaveLength(45);
    expect(options[0].textContent).toBe("Abyss");
    expect(options[37].textContent).toBe(
      "United Kingdom Government Digital Service",
    );
  });

  test("§7.6 an explicit `themes` prop overrides the default", async () => {
    renderBar({ themes: ["light", "dark"] });
    await fireEvent.click(screen.getByRole("button", { name: "Theme" }));
    const options = document.querySelectorAll(".theme-picker-option");
    expect(options).toHaveLength(2);
  });

  test("§7.7 `themeProps` reaches ThemePicker (storageKey persists a selection)", async () => {
    renderBar({ themeProps: { storageKey: "lily-theme" } });
    await fireEvent.click(screen.getByRole("button", { name: "Theme" }));
    const options = document.querySelectorAll(".theme-picker-option");
    await fireEvent.click(options[0]);
    expect(localStorage.getItem("lily-theme")).toBe("abyss");
  });
});

describe("PickerBar — locale-picker wiring (§5.2, §7.4)", () => {
  test("§7.4 forwards the required `locales` list", async () => {
    renderBar();
    await fireEvent.click(screen.getByRole("button", { name: "Language" }));
    const options = document.querySelectorAll(".locale-picker-option");
    expect(options).toHaveLength(LOCALES.length);
  });
});

describe("PickerBar — text-size-picker wiring (§5.3, §7.8, §7.9)", () => {
  test("§7.8 uses DEFAULT_SIZES when `sizes` is omitted, in largest-to-smallest order", async () => {
    renderBar();
    await fireEvent.click(
      screen.getByRole("button", { name: "Text size" }),
    );
    const options = Array.from(
      document.querySelectorAll(".text-size-picker-option"),
    ).map((el) => el.textContent);
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

  test("§7.9 defaults the initial value to 'normal'", () => {
    const { container } = renderBar();
    const hidden = container.querySelector(
      'input[name="text-size"]',
    ) as HTMLInputElement;
    expect(hidden.value).toBe("normal");
  });

  test("§7.9 `textSizeProps.defaultValue` overrides the built-in 'normal' default", () => {
    const { container } = renderBar({
      textSizeProps: { defaultValue: "small" },
    });
    const hidden = container.querySelector(
      'input[name="text-size"]',
    ) as HTMLInputElement;
    expect(hidden.value).toBe("small");
  });
});

describe("PickerBar — share-picker wiring (§5.4, §7.10)", () => {
  test("§7.10 forwards `shareTargets` to SharePicker's list", async () => {
    renderBar({
      shareTargets: [
        {
          id: "email",
          label: "Email",
          href: (url: string) => `mailto:?body=${url}`,
        },
      ],
    });
    await fireEvent.click(screen.getByRole("button", { name: "Share" }));
    expect(screen.getByText("Email")).toBeTruthy();
  });
});
