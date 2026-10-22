import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TreeListItem from "./TreeListItem.svelte";

describe("TreeListItem", () => {
    test("renders with content", () => {
        render(TreeListItem, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("tree-list-item");
    });

    test("is a focusable li role=treeitem (tabindex=-1) so TreeList's arrow keys can focus it", () => {
        const { container } = render(TreeListItem, { props: { label: "Test", children: () => {} } });
        const el = container.querySelector(".tree-list-item") as HTMLElement;
        expect(el.tagName).toBe("LI");
        expect(el.getAttribute("role")).toBe("treeitem");
        expect(el.getAttribute("tabindex")).toBe("-1");
    });

    test("a consumer tabindex overrides the default (roving tabindex: the active item is 0)", () => {
        const { container } = render(TreeListItem, { props: { label: "Test", tabindex: "0", children: () => {} } });
        expect(container.querySelector(".tree-list-item")?.getAttribute("tabindex")).toBe("0");
    });
});
