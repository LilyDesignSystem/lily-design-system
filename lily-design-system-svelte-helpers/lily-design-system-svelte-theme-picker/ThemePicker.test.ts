import { render, screen, fireEvent } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import ThemePicker, {
  normaliseThemesUrl,
  themeHref,
  themeName,
  matchSystemTheme,
} from "./ThemePicker.svelte";

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

describe("ThemePicker — pure helpers", () => {
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

/** Open the listbox and click the option for `slug`. */
async function pick(slug: string, themes: string[] = THEMES): Promise<void> {
  await fireEvent.click(screen.getByRole("button"));
  const opts = document.querySelectorAll(".theme-picker-option");
  await fireEvent.click(opts[themes.indexOf(slug)]);
}

describe("ThemePicker — markup contract (§4.2, §7.1–§7.5)", () => {
  test("§7.1 renders a button that controls a listbox", () => {
    render(ThemePicker, {
      props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
    });
    const button = screen.getByRole("button");
    expect(button.tagName).toBe("BUTTON");
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("aria-haspopup")).toBe("listbox");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    const listId = button.getAttribute("aria-controls");
    expect(listId).toBeTruthy();
    expect(document.getElementById(listId!)?.getAttribute("role")).toBe(
      "listbox",
    );
  });

  test("§7.1 the button renders the half-circle glyph, hidden from assistive tech", () => {
    render(ThemePicker, {
      props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
    });
    const icon = document.querySelector(".theme-picker-icon") as HTMLElement;
    // U+25D1 CIRCLE WITH RIGHT HALF BLACK, decimal &#9681;
    expect(icon.textContent).toBe("\u25D1");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
  });

  test("§7.2 aria-label names the button and the listbox", () => {
    render(ThemePicker, {
      props: { label: "Choose theme", themesUrl: URL_TRAILING, themes: THEMES },
    });
    expect(screen.getByRole("button", { name: "Choose theme" })).toBeTruthy();
    const list = document.querySelector(".theme-picker-list") as HTMLElement;
    expect(list.getAttribute("aria-label")).toBe("Choose theme");
  });

  test("§7.3 one option per theme; the hidden input carries the supplied name", async () => {
    render(ThemePicker, {
      props: {
        label: "Theme",
        themesUrl: URL_TRAILING,
        themes: THEMES,
        name: "appearance",
      },
    });
    await flush();
    const options = document.querySelectorAll(".theme-picker-option");
    expect(options.length).toBe(THEMES.length);
    const hidden = document.querySelector(
      'input[type="hidden"]',
    ) as HTMLInputElement;
    expect(hidden.name).toBe("appearance");
    expect(hidden.value).toBe("light");
  });

  test("§7.4 the listbox is hidden until the button is activated", async () => {
    render(ThemePicker, {
      props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
    });
    const list = document.querySelector(".theme-picker-list") as HTMLElement;
    expect(list.hasAttribute("hidden")).toBe(true);
    await fireEvent.click(screen.getByRole("button"));
    expect(list.hasAttribute("hidden")).toBe(false);
    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  test("§7.4 the active theme is the aria-selected option", async () => {
    render(ThemePicker, {
      props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
    });
    await flush();
    await fireEvent.click(screen.getByRole("button"));
    const selected = document.querySelectorAll(
      '[role="option"][aria-selected="true"]',
    );
    expect(selected.length).toBe(1);
    expect(selected[0].textContent?.trim()).toBe("Light");
  });

  test("§7.5 default labels title-case the slug (no 'default' string)", () => {
    const { container } = render(ThemePicker, {
      props: {
        label: "Theme",
        themesUrl: URL_TRAILING,
        themes: ["light", "dark"],
      },
    });
    expect(screen.getByText("Light")).toBeTruthy();
    expect(screen.getByText("Dark")).toBeTruthy();
    expect(container.textContent ?? "").not.toMatch(/default/i);
  });

  test("§7.5 themeLabels override the default title-case label", () => {
    render(ThemePicker, {
      props: {
        label: "Theme",
        themesUrl: URL_TRAILING,
        themes: ["light", "dark"],
        themeLabels: { light: "Bright", dark: "Midnight" },
      },
    });
    expect(screen.getByText("Bright")).toBeTruthy();
    expect(screen.getByText("Midnight")).toBeTruthy();
  });
});

describe("ThemePicker — keyboard contract (APG listbox)", () => {
  async function openWith(key: string) {
    render(ThemePicker, {
      props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
    });
    await flush();
    const button = screen.getByRole("button");
    await fireEvent.keyDown(button, { key });
    await flush();
    return {
      button,
      list: document.querySelector(".theme-picker-list") as HTMLElement,
    };
  }

  test("§7.14 ArrowDown, Enter and Space all open the listbox", async () => {
    for (const key of ["ArrowDown", "Enter", " "]) {
      const { list } = await openWith(key);
      expect(list.hasAttribute("hidden")).toBe(false);
      document.body.innerHTML = "";
    }
  });

  test("§7.14 ArrowUp opens with the last option active", async () => {
    const { list } = await openWith("ArrowUp");
    expect(list.getAttribute("aria-activedescendant")).toBe(
      list.children[THEMES.length - 1].id,
    );
  });

  test("§7.15 ArrowDown / ArrowUp move the active descendant and clamp", async () => {
    const { list } = await openWith("ArrowDown");
    expect(list.getAttribute("aria-activedescendant")).toBe(
      list.children[0].id,
    );
    await fireEvent.keyDown(list, { key: "ArrowDown" });
    expect(list.getAttribute("aria-activedescendant")).toBe(
      list.children[1].id,
    );
    await fireEvent.keyDown(list, { key: "ArrowUp" });
    await fireEvent.keyDown(list, { key: "ArrowUp" });
    expect(list.getAttribute("aria-activedescendant")).toBe(
      list.children[0].id,
    );
  });

  test("§7.15 Home and End jump to the first and last option", async () => {
    const { list } = await openWith("ArrowDown");
    await fireEvent.keyDown(list, { key: "End" });
    expect(list.getAttribute("aria-activedescendant")).toBe(
      list.children[THEMES.length - 1].id,
    );
    await fireEvent.keyDown(list, { key: "Home" });
    expect(list.getAttribute("aria-activedescendant")).toBe(
      list.children[0].id,
    );
  });

  test("§7.16 Enter selects the active option, applies it, and closes", async () => {
    const { button, list } = await openWith("ArrowDown");
    await fireEvent.keyDown(list, { key: "ArrowDown" });
    await fireEvent.keyDown(list, { key: "Enter" });
    await flush();
    expect(list.hasAttribute("hidden")).toBe(true);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  test("§7.16 Escape closes without changing the theme", async () => {
    const { list } = await openWith("ArrowDown");
    await fireEvent.keyDown(list, { key: "ArrowDown" });
    await fireEvent.keyDown(list, { key: "Escape" });
    await flush();
    expect(list.hasAttribute("hidden")).toBe(true);
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  test("§7.17 typeahead moves the active descendant by label prefix", async () => {
    const { list } = await openWith("ArrowDown");
    await fireEvent.keyDown(list, { key: "a" });
    // "Abyss" is index 2 in THEMES.
    expect(list.getAttribute("aria-activedescendant")).toBe(
      list.children[2].id,
    );
  });
});

describe("ThemePicker — dynamic loading (§5, §7.6–§7.11)", () => {
  test("§7.6 default initial value is 'light' when present in themes", async () => {
    render(ThemePicker, {
      props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
    });
    await flush();
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  test("§7.6 default initial value falls back to themes[0] when 'light' is absent", async () => {
    render(ThemePicker, {
      props: {
        label: "Theme",
        themesUrl: URL_TRAILING,
        themes: ["dark", "abyss"],
      },
    });
    await flush();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  test("§7.7 injects a managed <link> with the resolved href", async () => {
    render(ThemePicker, {
      props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
    });
    await flush();
    const link = getManagedLink();
    expect(link).not.toBeNull();
    expect(link!.rel).toBe("stylesheet");
    expect(link!.href.endsWith("/assets/themes/light.css")).toBe(true);
  });

  test("§7.8 selecting an option updates href, data-theme, fires onChange, and closes the listbox", async () => {
    const onChange = vi.fn();
    render(ThemePicker, {
      props: {
        label: "Theme",
        themesUrl: URL_TRAILING,
        themes: THEMES,
        onChange,
      },
    });
    await flush();
    await pick("abyss");
    await flush();
    expect(document.documentElement.dataset.theme).toBe("abyss");
    expect(getManagedLink()!.href.endsWith("/assets/themes/abyss.css")).toBe(
      true,
    );
    expect(onChange).toHaveBeenCalledWith("abyss");
    // A pointer selection closes, exactly as Enter does (§7.16). The
    // asymmetry would be invisible to a consumer reading the DOM: a
    // stale aria-expanded over a hidden list makes every later click
    // miss the options.
    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe(
      "false",
    );
    expect(
      document.querySelector(".theme-picker-list")!.hasAttribute("hidden"),
    ).toBe(true);
  });

  test("§7.9 persists to localStorage and reads back on fresh mount", async () => {
    const { unmount } = render(ThemePicker, {
      props: {
        label: "Theme",
        themesUrl: URL_TRAILING,
        themes: THEMES,
        storageKey: "lily-theme",
      },
    });
    await flush();
    await pick("dark");
    await flush();
    expect(localStorage.getItem("lily-theme")).toBe("dark");
    unmount();

    document.documentElement.removeAttribute("data-theme");
    document.head
      .querySelectorAll("link[data-lily-theme-picker]")
      .forEach((n) => n.remove());

    render(ThemePicker, {
      props: {
        label: "Theme",
        themesUrl: URL_TRAILING,
        themes: THEMES,
        storageKey: "lily-theme",
      },
    });
    await flush();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  test("§7.10 a supplied value prop wins over storage and defaults", async () => {
    localStorage.setItem("lily-theme", "abyss");
    render(ThemePicker, {
      props: {
        label: "Theme",
        themesUrl: URL_TRAILING,
        themes: THEMES,
        value: "light",
        storageKey: "lily-theme",
      },
    });
    await flush();
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  test("§7.11 missing trailing slash on themesUrl still yields one slash", async () => {
    render(ThemePicker, {
      props: { label: "Theme", themesUrl: URL_NO_TRAILING, themes: THEMES },
    });
    await flush();
    expect(getManagedLink()!.href.endsWith("/assets/themes/light.css")).toBe(
      true,
    );
  });
});

describe("ThemePicker — spread + custom children (§7.12–§7.13)", () => {
  test("§7.12 extra attributes spread onto the <select>", () => {
    render(ThemePicker, {
      props: {
        label: "Theme",
        themesUrl: URL_TRAILING,
        themes: THEMES,
        "data-testid": "tp",
      },
    });
    expect(screen.getByTestId("tp")).toBeTruthy();
  });

  test("§7.13 children snippet replaces the button glyph and receives ChildArgs", async () => {
    const customSnippet = (($anchor: Comment, args: any) => {
      const node = document.createElement("span");
      const a = args();
      node.setAttribute("data-testid", "custom");
      node.setAttribute("data-open", String(a.open));
      node.setAttribute("data-value", a.value);
      node.setAttribute("data-label-light", a.labelFor("light"));
      node.textContent = "custom glyph";
      $anchor.before(node);
    }) as any;

    render(ThemePicker, {
      props: {
        label: "Theme",
        themesUrl: URL_TRAILING,
        themes: THEMES,
        // Explicit value: the raw test snippet reads its args once at
        // first render, before the effect resolves an initial theme.
        value: "dark",
        children: customSnippet,
      },
    });
    await flush();
    const custom = screen.getByTestId("custom");
    // The custom glyph replaces the default half-circle inside the button.
    expect(custom.closest("button")?.className).toContain(
      "theme-picker-button",
    );
    expect(document.querySelector(".theme-picker-icon")).toBeNull();
    expect(custom.getAttribute("data-open")).toBe("false");
    expect(custom.getAttribute("data-value")).toBe("dark");
    expect(custom.getAttribute("data-label-light")).toBe("Light");
  });
});

/**
 * jsdom does not implement window.matchMedia, so install a stub. Returns a
 * restore function. (Its absence is itself covered: matchSystemTheme guards
 * on `typeof window.matchMedia !== "function"` for SSR.)
 */
function stubColorScheme(prefersDark: boolean): () => void {
  const original = (window as any).matchMedia;
  (window as any).matchMedia = (q: string) => ({
    matches: prefersDark && q.includes("dark"),
    media: q,
  });
  return () => {
    (window as any).matchMedia = original;
  };
}

describe("ThemePicker — harmonised surface with locale-picker", () => {
  test("§7.18 themeName title-cases each hyphen-separated word", () => {
    expect(themeName("light")).toBe("Light");
    expect(themeName("high-contrast")).toBe("High Contrast");
    expect(themeName("united-kingdom-national-health-service")).toBe(
      "United Kingdom National Health Service",
    );
  });

  test("§7.18 themeName is what the default option label uses", () => {
    render(ThemePicker, {
      props: {
        label: "Theme",
        themesUrl: URL_TRAILING,
        themes: ["high-contrast"],
      },
    });
    expect(screen.getByText(themeName("high-contrast"))).toBeTruthy();
  });

  test("§7.19 matchSystemTheme resolves the OS colour scheme to a supported slug", () => {
    const restore = stubColorScheme(true);
    expect(matchSystemTheme(["light", "dark"])).toBe("dark");
    // Returns "" when the preferred scheme is not on offer.
    expect(matchSystemTheme(["solarized"])).toBe("");
    restore();
  });

  test("§7.19 matchSystemTheme resolves light when dark is not preferred", () => {
    const restore = stubColorScheme(false);
    expect(matchSystemTheme(["light", "dark"])).toBe("light");
    restore();
  });

  test("§7.19 matchSystemTheme returns empty when matchMedia is unavailable (SSR)", () => {
    const original = (window as any).matchMedia;
    delete (window as any).matchMedia;
    expect(matchSystemTheme(["light", "dark"])).toBe("");
    (window as any).matchMedia = original;
  });

  test("§7.20 detectFromSystem resolves the initial theme, below storage", async () => {
    const restore = stubColorScheme(true);
    render(ThemePicker, {
      props: {
        label: "Theme",
        themesUrl: URL_TRAILING,
        themes: THEMES,
        detectFromSystem: true,
      },
    });
    await flush();
    // Without detection this would resolve to "light".
    expect(document.documentElement.dataset.theme).toBe("dark");
    restore();
  });

  test("§7.20 storage still wins over system detection", async () => {
    const restore = stubColorScheme(true);
    localStorage.setItem("lily-theme", "abyss");
    render(ThemePicker, {
      props: {
        label: "Theme",
        themesUrl: URL_TRAILING,
        themes: THEMES,
        storageKey: "lily-theme",
        detectFromSystem: true,
      },
    });
    await flush();
    expect(document.documentElement.dataset.theme).toBe("abyss");
    restore();
  });

  test("§7.20 detection is off unless opted in", async () => {
    const restore = stubColorScheme(true);
    render(ThemePicker, {
      props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
    });
    await flush();
    expect(document.documentElement.dataset.theme).toBe("light");
    restore();
  });
});

describe("ThemePicker — accessibility hardening (§7.21–§7.24)", () => {
  async function openPicker(themes: string[] = THEMES) {
    render(ThemePicker, {
      props: { label: "Theme", themesUrl: URL_TRAILING, themes },
    });
    await flush();
    await fireEvent.click(screen.getByRole("button"));
    await flush();
    return {
      button: screen.getByRole("button"),
      list: document.querySelector(".theme-picker-list") as HTMLElement,
    };
  }

  const active = (list: HTMLElement) =>
    list.querySelector("[data-active]")?.textContent?.trim();

  test("§7.21 Tab from the open list puts focus on the button before closing", async () => {
    const { button, list } = await openPicker();
    expect(document.activeElement).toBe(list);
    await fireEvent.keyDown(list, { key: "Tab" });
    // Focus sits on the button, so the browser's default Tab proceeds
    // from the picker's own position — not from <body>, which is where
    // focus lands when the focused list is hidden first, sending the
    // next Tab to the top of the document.
    expect(document.activeElement).toBe(button);
    expect(list.hasAttribute("hidden")).toBe(true);
  });

  test("§7.22 a repeated typeahead character cycles through its matches", async () => {
    const { list } = await openPicker(["dark", "dim", "dracula", "light"]);
    // The initial value resolves to "light", so the cursor opens there.
    await fireEvent.keyDown(list, { key: "d" });
    expect(active(list)).toBe("Dark");
    await fireEvent.keyDown(list, { key: "d" });
    expect(active(list)).toBe("Dim");
    await fireEvent.keyDown(list, { key: "d" });
    expect(active(list)).toBe("Dracula");
  });

  test("§7.22 a multi-character buffer refines the match from the active option", async () => {
    const { list } = await openPicker(["dark", "dim", "dracula", "light"]);
    await fireEvent.keyDown(list, { key: "d" });
    await fireEvent.keyDown(list, { key: "r" });
    expect(active(list)).toBe("Dracula");
  });

  test("§7.23 PageUp and PageDown move the cursor by ten, clamped", async () => {
    const many = Array.from(
      { length: 25 },
      (_, i) => `t${String(i).padStart(2, "0")}`,
    );
    const { list } = await openPicker(many);
    await fireEvent.keyDown(list, { key: "PageDown" });
    expect(active(list)).toBe("T10");
    await fireEvent.keyDown(list, { key: "PageDown" });
    expect(active(list)).toBe("T20");
    await fireEvent.keyDown(list, { key: "PageDown" });
    expect(active(list)).toBe("T24");
    await fireEvent.keyDown(list, { key: "PageUp" });
    expect(active(list)).toBe("T14");
  });

  test("§7.24 an empty list opens without aria-activedescendant", async () => {
    const { list } = await openPicker([]);
    expect(list.hasAttribute("hidden")).toBe(false);
    expect(list.getAttribute("aria-activedescendant")).toBeNull();
  });
});

describe("ThemePicker — idempotent apply (§7.25)", () => {
  test("§7.25 onChange fires once per changed value, not once per effect run", async () => {
    const onChange = vi.fn();
    const { rerender } = render(ThemePicker, {
      props: {
        label: "Theme",
        themesUrl: URL_TRAILING,
        themes: THEMES,
        onChange,
      },
    });
    await flush();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith("light");

    await pick("abyss");
    await flush();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith("abyss");

    // A prop change re-runs the apply effect. Re-applying the same theme
    // must not re-fire onChange: a consumer callback that writes reactive
    // state would re-enter the effect until Svelte gives up updating the
    // component (effect_update_depth_exceeded) and the listbox freezes.
    await rerender({ themesUrl: "/other/themes/" });
    await flush();
    expect(onChange).toHaveBeenCalledTimes(2);
  });
});
