import { render, screen, fireEvent } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import ThemeSelect, {
    normaliseThemesUrl,
    themeHref,
    themeName,
    matchSystemTheme,
} from "./ThemeSelect.svelte";

const THEMES = ["light", "dark", "abyss"];
const URL_TRAILING = "/assets/themes/";
const URL_NO_TRAILING = "/assets/themes";

function getManagedLink(name = "theme"): HTMLLinkElement | null {
    return document.head.querySelector<HTMLLinkElement>(
        `link[data-lily-theme-select="${name}"]`,
    );
}

function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
}

beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.head
        .querySelectorAll("link[data-lily-theme-select]")
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

describe("ThemeSelect — pure helpers", () => {
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
    const opts = document.querySelectorAll(".theme-select-option");
    await fireEvent.click(opts[themes.indexOf(slug)]);
}

describe("ThemeSelect — markup contract (§4.2, §7.1–§7.5)", () => {
    test("§7.1 renders a button that controls a listbox", () => {
        render(ThemeSelect, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
        });
        const button = screen.getByRole("button");
        expect(button.tagName).toBe("BUTTON");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("aria-haspopup")).toBe("listbox");
        expect(button.getAttribute("aria-expanded")).toBe("false");
        const listId = button.getAttribute("aria-controls");
        expect(listId).toBeTruthy();
        expect(document.getElementById(listId!)?.getAttribute("role")).toBe("listbox");
    });

    test("§7.1 the button renders the half-circle glyph, hidden from assistive tech", () => {
        render(ThemeSelect, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
        });
        const icon = document.querySelector(".theme-select-icon") as HTMLElement;
        // U+25D1 CIRCLE WITH RIGHT HALF BLACK, decimal &#9681;
        expect(icon.textContent).toBe("\u25D1");
        expect(icon.getAttribute("aria-hidden")).toBe("true");
    });

    test("§7.2 aria-label names the button and the listbox", () => {
        render(ThemeSelect, {
            props: { label: "Choose theme", themesUrl: URL_TRAILING, themes: THEMES },
        });
        expect(screen.getByRole("button", { name: "Choose theme" })).toBeTruthy();
        const list = document.querySelector(".theme-select-list") as HTMLElement;
        expect(list.getAttribute("aria-label")).toBe("Choose theme");
    });

    test("§7.3 one option per theme; the hidden input carries the supplied name", async () => {
        render(ThemeSelect, {
            props: {
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
                name: "appearance",
            },
        });
        await flush();
        const options = document.querySelectorAll(".theme-select-option");
        expect(options.length).toBe(THEMES.length);
        const hidden = document.querySelector('input[type="hidden"]') as HTMLInputElement;
        expect(hidden.name).toBe("appearance");
        expect(hidden.value).toBe("light");
    });

    test("§7.4 the listbox is hidden until the button is activated", async () => {
        render(ThemeSelect, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
        });
        const list = document.querySelector(".theme-select-list") as HTMLElement;
        expect(list.hasAttribute("hidden")).toBe(true);
        await fireEvent.click(screen.getByRole("button"));
        expect(list.hasAttribute("hidden")).toBe(false);
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
    });

    test("§7.4 the active theme is the aria-selected option", async () => {
        render(ThemeSelect, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
        });
        await flush();
        await fireEvent.click(screen.getByRole("button"));
        const selected = document.querySelectorAll('[role="option"][aria-selected="true"]');
        expect(selected.length).toBe(1);
        expect(selected[0].textContent?.trim()).toBe("Light");
    });

    test("§7.5 default labels title-case the slug (no 'default' string)", () => {
        const { container } = render(ThemeSelect, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: ["light", "dark"] },
        });
        expect(screen.getByText("Light")).toBeTruthy();
        expect(screen.getByText("Dark")).toBeTruthy();
        expect(container.textContent ?? "").not.toMatch(/default/i);
    });

    test("§7.5 themeLabels override the default title-case label", () => {
        render(ThemeSelect, {
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

describe("ThemeSelect — keyboard contract (APG listbox)", () => {
    async function openWith(key: string) {
        render(ThemeSelect, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
        });
        await flush();
        const button = screen.getByRole("button");
        await fireEvent.keyDown(button, { key });
        await flush();
        return {
            button,
            list: document.querySelector(".theme-select-list") as HTMLElement,
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
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[0].id);
        await fireEvent.keyDown(list, { key: "ArrowDown" });
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[1].id);
        await fireEvent.keyDown(list, { key: "ArrowUp" });
        await fireEvent.keyDown(list, { key: "ArrowUp" });
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[0].id);
    });

    test("§7.15 Home and End jump to the first and last option", async () => {
        const { list } = await openWith("ArrowDown");
        await fireEvent.keyDown(list, { key: "End" });
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[THEMES.length - 1].id,
        );
        await fireEvent.keyDown(list, { key: "Home" });
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[0].id);
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
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[2].id);
    });
});

describe("ThemeSelect — dynamic loading (§5, §7.6–§7.11)", () => {
    test("§7.6 default initial value is 'light' when present in themes", async () => {
        render(ThemeSelect, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
        });
        await flush();
        expect(document.documentElement.dataset.theme).toBe("light");
    });

    test("§7.6 default initial value falls back to themes[0] when 'light' is absent", async () => {
        render(ThemeSelect, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: ["dark", "abyss"] },
        });
        await flush();
        expect(document.documentElement.dataset.theme).toBe("dark");
    });

    test("§7.7 injects a managed <link> with the resolved href", async () => {
        render(ThemeSelect, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
        });
        await flush();
        const link = getManagedLink();
        expect(link).not.toBeNull();
        expect(link!.rel).toBe("stylesheet");
        expect(link!.href.endsWith("/assets/themes/light.css")).toBe(true);
    });

    test("§7.8 selecting an option updates href, data-theme, and fires onChange", async () => {
        const onChange = vi.fn();
        render(ThemeSelect, {
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
        expect(getManagedLink()!.href.endsWith("/assets/themes/abyss.css")).toBe(true);
        expect(onChange).toHaveBeenCalledWith("abyss");
    });

    test("§7.9 persists to localStorage and reads back on fresh mount", async () => {
        const { unmount } = render(ThemeSelect, {
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
            .querySelectorAll("link[data-lily-theme-select]")
            .forEach((n) => n.remove());

        render(ThemeSelect, {
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
        render(ThemeSelect, {
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
        render(ThemeSelect, {
            props: { label: "Theme", themesUrl: URL_NO_TRAILING, themes: THEMES },
        });
        await flush();
        expect(getManagedLink()!.href.endsWith("/assets/themes/light.css")).toBe(true);
    });
});

describe("ThemeSelect — spread + custom children (§7.12–§7.13)", () => {
    test("§7.12 extra attributes spread onto the <select>", () => {
        render(ThemeSelect, {
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

        render(ThemeSelect, {
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
        expect(custom.closest("button")?.className).toContain("theme-select-button");
        expect(document.querySelector(".theme-select-icon")).toBeNull();
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

describe("ThemeSelect — harmonised surface with locale-select", () => {
    test("§7.18 themeName title-cases each hyphen-separated word", () => {
        expect(themeName("light")).toBe("Light");
        expect(themeName("high-contrast")).toBe("High Contrast");
        expect(themeName("united-kingdom-national-health-service")).toBe(
            "United Kingdom National Health Service",
        );
    });

    test("§7.18 themeName is what the default option label uses", () => {
        render(ThemeSelect, {
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
        render(ThemeSelect, {
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
        render(ThemeSelect, {
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
        render(ThemeSelect, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
        });
        await flush();
        expect(document.documentElement.dataset.theme).toBe("light");
        restore();
    });
});
