import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { PickerBar, DEFAULT_THEMES, DEFAULT_SIZES } from "./picker-bar.js";
import type { PickerBarLabels } from "./picker-bar.js";

// Ensure the custom element (and its five wrapped pickers, via
// picker-bar.ts's own imports) is registered exactly once for the suite.
if (
  typeof customElements !== "undefined" &&
  !customElements.get("lily-picker-bar")
) {
  customElements.define("lily-picker-bar", PickerBar);
}

const LABELS: PickerBarLabels = {
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

type MountOptions = {
  labels?: PickerBarLabels;
  themesUrl?: string;
  themes?: string[];
  locales?: string[];
  sizes?: string[];
  shareTargets?: Array<{
    id: string;
    label: string;
    href: (url: string, title: string, text: string) => string;
  }>;
  links?: Array<{ label: string; href: string }>;
  linkProps?: Record<string, unknown>;
  searchProps?: Record<string, unknown>;
  themeProps?: Record<string, unknown>;
  textSizeProps?: Record<string, unknown>;
  class?: string;
  attrs?: Record<string, string>;
};

function mount(opts: MountOptions = {}): PickerBar {
  const el = document.createElement("lily-picker-bar") as PickerBar;
  if (opts.class) el.setAttribute("class", opts.class);
  for (const [k, v] of Object.entries(opts.attrs ?? {})) el.setAttribute(k, v);
  el.labels = opts.labels ?? LABELS;
  el.themesUrl = opts.themesUrl ?? THEMES_URL;
  if (opts.themes) el.themes = opts.themes;
  el.locales = opts.locales ?? LOCALES;
  if (opts.sizes) el.sizes = opts.sizes;
  if (opts.shareTargets) el.shareTargets = opts.shareTargets as never;
  if (opts.links) el.links = opts.links as never;
  if (opts.linkProps) el.linkProps = opts.linkProps as never;
  if (opts.searchProps) el.searchProps = opts.searchProps as never;
  if (opts.themeProps) el.themeProps = opts.themeProps as never;
  if (opts.textSizeProps) el.textSizeProps = opts.textSizeProps as never;
  document.body.appendChild(el);
  return el;
}

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}

beforeEach(() => {
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("lang");
  document.documentElement.removeAttribute("dir");
  document.documentElement.removeAttribute("data-text-size");
  document.head.querySelectorAll("link[data-lily-theme-picker]").forEach((n) => n.remove());
  try {
    localStorage.clear();
  } catch {
    /* ignore */
  }
});

afterEach(() => {
  document.body.innerHTML = "";
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
    const el = mount({ class: "my-picker-bar" });
    const root = el.querySelector(".picker-bar");
    expect(root).toBeTruthy();
    expect(root?.classList.contains("my-picker-bar")).toBe(true);
  });

  test("§7.2 renders all five pickers, each named from `labels`", () => {
    const el = mount();
    // Each picker's trigger is its one button carrying aria-expanded
    // (search's ⏎ submit button, inside its closed panel, has none).
    const buttons = [...el.querySelectorAll("button[aria-expanded]")].map((b) =>
      b.getAttribute("aria-label"),
    );
    expect(buttons).toEqual([
      "Search this site",
      "Theme",
      "Language",
      "Text size",
      "Share",
    ]);
  });

  test("§7.2 renders the five picker elements in search, theme, locale, text-size, share order", () => {
    const el = mount();
    const tags = [...(el.querySelector(".picker-bar")?.children ?? [])].map(
      (n) => n.tagName.toLowerCase(),
    );
    expect(tags).toEqual([
      "lily-search-picker",
      "lily-theme-picker",
      "lily-locale-picker",
      "lily-text-size-picker",
      "lily-share-picker",
    ]);
  });
});

describe("PickerBar — theme-picker wiring (§5.1, §7.3, §7.6)", () => {
  test("§7.3 forwards themesUrl and uses DEFAULT_THEMES when `themes` is omitted", () => {
    const el = mount();
    click(el.querySelector(".theme-picker-button")!);
    const options = el.querySelectorAll(".theme-picker-option");
    expect(options).toHaveLength(45);
    expect(options[0].textContent).toBe("Abyss");
    expect(options[37].textContent).toBe(
      "United Kingdom Government Digital Service",
    );
  });

  test("§7.6 an explicit `themes` prop overrides the default", () => {
    const el = mount({ themes: ["light", "dark"] });
    click(el.querySelector(".theme-picker-button")!);
    const options = el.querySelectorAll(".theme-picker-option");
    expect(options).toHaveLength(2);
  });

  test("§7.7 `themeProps` reaches ThemePicker (storageKey persists a selection)", () => {
    const el = mount({ themeProps: { storageKey: "lily-theme" } });
    click(el.querySelector(".theme-picker-button")!);
    const options = el.querySelectorAll(".theme-picker-option");
    click(options[0]);
    expect(localStorage.getItem("lily-theme")).toBe("abyss");
  });
});

describe("PickerBar — locale-picker wiring (§5.2, §7.4)", () => {
  test("§7.4 forwards the required `locales` list", () => {
    const el = mount();
    click(el.querySelector(".locale-picker-button")!);
    const options = el.querySelectorAll(".locale-picker-option");
    expect(options).toHaveLength(LOCALES.length);
  });
});

describe("PickerBar — text-size-picker wiring (§5.3, §7.8, §7.9)", () => {
  test("§7.8 uses DEFAULT_SIZES when `sizes` is omitted, in largest-to-smallest order", () => {
    const el = mount();
    click(el.querySelector(".text-size-picker-button")!);
    const options = [...el.querySelectorAll(".text-size-picker-option")].map(
      (o) => o.textContent,
    );
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
    const el = mount();
    const hidden = el.querySelector(
      'input[name="text-size"]',
    ) as HTMLInputElement;
    expect(hidden.value).toBe("normal");
  });

  test("§7.9 `textSizeProps.defaultValue` overrides the built-in 'normal' default", () => {
    const el = mount({ textSizeProps: { defaultValue: "small" } });
    const hidden = el.querySelector(
      'input[name="text-size"]',
    ) as HTMLInputElement;
    expect(hidden.value).toBe("small");
  });
});

describe("PickerBar — share-picker wiring (§5.4, §7.10)", () => {
  test("§7.10 forwards `shareTargets` to SharePicker's list", () => {
    const el = mount({
      shareTargets: [
        {
          id: "email",
          label: "Email",
          href: (url: string) => `mailto:?body=${url}`,
        },
      ],
    });
    click(el.querySelector(".share-picker-button")!);
    const target = el.querySelector(".share-picker-target");
    expect(target?.textContent?.trim()).toBe("Email");
  });
});

describe("PickerBar — search-picker wiring (§7.12, §7.13)", () => {
  test("§7.12 search is the first picker, with its field and ⏎ button named from `labels`", () => {
    const el = mount();
    const first = el.querySelector(".picker-bar")?.firstElementChild;
    expect(first?.tagName.toLowerCase()).toBe("lily-search-picker");
    click(el.querySelector(".search-picker-button")!);
    expect(
      el.querySelector(".search-picker-button")!.getAttribute("aria-label"),
    ).toBe("Search this site");
    expect(
      el.querySelector(".search-picker-input")!.getAttribute("aria-label"),
    ).toBe("Search terms");
    expect(
      el.querySelector(".search-picker-submit")!.getAttribute("aria-label"),
    ).toBe("Search");
  });

  test("§7.13 `searchProps` reaches SearchPicker (action + navigate)", () => {
    const navigate = vi.fn();
    const el = mount({ searchProps: { action: "/search", navigate } });
    click(el.querySelector(".search-picker-button")!);
    const input = el.querySelector<HTMLInputElement>(".search-picker-input")!;
    input.value = "foo";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    el.querySelector(".search-picker-form")!.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
    expect(navigate).toHaveBeenCalledWith("/search?foo");
  });
});

const LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy/" },
];

describe("lily-picker-bar — link-picker wiring (§L1–§L4)", () => {
  test("§L1 a link picker renders FIRST when `links` and `labels.link` are given", () => {
    const el = mount({ links: LINKS, labels: { ...LABELS, link: "Pages" } });
    const tags = Array.from(el.querySelectorAll(".picker-bar > *")).map((n) => n.tagName.toLowerCase());
    expect(tags).toEqual(["lily-link-picker", "lily-search-picker", "lily-theme-picker", "lily-locale-picker", "lily-text-size-picker", "lily-share-picker"]);
    expect(el.linkPicker).toBeTruthy();
    expect(Array.from(el.querySelectorAll(".link-picker-link")).map((a) => a.textContent)).toEqual([
      "Home", "About Us", "Contact Us", "Privacy Policy",
    ]);
    expect(el.querySelector(".link-picker-button")!.getAttribute("aria-label")).toBe("Pages");
  });

  test("§L2 no link picker without links, with empty links, or without labels.link; it appears and disappears live", () => {
    for (const opts of [{}, { links: [], labels: { ...LABELS, link: "Pages" } }, { links: LINKS }]) {
      const el = mount(opts as never);
      expect(el.querySelector("lily-link-picker")).toBeNull();
      expect(el.querySelector(".picker-bar > *")!.tagName.toLowerCase()).toBe("lily-search-picker");
      document.body.innerHTML = "";
    }
    const el = mount();
    el.labels = { ...LABELS, link: "Pages" };
    el.links = LINKS;
    expect(el.querySelector(".picker-bar > *")!.tagName.toLowerCase()).toBe("lily-link-picker");
    el.links = [];
    expect(el.querySelector("lily-link-picker")).toBeNull();
  });

  test("§L3 `linkProps` reaches the link picker (onNavigate)", () => {
    const onNavigate = vi.fn();
    const el = mount({ links: LINKS, labels: { ...LABELS, link: "Pages" }, linkProps: { onNavigate } });
    (el.querySelector(".link-picker-button") as HTMLButtonElement).click();
    el.querySelector<HTMLAnchorElement>('.link-picker-link[href="/about/"]')!.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }),
    );
    expect(onNavigate).toHaveBeenCalledWith("/about/", "/about/");
  });

  test("§L4 the links are real anchors, not menu items", () => {
    const el = mount({ links: LINKS, labels: { ...LABELS, link: "Pages" } });
    expect(el.querySelectorAll(".link-picker-list a[href]")).toHaveLength(4);
    expect(el.querySelector('.link-picker-list [role="menuitem"]')).toBeNull();
  });
});
