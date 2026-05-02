import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ThemeProvider";

describe("ThemeProvider", () => {
    test("renders a div with class theme-provider", () => {
        const { container } = render(
            <Subject theme={{ primary: "#fff" }}>content</Subject>
        );
        const root = container.querySelector(".theme-provider");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("defaults data-theme to light", () => {
        const { container } = render(
            <Subject theme={{ primary: "#fff" }}>x</Subject>
        );
        expect(container.querySelector(".theme-provider")?.getAttribute("data-theme")).toBe("light");
    });

    test("applies data-theme=dark when base=dark", () => {
        const { container } = render(
            <Subject theme={{ primary: "#000" }} base="dark">x</Subject>
        );
        expect(container.querySelector(".theme-provider")?.getAttribute("data-theme")).toBe("dark");
    });

    test("flattens flat theme keys to --theme-* CSS variables", () => {
        const { container } = render(
            <Subject theme={{ primary: "#fff", danger: "#dc2626" }}>x</Subject>
        );
        const root = container.querySelector(".theme-provider") as HTMLElement;
        expect(root.style.getPropertyValue("--theme-primary")).toBe("#fff");
        expect(root.style.getPropertyValue("--theme-danger")).toBe("#dc2626");
    });

    test("flattens nested theme keys with hyphenated paths", () => {
        const { container } = render(
            <Subject theme={{ color: { primary: "#fff", danger: "#dc2626" } }}>x</Subject>
        );
        const root = container.querySelector(".theme-provider") as HTMLElement;
        expect(root.style.getPropertyValue("--theme-color-primary")).toBe("#fff");
        expect(root.style.getPropertyValue("--theme-color-danger")).toBe("#dc2626");
    });

    test("uses display: contents on the wrapper", () => {
        const { container } = render(
            <Subject theme={{ primary: "#fff" }}>x</Subject>
        );
        const root = container.querySelector(".theme-provider") as HTMLElement;
        expect(root.style.display).toBe("contents");
    });

    test("renders children", () => {
        const { container } = render(
            <Subject theme={{ primary: "#fff" }}>hello</Subject>
        );
        expect(container.textContent).toBe("hello");
    });
});
