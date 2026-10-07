import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import PickerBar, { DEFAULT_THEMES, DEFAULT_SIZES } from "./PickerBar";

const LABELS = {
  search: "Search this site",
  searchInput: "Search terms",
  searchSubmit: "Search",
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
  cleanup();
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("lang");
  document.documentElement.removeAttribute("dir");
  document.documentElement.removeAttribute("data-text-size");
});

function renderBar(extraProps: Record<string, unknown> = {}) {
  return render(
    <PickerBar
      labels={LABELS}
      themesUrl={THEMES_URL}
      locales={LOCALES}
      {...extraProps}
    />,
  );
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
    const { container } = renderBar({ className: "my-picker-bar" });
    const root = container.querySelector(".picker-bar");
    expect(root).toBeTruthy();
    expect(root?.classList.contains("my-picker-bar")).toBe(true);
  });

  test("§7.2 renders all five pickers, each named from `labels`", () => {
    renderBar();
    expect(screen.getByRole("button", { name: "Search this site" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Theme" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Language" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Text size" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Share" })).toBeTruthy();
  });

  test("§7.2 renders the five picker root class hooks in search, theme, locale, text-size, share order", () => {
    const { container } = renderBar();
    const roots = Array.from(
      container.querySelectorAll(".picker-bar > div"),
    ).map((el) => el.className.split(" ")[0]);
    expect(roots).toEqual([
      "search-picker",
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
  test("§7.3 forwards themesUrl and uses DEFAULT_THEMES when `themes` is omitted", () => {
    renderBar();
    fireEvent.click(screen.getByRole("button", { name: "Theme" }));
    const options = document.querySelectorAll(".theme-picker-option");
    expect(options).toHaveLength(45);
    expect(options[0].textContent).toBe("Abyss");
    expect(options[37].textContent).toBe(
      "United Kingdom Government Digital Service",
    );
  });

  test("§7.6 an explicit `themes` prop overrides the default", () => {
    renderBar({ themes: ["light", "dark"] });
    fireEvent.click(screen.getByRole("button", { name: "Theme" }));
    const options = document.querySelectorAll(".theme-picker-option");
    expect(options).toHaveLength(2);
  });

  test("§7.7 `themeProps` reaches ThemePicker (storageKey persists a selection)", () => {
    renderBar({ themeProps: { storageKey: "lily-theme" } });
    fireEvent.click(screen.getByRole("button", { name: "Theme" }));
    const options = document.querySelectorAll(".theme-picker-option");
    fireEvent.click(options[0]);
    expect(localStorage.getItem("lily-theme")).toBe("abyss");
  });
});

describe("PickerBar — locale-picker wiring (§5.2, §7.4)", () => {
  test("§7.4 forwards the required `locales` list", () => {
    renderBar();
    fireEvent.click(screen.getByRole("button", { name: "Language" }));
    const options = document.querySelectorAll(".locale-picker-option");
    expect(options).toHaveLength(LOCALES.length);
  });
});

describe("PickerBar — text-size-picker wiring (§5.3, §7.8, §7.9)", () => {
  test("§7.8 uses DEFAULT_SIZES when `sizes` is omitted, in largest-to-smallest order", () => {
    renderBar();
    fireEvent.click(screen.getByRole("button", { name: "Text size" }));
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
  test("§7.10 forwards `shareTargets` to SharePicker's list", () => {
    renderBar({
      shareTargets: [
        {
          id: "email",
          label: "Email",
          href: (url: string) => `mailto:?body=${url}`,
        },
      ],
    });
    fireEvent.click(screen.getByRole("button", { name: "Share" }));
    expect(screen.getByText("Email")).toBeTruthy();
  });
});

describe("PickerBar — search-picker wiring (§7.12, §7.13)", () => {
  test("§7.12 search is the first picker, with its field and ⏎ button named from `labels`", () => {
    const { container } = renderBar();
    const first = container.querySelector(".picker-bar > div");
    expect(first?.classList.contains("search-picker")).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Search this site" }));
    expect(screen.getByRole("searchbox", { name: "Search terms" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Search" })).toBeTruthy();
  });

  test("§7.13 `searchProps` reaches SearchPicker (action + navigate)", () => {
    const navigate = vi.fn();
    renderBar({ searchProps: { action: "/search", navigate } });
    fireEvent.click(screen.getByRole("button", { name: "Search this site" }));
    const input = screen.getByRole("searchbox", { name: "Search terms" });
    fireEvent.change(input, { target: { value: "foo" } });
    fireEvent.submit(document.querySelector(".search-picker-form")!);
    expect(navigate).toHaveBeenCalledWith("/search?foo");
  });
});

describe("PickerBar — tooltips (§7.14)", () => {
  test("§7.14 each of the five nested pickers renders its own tooltip, holding its button's label", () => {
    const { container } = renderBar();
    for (const [helper, label] of [
      ["search-picker", "Search this site"],
      ["theme-picker", "Theme"],
      ["locale-picker", "Language"],
      ["text-size-picker", "Text size"],
      ["share-picker", "Share"],
    ]) {
      const tip = container.querySelector(`.${helper}-tooltip`) as HTMLElement;
      expect(tip.getAttribute("role")).toBe("tooltip");
      expect(tip.textContent).toBe(label);
      expect(tip.hasAttribute("hidden")).toBe(true);
    }
  });
});

const LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy/" },
];

describe("PickerBar — link-picker wiring (§L1–§L4)", () => {
  test("§L1 a link picker renders FIRST when `links` and `labels.link` are given", () => {
    const { container } = renderBar({ links: LINKS, labels: { ...LABELS, link: "Pages" } });
    const classes = Array.from(container.querySelectorAll(".picker-bar > div")).map((d) => d.className.split(" ")[0]);
    expect(classes).toEqual(["link-picker", "search-picker", "theme-picker", "locale-picker", "text-size-picker", "share-picker"]);
    fireEvent.click(screen.getByRole("button", { name: "Pages" }));
    expect(Array.from(document.querySelectorAll(".link-picker-link")).map((a) => a.textContent?.trim())).toEqual([
      "Home", "About Us", "Contact Us", "Privacy Policy",
    ]);
  });

  test("§L2 no link picker without links, with empty links, or without labels.link", () => {
    for (const extra of [{}, { links: [], labels: { ...LABELS, link: "Pages" } }, { links: LINKS }]) {
      const { container, unmount } = renderBar(extra);
      expect(container.querySelector(".link-picker")).toBeNull();
      expect(container.querySelector(".picker-bar > div")?.classList.contains("search-picker")).toBe(true);
      unmount();
    }
  });

  test("§L3 `linkProps` reaches the LinkPicker (navigate)", () => {
    const navigate = vi.fn();
    renderBar({ links: LINKS, labels: { ...LABELS, link: "Pages" }, linkProps: { navigate } });
    fireEvent.click(screen.getByRole("button", { name: "Pages" }));
    fireEvent.click(document.querySelector('.link-picker-link[href="/about/"]')!);
    expect(navigate).toHaveBeenCalledWith("/about/");
  });

  test("§L4 the links are real anchors, not menu items", () => {
    renderBar({ links: LINKS, labels: { ...LABELS, link: "Pages" } });
    fireEvent.click(screen.getByRole("button", { name: "Pages" }));
    expect(document.querySelectorAll(".link-picker-list a[href]")).toHaveLength(4);
    expect(document.querySelector('.link-picker-list [role="menuitem"]')).toBeNull();
  });
});
