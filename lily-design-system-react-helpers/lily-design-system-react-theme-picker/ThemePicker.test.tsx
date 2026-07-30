import * as React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import ThemePicker, {
  normalizeThemesUrl,
  themeHref,
  themeName,
  matchSystemTheme,
  type ChildArgs,
} from "./ThemePicker";

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

function getList(): HTMLElement {
  return document.querySelector(".theme-picker-list") as HTMLElement;
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
  cleanup();
  document.documentElement.removeAttribute("data-theme");
});

/** Open the listbox and click the option for `slug`. */
function pick(slug: string, themes: string[] = THEMES): void {
  fireEvent.click(screen.getByRole("button"));
  const opts = document.querySelectorAll(".theme-picker-option");
  fireEvent.click(opts[themes.indexOf(slug)]);
}

describe("ThemePicker — pure helpers", () => {
  test("normalizeThemesUrl keeps a trailing slash", () => {
    expect(normalizeThemesUrl("/a/")).toBe("/a/");
  });

  test("normalizeThemesUrl appends a missing trailing slash", () => {
    expect(normalizeThemesUrl("/a")).toBe("/a/");
  });

  test("themeHref builds the href", () => {
    expect(themeHref("/a", "light", ".css")).toBe("/a/light.css");
    expect(themeHref("/a/", "light", ".css")).toBe("/a/light.css");
  });

  test("themeName title-cases a hyphenated slug", () => {
    expect(themeName("high-contrast")).toBe("High Contrast");
  });

  test("themeName leaves a single-word slug capitalised", () => {
    expect(themeName("light")).toBe("Light");
  });

  test("themeName title-cases every word of a long slug", () => {
    expect(
      themeName("united-kingdom-national-health-service-for-patients"),
    ).toBe("United Kingdom National Health Service For Patients");
  });

  test("labelFor delegates to themeName, so option text matches it", () => {
    render(
      <ThemePicker
        label="Theme"
        themesUrl={URL_TRAILING}
        themes={["high-contrast"]}
      />,
    );
    expect(screen.getByText(themeName("high-contrast"))).toBeTruthy();
  });
});

/**
 * jsdom does not implement `window.matchMedia` at all, so the helper's
 * SSR guard is exercised natively; the dark/light cases install a stub.
 */
function stubMatchMedia(prefersDark: boolean): () => void {
  (window as unknown as Record<string, unknown>).matchMedia = (
    query: string,
  ) => ({
    matches: query.includes("prefers-color-scheme: dark")
      ? prefersDark
      : !prefersDark,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  });
  return () => {
    delete (window as unknown as Record<string, unknown>).matchMedia;
  };
}

describe("ThemePicker — matchSystemTheme (system-preference detection)", () => {
  test("resolves dark when the OS prefers dark and dark is supported", () => {
    const restore = stubMatchMedia(true);
    try {
      expect(matchSystemTheme(THEMES)).toBe("dark");
    } finally {
      restore();
    }
  });

  test("resolves light when the OS does not prefer dark", () => {
    const restore = stubMatchMedia(false);
    try {
      expect(matchSystemTheme(THEMES)).toBe("light");
    } finally {
      restore();
    }
  });

  test("returns empty string when the preferred slug is not in themes", () => {
    const restore = stubMatchMedia(true);
    try {
      // "dark" is preferred but this catalog does not offer it.
      expect(matchSystemTheme(["light", "abyss"])).toBe("");
    } finally {
      restore();
    }
  });

  test("returns empty string when matchMedia is unavailable (SSR / jsdom)", () => {
    expect(typeof window.matchMedia).toBe("undefined");
    expect(matchSystemTheme(THEMES)).toBe("");
  });
});

describe("ThemePicker — detectFromSystem prop", () => {
  test("resolves the initial theme from the OS preference when opted in", async () => {
    const restore = stubMatchMedia(true);
    try {
      render(
        <ThemePicker
          label="Theme"
          themesUrl={URL_TRAILING}
          themes={THEMES}
          detectFromSystem
        />,
      );
      await flush();
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    } finally {
      restore();
    }
  });

  test("storage beats detection", async () => {
    const restore = stubMatchMedia(true);
    try {
      localStorage.setItem("k", "abyss");
      render(
        <ThemePicker
          label="Theme"
          themesUrl={URL_TRAILING}
          themes={THEMES}
          storageKey="k"
          detectFromSystem
        />,
      );
      await flush();
      expect(document.documentElement.getAttribute("data-theme")).toBe("abyss");
    } finally {
      restore();
    }
  });

  test("value beats detection", async () => {
    const restore = stubMatchMedia(true);
    try {
      render(
        <ThemePicker
          label="Theme"
          themesUrl={URL_TRAILING}
          themes={THEMES}
          value="abyss"
          detectFromSystem
        />,
      );
      await flush();
      expect(document.documentElement.getAttribute("data-theme")).toBe("abyss");
    } finally {
      restore();
    }
  });

  test("detection beats defaultValue", async () => {
    const restore = stubMatchMedia(true);
    try {
      render(
        <ThemePicker
          label="Theme"
          themesUrl={URL_TRAILING}
          themes={THEMES}
          defaultValue="abyss"
          detectFromSystem
        />,
      );
      await flush();
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    } finally {
      restore();
    }
  });

  test("detection is off unless opted in", async () => {
    const restore = stubMatchMedia(true);
    try {
      render(
        <ThemePicker label="Theme" themesUrl={URL_TRAILING} themes={THEMES} />,
      );
      await flush();
      // Falls through to "light", not the OS-preferred "dark".
      expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    } finally {
      restore();
    }
  });
});

describe("ThemePicker — markup contract (§4.2, §7.1–§7.5)", () => {
  test("§7.1 renders a button that controls a listbox", () => {
    render(
      <ThemePicker label="Theme" themesUrl={URL_TRAILING} themes={THEMES} />,
    );
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
    render(
      <ThemePicker label="Theme" themesUrl={URL_TRAILING} themes={THEMES} />,
    );
    const icon = document.querySelector(".theme-picker-icon") as HTMLElement;
    // U+25D1 CIRCLE WITH RIGHT HALF BLACK, decimal &#9681;
    expect(icon.textContent).toBe("\u25D1");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
  });

  test("§7.1 the root is a div carrying the class hook", () => {
    const { container } = render(
      <ThemePicker
        label="Theme"
        themesUrl={URL_TRAILING}
        themes={THEMES}
        className="mine"
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe("DIV");
    expect(root.className).toBe("theme-picker mine");
  });

  test("§7.2 aria-label names the button and the listbox", () => {
    render(
      <ThemePicker
        label="Choose theme"
        themesUrl={URL_TRAILING}
        themes={THEMES}
      />,
    );
    expect(screen.getByRole("button", { name: "Choose theme" })).toBeTruthy();
    expect(getList().getAttribute("aria-label")).toBe("Choose theme");
  });

  test("§7.3 one option per theme; the hidden input carries the supplied name", async () => {
    render(
      <ThemePicker
        label="Theme"
        themesUrl={URL_TRAILING}
        themes={THEMES}
        name="appearance"
      />,
    );
    await flush();
    const options = document.querySelectorAll(".theme-picker-option");
    expect(options.length).toBe(THEMES.length);
    const hidden = document.querySelector(
      'input[type="hidden"]',
    ) as HTMLInputElement;
    expect(hidden.name).toBe("appearance");
    expect(hidden.value).toBe("light");
  });

  test("§7.4 the listbox is hidden until the button is activated", () => {
    render(
      <ThemePicker label="Theme" themesUrl={URL_TRAILING} themes={THEMES} />,
    );
    expect(getList().hasAttribute("hidden")).toBe(true);
    fireEvent.click(screen.getByRole("button"));
    expect(getList().hasAttribute("hidden")).toBe(false);
    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  test("§7.4 the active theme is the aria-selected option", async () => {
    render(
      <ThemePicker label="Theme" themesUrl={URL_TRAILING} themes={THEMES} />,
    );
    await flush();
    fireEvent.click(screen.getByRole("button"));
    const selected = document.querySelectorAll(
      '[role="option"][aria-selected="true"]',
    );
    expect(selected.length).toBe(1);
    expect(selected[0].textContent?.trim()).toBe("Light");
  });

  test("§7.5 default labels title-case the slug (no 'default' string)", () => {
    const { container } = render(
      <ThemePicker
        label="Theme"
        themesUrl={URL_TRAILING}
        themes={["light", "dark"]}
      />,
    );
    expect(screen.getByText("Light")).toBeTruthy();
    expect(screen.getByText("Dark")).toBeTruthy();
    expect(container.textContent ?? "").not.toMatch(/default/i);
  });

  test("§7.5 themeLabels override the default title-case label", () => {
    render(
      <ThemePicker
        label="Theme"
        themesUrl={URL_TRAILING}
        themes={["light", "dark"]}
        themeLabels={{ light: "Bright", dark: "Midnight" }}
      />,
    );
    expect(screen.getByText("Bright")).toBeTruthy();
    expect(screen.getByText("Midnight")).toBeTruthy();
  });
});

describe("ThemePicker — keyboard contract (APG listbox)", () => {
  function openWith(key: string) {
    render(
      <ThemePicker label="Theme" themesUrl={URL_TRAILING} themes={THEMES} />,
    );
    const button = screen.getByRole("button");
    fireEvent.keyDown(button, { key });
    return { button, list: getList() };
  }

  test("§7.14 ArrowDown, Enter and Space all open the listbox", () => {
    for (const key of ["ArrowDown", "Enter", " "]) {
      const { list } = openWith(key);
      expect(list.hasAttribute("hidden")).toBe(false);
      cleanup();
    }
  });

  test("§7.14 ArrowUp opens with the last option active", () => {
    const { list } = openWith("ArrowUp");
    expect(list.getAttribute("aria-activedescendant")).toBe(
      list.children[THEMES.length - 1].id,
    );
  });

  test("§7.14 opening moves focus to the listbox", () => {
    const { list } = openWith("ArrowDown");
    expect(document.activeElement).toBe(list);
  });

  test("§7.15 ArrowDown / ArrowUp move the active descendant and clamp", () => {
    const { list } = openWith("ArrowDown");
    expect(list.getAttribute("aria-activedescendant")).toBe(
      list.children[0].id,
    );
    fireEvent.keyDown(list, { key: "ArrowDown" });
    expect(list.getAttribute("aria-activedescendant")).toBe(
      list.children[1].id,
    );
    fireEvent.keyDown(list, { key: "ArrowUp" });
    fireEvent.keyDown(list, { key: "ArrowUp" });
    // Clamps at the top rather than wrapping.
    expect(list.getAttribute("aria-activedescendant")).toBe(
      list.children[0].id,
    );
  });

  test("§7.15 ArrowDown clamps at the last option", () => {
    const { list } = openWith("ArrowDown");
    for (let n = 0; n < THEMES.length + 3; n++) {
      fireEvent.keyDown(list, { key: "ArrowDown" });
    }
    expect(list.getAttribute("aria-activedescendant")).toBe(
      list.children[THEMES.length - 1].id,
    );
  });

  test("§7.15 the active option is marked with data-active", () => {
    const { list } = openWith("ArrowDown");
    fireEvent.keyDown(list, { key: "ArrowDown" });
    const active = document.querySelectorAll("[data-active]");
    expect(active.length).toBe(1);
    expect(active[0].id).toBe(list.children[1].id);
  });

  test("§7.15 Home and End jump to the first and last option", () => {
    const { list } = openWith("ArrowDown");
    fireEvent.keyDown(list, { key: "End" });
    expect(list.getAttribute("aria-activedescendant")).toBe(
      list.children[THEMES.length - 1].id,
    );
    fireEvent.keyDown(list, { key: "Home" });
    expect(list.getAttribute("aria-activedescendant")).toBe(
      list.children[0].id,
    );
  });

  test("§7.16 Enter selects the active option, applies it, and closes", async () => {
    const { button, list } = openWith("ArrowDown");
    fireEvent.keyDown(list, { key: "ArrowDown" });
    fireEvent.keyDown(list, { key: "Enter" });
    await flush();
    expect(list.hasAttribute("hidden")).toBe(true);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  test("§7.16 Enter returns focus to the button", async () => {
    const { button, list } = openWith("ArrowDown");
    fireEvent.keyDown(list, { key: "ArrowDown" });
    fireEvent.keyDown(list, { key: "Enter" });
    await flush();
    expect(document.activeElement).toBe(button);
  });

  test("§7.16 Space selects the active option and closes", async () => {
    const { list } = openWith("ArrowDown");
    fireEvent.keyDown(list, { key: "End" });
    fireEvent.keyDown(list, { key: " " });
    await flush();
    expect(list.hasAttribute("hidden")).toBe(true);
    expect(document.documentElement.dataset.theme).toBe("abyss");
  });

  test("§7.16 Escape closes without changing the theme", async () => {
    const { button, list } = openWith("ArrowDown");
    await flush();
    fireEvent.keyDown(list, { key: "ArrowDown" });
    fireEvent.keyDown(list, { key: "Escape" });
    await flush();
    expect(list.hasAttribute("hidden")).toBe(true);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.activeElement).toBe(button);
  });

  test("§7.16 Tab closes the listbox and parks focus on the button", async () => {
    const { button, list } = openWith("ArrowDown");
    fireEvent.keyDown(list, { key: "Tab" });
    await flush();
    expect(list.hasAttribute("hidden")).toBe(true);
    // Focus goes to the button first (without cancelling the key), so
    // the browser's default Tab proceeds from the picker's position.
    expect(document.activeElement).toBe(button);
  });

  test("§7.17 typeahead moves the active descendant by label prefix", () => {
    const { list } = openWith("ArrowDown");
    fireEvent.keyDown(list, { key: "a" });
    // "Abyss" is index 2 in THEMES.
    expect(list.getAttribute("aria-activedescendant")).toBe(
      list.children[2].id,
    );
  });

  test("§7.17 typeahead accumulates characters within the buffer window", () => {
    const { list } = openWith("ArrowDown");
    fireEvent.keyDown(list, { key: "d" });
    expect(list.getAttribute("aria-activedescendant")).toBe(
      list.children[1].id,
    );
    // "da" still matches "Dark", so the active option does not move on.
    fireEvent.keyDown(list, { key: "a" });
    expect(list.getAttribute("aria-activedescendant")).toBe(
      list.children[1].id,
    );
  });

  test("§7.17 the typeahead buffer resets after the idle window", async () => {
    vi.useFakeTimers();
    try {
      render(
        <ThemePicker label="Theme" themesUrl={URL_TRAILING} themes={THEMES} />,
      );
      const list = getList();
      fireEvent.keyDown(screen.getByRole("button"), { key: "ArrowDown" });
      fireEvent.keyDown(list, { key: "d" });
      expect(list.getAttribute("aria-activedescendant")).toBe(
        list.children[1].id,
      );
      vi.advanceTimersByTime(600);
      // Buffer cleared, so "a" starts a fresh search and finds "Abyss".
      fireEvent.keyDown(list, { key: "a" });
      expect(list.getAttribute("aria-activedescendant")).toBe(
        list.children[2].id,
      );
    } finally {
      vi.useRealTimers();
    }
  });

  test("§7.18 clicking an option selects and applies it", async () => {
    render(
      <ThemePicker label="Theme" themesUrl={URL_TRAILING} themes={THEMES} />,
    );
    await flush();
    pick("abyss");
    await flush();
    expect(document.documentElement.dataset.theme).toBe("abyss");
    expect(getList().hasAttribute("hidden")).toBe(true);
  });

  test("§7.18 clicking outside closes the listbox without changing the theme", async () => {
    render(
      <ThemePicker label="Theme" themesUrl={URL_TRAILING} themes={THEMES} />,
    );
    await flush();
    fireEvent.click(screen.getByRole("button"));
    expect(getList().hasAttribute("hidden")).toBe(false);
    fireEvent.click(document.body);
    await flush();
    expect(getList().hasAttribute("hidden")).toBe(true);
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  test("§7.18 clicking the button again closes the listbox", () => {
    render(
      <ThemePicker label="Theme" themesUrl={URL_TRAILING} themes={THEMES} />,
    );
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(getList().hasAttribute("hidden")).toBe(false);
    fireEvent.click(button);
    expect(getList().hasAttribute("hidden")).toBe(true);
  });
});

describe("ThemePicker — dynamic loading (§5, §7.6–§7.11)", () => {
  test("§7.6 default initial value is 'light' when present in themes", async () => {
    render(
      <ThemePicker label="Theme" themesUrl={URL_TRAILING} themes={THEMES} />,
    );
    await flush();
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  test("§7.6 default initial value falls back to themes[0] when 'light' is absent", async () => {
    render(
      <ThemePicker
        label="Theme"
        themesUrl={URL_TRAILING}
        themes={["dark", "abyss"]}
      />,
    );
    await flush();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  test("§7.7 injects a managed <link> with the resolved href", async () => {
    render(
      <ThemePicker label="Theme" themesUrl={URL_TRAILING} themes={THEMES} />,
    );
    await flush();
    const link = getManagedLink();
    expect(link).not.toBeNull();
    expect(link!.rel).toBe("stylesheet");
    expect(link!.href.endsWith("/assets/themes/light.css")).toBe(true);
  });

  test("§7.7 the name prop discriminates the managed <link>", async () => {
    render(
      <ThemePicker
        label="Theme"
        themesUrl={URL_TRAILING}
        themes={THEMES}
        name="appearance"
      />,
    );
    await flush();
    expect(getManagedLink("appearance")).not.toBeNull();
    expect(getManagedLink("theme")).toBeNull();
  });

  test("§7.8 selecting an option updates href, data-theme, and fires onChange", async () => {
    const onChange = vi.fn();
    render(
      <ThemePicker
        label="Theme"
        themesUrl={URL_TRAILING}
        themes={THEMES}
        onChange={onChange}
      />,
    );
    await flush();
    pick("abyss");
    await flush();
    expect(document.documentElement.dataset.theme).toBe("abyss");
    expect(getManagedLink()!.href.endsWith("/assets/themes/abyss.css")).toBe(
      true,
    );
    expect(onChange).toHaveBeenCalledWith("abyss");
  });

  test("§7.9 persists to localStorage and reads back on a fresh mount", async () => {
    const { unmount } = render(
      <ThemePicker
        label="Theme"
        themesUrl={URL_TRAILING}
        themes={THEMES}
        storageKey="lily-theme"
      />,
    );
    await flush();
    pick("dark");
    await flush();
    expect(localStorage.getItem("lily-theme")).toBe("dark");
    unmount();

    document.documentElement.removeAttribute("data-theme");
    document.head
      .querySelectorAll("link[data-lily-theme-picker]")
      .forEach((n) => n.remove());

    render(
      <ThemePicker
        label="Theme"
        themesUrl={URL_TRAILING}
        themes={THEMES}
        storageKey="lily-theme"
      />,
    );
    await flush();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  test("§7.10 a supplied value prop wins over storage and defaults", async () => {
    localStorage.setItem("lily-theme", "abyss");
    render(
      <ThemePicker
        label="Theme"
        themesUrl={URL_TRAILING}
        themes={THEMES}
        value="light"
        storageKey="lily-theme"
      />,
    );
    await flush();
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  test("§7.11 missing trailing slash on themesUrl still yields one slash", async () => {
    render(
      <ThemePicker
        label="Theme"
        themesUrl={URL_NO_TRAILING}
        themes={THEMES}
      />,
    );
    await flush();
    expect(getManagedLink()!.href.endsWith("/assets/themes/light.css")).toBe(
      true,
    );
  });
});

describe("ThemePicker — spread + custom children (§7.12–§7.13)", () => {
  test("§7.12 extra attributes spread onto the root div", () => {
    render(
      <ThemePicker
        label="Theme"
        themesUrl={URL_TRAILING}
        themes={THEMES}
        data-testid="tp"
      />,
    );
    const root = screen.getByTestId("tp");
    expect(root.tagName).toBe("DIV");
    expect(root.className).toContain("theme-picker");
  });

  test("§7.13 children replace the button glyph and receive ChildArgs", async () => {
    render(
      <ThemePicker
        label="Theme"
        themesUrl={URL_TRAILING}
        themes={THEMES}
        value="dark"
      >
        {(args: ChildArgs) => (
          <span
            data-testid="custom"
            data-open={String(args.open)}
            data-value={args.value}
            data-label-light={args.labelFor("light")}
          >
            custom glyph
          </span>
        )}
      </ThemePicker>,
    );
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

  test("§7.13 children see open=true once the listbox is expanded", () => {
    render(
      <ThemePicker
        label="Theme"
        themesUrl={URL_TRAILING}
        themes={THEMES}
        value="dark"
      >
        {(args: ChildArgs) => (
          <span data-testid="custom" data-open={String(args.open)}>
            glyph
          </span>
        )}
      </ThemePicker>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("custom").getAttribute("data-open")).toBe("true");
  });
});

describe("ThemePicker — accessibility hardening (§7.21–§7.24)", () => {
  async function openPicker(themes: string[] = THEMES) {
    render(
      <ThemePicker label="Theme" themesUrl={URL_TRAILING} themes={themes} />,
    );
    await flush();
    fireEvent.click(screen.getByRole("button"));
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
    fireEvent.keyDown(list, { key: "Tab" });
    await flush();
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
    fireEvent.keyDown(list, { key: "d" });
    expect(active(list)).toBe("Dark");
    fireEvent.keyDown(list, { key: "d" });
    expect(active(list)).toBe("Dim");
    fireEvent.keyDown(list, { key: "d" });
    expect(active(list)).toBe("Dracula");
  });

  test("§7.22 a multi-character buffer refines the match from the active option", async () => {
    const { list } = await openPicker(["dark", "dim", "dracula", "light"]);
    fireEvent.keyDown(list, { key: "d" });
    fireEvent.keyDown(list, { key: "r" });
    expect(active(list)).toBe("Dracula");
  });

  test("§7.23 PageUp and PageDown move the cursor by ten, clamped", async () => {
    const many = Array.from(
      { length: 25 },
      (_, i) => `t${String(i).padStart(2, "0")}`,
    );
    const { list } = await openPicker(many);
    fireEvent.keyDown(list, { key: "PageDown" });
    expect(active(list)).toBe("T10");
    fireEvent.keyDown(list, { key: "PageDown" });
    expect(active(list)).toBe("T20");
    fireEvent.keyDown(list, { key: "PageDown" });
    expect(active(list)).toBe("T24");
    fireEvent.keyDown(list, { key: "PageUp" });
    expect(active(list)).toBe("T14");
  });

  test("§7.24 an empty list opens without aria-activedescendant", async () => {
    const { list } = await openPicker([]);
    expect(list.hasAttribute("hidden")).toBe(false);
    expect(list.getAttribute("aria-activedescendant")).toBeNull();
  });
});
