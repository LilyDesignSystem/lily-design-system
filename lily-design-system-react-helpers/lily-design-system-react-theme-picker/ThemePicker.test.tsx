import * as React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import ThemePicker, {
    normalizeThemesUrl,
    themeHref,
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
});

describe("ThemePicker — markup contract (§4.2, §7.1–§7.5)", () => {
    test("§7.1 renders a fieldset with role=radiogroup", () => {
        render(
            <ThemePicker label="Theme" themesUrl={URL_TRAILING} themes={THEMES} />,
        );
        const group = screen.getByRole("radiogroup");
        expect(group.tagName).toBe("FIELDSET");
    });

    test("§7.2 aria-label is the supplied label", () => {
        render(
            <ThemePicker
                label="Choose theme"
                themesUrl={URL_TRAILING}
                themes={THEMES}
            />,
        );
        expect(screen.getByLabelText("Choose theme")).toBeTruthy();
    });

    test("§7.3 one radio per theme, sharing the supplied name", () => {
        render(
            <ThemePicker
                label="Theme"
                themesUrl={URL_TRAILING}
                themes={THEMES}
                name="appearance"
            />,
        );
        const radios = screen.getAllByRole("radio") as HTMLInputElement[];
        expect(radios.length).toBe(3);
        expect(radios.every((r) => r.name === "appearance")).toBe(true);
    });

    test("§7.4 each radio carries the slug as its value", () => {
        render(
            <ThemePicker label="Theme" themesUrl={URL_TRAILING} themes={THEMES} />,
        );
        const radios = screen.getAllByRole("radio") as HTMLInputElement[];
        expect(radios.map((r) => r.value)).toEqual(THEMES);
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

    test("§7.8 selecting a radio updates href, data-theme, and fires onChange", async () => {
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
        const radios = screen.getAllByRole("radio") as HTMLInputElement[];
        fireEvent.click(radios[2]); // abyss
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
        const radios = screen.getAllByRole("radio") as HTMLInputElement[];
        fireEvent.click(radios[1]); // dark
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
    test("§7.12 extra attributes spread onto the fieldset", () => {
        render(
            <ThemePicker
                label="Theme"
                themesUrl={URL_TRAILING}
                themes={THEMES}
                data-testid="tp"
            />,
        );
        expect(screen.getByTestId("tp")).toBeTruthy();
    });

    test("§7.13 children render prop receives ChildArgs", () => {
        render(
            <ThemePicker
                label="Theme"
                themesUrl={URL_TRAILING}
                themes={THEMES}
                name="scheme"
            >
                {(args: ChildArgs) => (
                    <div data-testid="custom" data-name={args.name}>
                        {args.themes.join(",")}
                    </div>
                )}
            </ThemePicker>,
        );
        const custom = screen.getByTestId("custom");
        expect(custom.textContent).toBe("light,dark,abyss");
        expect(custom.getAttribute("data-name")).toBe("scheme");
    });
});
