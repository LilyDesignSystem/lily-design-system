import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./ThemeProvider.vue";

describe("ThemeProvider", () => {
    test("renders a div with class theme-provider", () => {
        const { container } = render(Subject, {
            props: { theme: { primary: "#fff" } },
            slots: { default: "x" },
        });
        const root = container.querySelector(".theme-provider");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("defaults data-theme to light", () => {
        const { container } = render(Subject, {
            props: { theme: { primary: "#fff" } },
            slots: { default: "x" },
        });
        expect(container.querySelector(".theme-provider")?.getAttribute("data-theme")).toBe("light");
    });

    test("applies data-theme=dark when base=dark", () => {
        const { container } = render(Subject, {
            props: { theme: { primary: "#000" }, base: "dark" },
            slots: { default: "x" },
        });
        expect(container.querySelector(".theme-provider")?.getAttribute("data-theme")).toBe("dark");
    });

    test("flattens flat keys to --theme-* CSS variables", () => {
        const { container } = render(Subject, {
            props: { theme: { primary: "#fff", danger: "#dc2626" } },
            slots: { default: "x" },
        });
        const root = container.querySelector(".theme-provider") as HTMLElement;
        expect(root.style.getPropertyValue("--theme-primary")).toBe("#fff");
        expect(root.style.getPropertyValue("--theme-danger")).toBe("#dc2626");
    });

    test("flattens nested keys with hyphenated paths", () => {
        const { container } = render(Subject, {
            props: { theme: { color: { primary: "#fff", danger: "#dc2626" } } },
            slots: { default: "x" },
        });
        const root = container.querySelector(".theme-provider") as HTMLElement;
        expect(root.style.getPropertyValue("--theme-color-primary")).toBe("#fff");
        expect(root.style.getPropertyValue("--theme-color-danger")).toBe("#dc2626");
    });

    test("uses display: contents on the wrapper", () => {
        const { container } = render(Subject, {
            props: { theme: { primary: "#fff" } },
            slots: { default: "x" },
        });
        const root = container.querySelector(".theme-provider") as HTMLElement;
        expect(root.style.display).toBe("contents");
    });

    test("renders slot content", () => {
        const { container } = render(Subject, {
            props: { theme: { primary: "#fff" } },
            slots: { default: "hello" },
        });
        expect(container.textContent).toBe("hello");
    });
});
