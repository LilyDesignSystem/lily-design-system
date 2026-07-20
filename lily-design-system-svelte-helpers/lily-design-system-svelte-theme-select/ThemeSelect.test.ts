import { render, screen, fireEvent } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import ThemeSelect, { normaliseThemesUrl, themeHref } from "./ThemeSelect.svelte";

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

describe("ThemeSelect — markup contract (§4.2, §7.1–§7.5)", () => {
    test("§7.1 renders a <select> with role=combobox", () => {
        render(ThemeSelect, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
        });
        const select = screen.getByRole("combobox");
        expect(select.tagName).toBe("SELECT");
    });

    test("§7.2 aria-label is the supplied label", () => {
        render(ThemeSelect, {
            props: { label: "Choose theme", themesUrl: URL_TRAILING, themes: THEMES },
        });
        expect(screen.getByLabelText("Choose theme")).toBeTruthy();
    });

    test("§7.3 one option per theme; the select carries the supplied name", () => {
        render(ThemeSelect, {
            props: {
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
                name: "appearance",
            },
        });
        const options = screen.getAllByRole("option") as HTMLOptionElement[];
        // One placeholder option plus one option per theme.
        expect(options.length).toBe(4);
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        expect(select.name).toBe("appearance");
    });

    test("§7.4 each option carries the slug as its value, after the empty placeholder", () => {
        render(ThemeSelect, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
        });
        const options = screen.getAllByRole("option") as HTMLOptionElement[];
        expect(options.map((o) => o.value)).toEqual(["", ...THEMES]);
    });

    test("§7.4 the placeholder option renders the label and stays displayed", async () => {
        render(ThemeSelect, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
        });
        await flush();
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        const placeholder = select.querySelector(
            ".theme-select-placeholder",
        ) as HTMLOptionElement;
        expect(placeholder.textContent?.trim()).toBe("Theme");
        expect(placeholder.value).toBe("");
        // The closed control shows the placeholder, not the active theme.
        expect(select.value).toBe("");
        expect(document.documentElement.dataset.theme).toBe("light");
    });

    test("§7.4 the placeholder prop overrides the label as placeholder text", () => {
        render(ThemeSelect, {
            props: {
                label: "Choose a theme",
                placeholder: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
            },
        });
        const placeholder = document.querySelector(
            ".theme-select-placeholder",
        ) as HTMLOptionElement;
        expect(placeholder.textContent?.trim()).toBe("Theme");
        expect(screen.getByLabelText("Choose a theme")).toBeTruthy();
    });

    test("§7.4 choosing a theme applies it and snaps the select back to the placeholder", async () => {
        render(ThemeSelect, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
        });
        await flush();
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        select.value = "abyss";
        select.dispatchEvent(new Event("change", { bubbles: true }));
        await flush();
        expect(document.documentElement.dataset.theme).toBe("abyss");
        expect(select.value).toBe("");
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
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        await fireEvent.change(select, { target: { value: "abyss" } });
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
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        await fireEvent.change(select, { target: { value: "dark" } });
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

    test("§7.13 children snippet receives ChildArgs", () => {
        // Render a custom snippet that surfaces the slugs and `name`.
        const customSnippet = (($anchor: Comment, args: any) => {
            const node = document.createElement("option");
            node.setAttribute("data-testid", "custom");
            node.setAttribute("data-name", args().name);
            node.textContent = args().themes.join(",");
            $anchor.before(node);
        }) as any;

        render(ThemeSelect, {
            props: {
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
                name: "scheme",
                children: customSnippet,
            },
        });
        const custom = screen.getByTestId("custom");
        expect(custom.textContent).toBe("light,dark,abyss");
        expect(custom.getAttribute("data-name")).toBe("scheme");
    });
});
