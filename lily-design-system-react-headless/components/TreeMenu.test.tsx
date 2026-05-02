import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./TreeMenu";

describe("TreeMenu", () => {
    test("renders a div element with class tree-menu", () => {
        const { container } = render(<Subject label="Test">content</Subject>);
        const root = container.querySelector(".tree-menu");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(<Subject label="Test">content</Subject>);
        expect(container.textContent).toContain("content");
    });

    test("applies role=tree", () => {
        const { container } = render(<Subject label="Test">content</Subject>);
        const root = container.querySelector(".tree-menu");
        expect(root?.getAttribute("role")).toBe("tree");
    });

    test("applies aria-label from label prop", () => {
        const { container } = render(<Subject label="Hello">content</Subject>);
        const root = container.querySelector(".tree-menu");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(<Subject label="x" data-testid="subject">content</Subject>);
        expect(container.querySelector("[data-testid='subject']")).toBeTruthy();
    });
});
