import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./TreeListItem";

describe("TreeListItem", () => {
    test("renders a li element with class tree-list-item", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".tree-list-item");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("LI");
    });

    test("renders children content", () => {
        const { container } = render(<Subject>content</Subject>);
        expect(container.textContent).toContain("content");
    });

    test("applies role=treeitem", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".tree-list-item");
        expect(root?.getAttribute("role")).toBe("treeitem");
    });

    test("does not set aria-label when label is omitted", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".tree-list-item");
        expect(root?.getAttribute("aria-label")).toBeNull();
    });

    test("applies aria-label when label prop is provided", () => {
        const { container } = render(<Subject label="Hello">content</Subject>);
        const root = container.querySelector(".tree-list-item");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(<Subject data-testid="subject">content</Subject>);
        expect(container.querySelector("[data-testid='subject']")).toBeTruthy();
    });

    test("is a focusable li role=treeitem (tabindex=-1) so TreeList's arrow keys can focus it", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".tree-list-item");
        expect(root?.tagName).toBe("LI");
        expect(root?.getAttribute("role")).toBe("treeitem");
        expect(root?.getAttribute("tabindex")).toBe("-1");
    });

    test("a consumer tabIndex overrides the default (roving tabindex: the active item is 0)", () => {
        const { container } = render(<Subject tabIndex={0}>content</Subject>);
        expect(container.querySelector(".tree-list-item")?.getAttribute("tabindex")).toBe("0");
    });
});
