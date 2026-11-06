import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Framer";

describe("Framer", () => {
    test("renders a div with class framer", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".framer");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(<Subject>content</Subject>);
        expect(container.textContent).toContain("content");
    });

    test("is a named group when labelled", () => {
        const { container } = render(<Subject label="Story">content</Subject>);
        const root = container.querySelector(".framer");
        expect(root?.getAttribute("role")).toBe("group");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });

    test("has no role without a label", () => {
        const { container } = render(<Subject>content</Subject>);
        expect(container.querySelector(".framer")?.hasAttribute("role")).toBe(false);
    });
});
