import { afterEach, describe, expect, test } from "vitest";

import { ThemeProvider } from "./theme-provider.js";

if (!customElements.get("lily-theme-provider")) {
    customElements.define("lily-theme-provider", ThemeProvider);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ThemeProvider", () => {
    test("carries the base class", () => {
        const host = render("<lily-theme-provider></lily-theme-provider>");

        expect(host.classList.contains("theme-provider")).toBe(true);
    });

    test("uses display: contents on the host", () => {
        const host = render("<lily-theme-provider></lily-theme-provider>") as unknown as HTMLElement;

        expect(host.style.display).toBe("contents");
    });

    test("defaults data-theme to light", () => {
        const host = render("<lily-theme-provider></lily-theme-provider>");

        expect(host.getAttribute("data-theme")).toBe("light");
    });

    test("applies data-theme=dark when base=dark", () => {
        const host = render('<lily-theme-provider base="dark"></lily-theme-provider>');

        expect(host.getAttribute("data-theme")).toBe("dark");
    });

    test("the theme property flattens flat keys to --theme-* CSS variables", () => {
        const host = render("<lily-theme-provider></lily-theme-provider>") as unknown as ThemeProvider;

        host.theme = { primary: "#fff", danger: "#dc2626" };

        expect(host.style.getPropertyValue("--theme-primary")).toBe("#fff");
        expect(host.style.getPropertyValue("--theme-danger")).toBe("#dc2626");
    });

    test("the theme property flattens nested keys with hyphenated paths", () => {
        const host = render("<lily-theme-provider></lily-theme-provider>") as unknown as ThemeProvider;

        host.theme = { color: { primary: "#fff", danger: "#dc2626" } };

        expect(host.style.getPropertyValue("--theme-color-primary")).toBe("#fff");
        expect(host.style.getPropertyValue("--theme-color-danger")).toBe("#dc2626");
    });

    test("re-setting the theme property removes custom properties no longer present", () => {
        const host = render("<lily-theme-provider></lily-theme-provider>") as unknown as ThemeProvider;

        host.theme = { primary: "#fff", danger: "#dc2626" };
        host.theme = { primary: "#000" };

        expect(host.style.getPropertyValue("--theme-primary")).toBe("#000");
        expect(host.style.getPropertyValue("--theme-danger")).toBe("");
    });

    test("a theme attribute is parsed as a JSON-string fallback", () => {
        const host = render(
            '<lily-theme-provider theme=\'{"color":{"primary":"#2563eb"}}\'></lily-theme-provider>',
        ) as unknown as ThemeProvider;

        expect(host.style.getPropertyValue("--theme-color-primary")).toBe("#2563eb");
        expect(host.theme).toEqual({ color: { primary: "#2563eb" } });
    });

    test("preserves the consumer's children", () => {
        const host = render("<lily-theme-provider><p>Themed content</p></lily-theme-provider>");

        expect(host.querySelector("p")?.textContent).toBe("Themed content");
    });

    test("merges the consumer's class attribute with the base class", () => {
        const host = render('<lily-theme-provider class="my-provider"></lily-theme-provider>');

        expect(host.classList.contains("theme-provider")).toBe(true);
        expect(host.classList.contains("my-provider")).toBe(true);
    });
});
