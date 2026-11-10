import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./TreeMenu";

describe("TreeMenu", () => {
    test("renders a ul element with class tree-menu", () => {
        const { container } = render(<Subject label="Test">content</Subject>);
        const root = container.querySelector(".tree-menu");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("UL");
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
        const { container } = render(
            <Subject
                label="x"
                data-testid="subject"
            >
                content
            </Subject>,
        );
        expect(container.querySelector("[data-testid='subject']")).toBeTruthy();
    });

    const tree = () => (
        <Subject label="Site">
            <ul>
                <li
                    role="treeitem"
                    tabIndex={-1}
                >
                    Home
                </li>
                <li
                    role="treeitem"
                    tabIndex={-1}
                >
                    Settings
                </li>
                <li
                    role="treeitem"
                    tabIndex={-1}
                >
                    Profile
                </li>
            </ul>
        </Subject>
    );

    test("ArrowDown and ArrowUp move focus between tree items and wrap at the ends", () => {
        render(tree());
        const items = screen.getAllByRole("treeitem");
        items[0].focus();
        fireEvent.keyDown(items[0], { key: "ArrowDown" });
        expect(document.activeElement).toBe(items[1]);
        fireEvent.keyDown(items[1], { key: "ArrowUp" });
        expect(document.activeElement).toBe(items[0]);
        fireEvent.keyDown(items[0], { key: "ArrowUp" });
        expect(document.activeElement).toBe(items[2]);
        fireEvent.keyDown(items[2], { key: "ArrowDown" });
        expect(document.activeElement).toBe(items[0]);
    });

    test("Home and End jump to the first and last tree item", () => {
        render(tree());
        const items = screen.getAllByRole("treeitem");
        items[1].focus();
        fireEvent.keyDown(items[1], { key: "End" });
        expect(document.activeElement).toBe(items[2]);
        fireEvent.keyDown(items[2], { key: "Home" });
        expect(document.activeElement).toBe(items[0]);
    });
});
