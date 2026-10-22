import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./TreeListItem.vue";

describe("TreeListItem", () => {
    test("renders a li element with class tree-list-item", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        const root = container.querySelector(".tree-list-item");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("LI");
    });

    test("renders slot content", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "hello" } });
        expect(container.textContent).toContain("hello");
    });

    test("applies role=treeitem", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "x" } });
        const root = container.querySelector(".tree-list-item");
        expect(root?.getAttribute("role")).toBe("treeitem");
    });

    test("does not set aria-label when label is omitted", () => {
        const { container } = render(Subject, { slots: { default: "x" } });
        const root = container.querySelector(".tree-list-item");
        expect(root?.getAttribute("aria-label")).toBeNull();
    });

    test("applies aria-label when label prop is provided", () => {
        const { container } = render(Subject, { props: { label: "Hello" }, slots: { default: "x" } });
        const root = container.querySelector(".tree-list-item");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });

    test("is a focusable li role=treeitem (tabindex=-1) so TreeList's arrow keys can focus it", () => {
        const { container } = render(Subject, { slots: { default: "x" } });
        const root = container.querySelector(".tree-list-item");
        expect(root?.tagName).toBe("LI");
        expect(root?.getAttribute("role")).toBe("treeitem");
        expect(root?.getAttribute("tabindex")).toBe("-1");
    });

    test("a consumer tabindex overrides the default (roving tabindex: the active item is 0)", () => {
        const { container } = render(Subject, { attrs: { tabindex: "0" }, slots: { default: "x" } });
        expect(container.querySelector(".tree-list-item")?.getAttribute("tabindex")).toBe("0");
    });
});
