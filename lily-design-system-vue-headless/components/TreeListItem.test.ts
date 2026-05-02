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
});
