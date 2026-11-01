import { describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/vue";

import Subject from "./TreeMenu.vue";

describe("TreeMenu", () => {
    test("renders a div element with class tree-menu", () => {
        const { container } = render(Subject, {
            props: { label: "Test" },
            slots: { default: "content" },
        });
        const root = container.querySelector(".tree-menu");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders slot content", () => {
        const { container } = render(Subject, {
            props: { label: "Test" },
            slots: { default: "hello" },
        });
        expect(container.textContent).toContain("hello");
    });

    test("applies role=tree", () => {
        const { container } = render(Subject, {
            props: { label: "Test" },
            slots: { default: "x" },
        });
        const root = container.querySelector(".tree-menu");
        expect(root?.getAttribute("role")).toBe("tree");
    });

    test("applies aria-label from label prop", () => {
        const { container } = render(Subject, {
            props: { label: "Hello" },
            slots: { default: "x" },
        });
        const root = container.querySelector(".tree-menu");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });

    const tree = {
        props: { label: "Site" },
        slots: {
            default:
                '<ul><li role="treeitem" tabindex="-1">Home</li><li role="treeitem" tabindex="-1">Settings</li><li role="treeitem" tabindex="-1">Profile</li></ul>',
        },
    };

    test("ArrowDown and ArrowUp move focus between tree items and wrap at the ends", async () => {
        render(Subject, tree);
        const items = screen.getAllByRole("treeitem");
        items[0].focus();
        await fireEvent.keyDown(items[0], { key: "ArrowDown" });
        expect(document.activeElement).toBe(items[1]);
        await fireEvent.keyDown(items[1], { key: "ArrowUp" });
        expect(document.activeElement).toBe(items[0]);
        await fireEvent.keyDown(items[0], { key: "ArrowUp" });
        expect(document.activeElement).toBe(items[2]);
        await fireEvent.keyDown(items[2], { key: "ArrowDown" });
        expect(document.activeElement).toBe(items[0]);
    });

    test("Home and End jump to the first and last tree item", async () => {
        render(Subject, tree);
        const items = screen.getAllByRole("treeitem");
        items[1].focus();
        await fireEvent.keyDown(items[1], { key: "End" });
        expect(document.activeElement).toBe(items[2]);
        await fireEvent.keyDown(items[2], { key: "Home" });
        expect(document.activeElement).toBe(items[0]);
    });
});
