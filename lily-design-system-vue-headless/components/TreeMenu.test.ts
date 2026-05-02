import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./TreeMenu.vue";

describe("TreeMenu", () => {
    test("renders a div element with class tree-menu", () => {
        const { container } = render(Subject, { props: { label: "Test" }, slots: { default: "content" } });
        const root = container.querySelector(".tree-menu");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders slot content", () => {
        const { container } = render(Subject, { props: { label: "Test" }, slots: { default: "hello" } });
        expect(container.textContent).toContain("hello");
    });

    test("applies role=tree", () => {
        const { container } = render(Subject, { props: { label: "Test" }, slots: { default: "x" } });
        const root = container.querySelector(".tree-menu");
        expect(root?.getAttribute("role")).toBe("tree");
    });

    test("applies aria-label from label prop", () => {
        const { container } = render(Subject, { props: { label: "Hello" }, slots: { default: "x" } });
        const root = container.querySelector(".tree-menu");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });
});
