import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { defineComponent, h, ref } from "vue";

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

function makeTree(initial: boolean | undefined) {
    return defineComponent({
        setup() {
            const open = ref(initial);
            return () =>
                h("ol", { role: "tree" }, [
                    h(
                        Subject,
                        { id: "parent", expanded: open.value, "onUpdate:expanded": (v: boolean) => (open.value = v) },
                        () => ["parent", h("ol", { role: "group" }, [h(Subject, { id: "child" }, () => "child")])],
                    ),
                    h(Subject, { id: "leaf" }, () => "leaf"),
                ]);
        },
    });
}

describe("TreeListItem — expand, collapse and move between levels", () => {
    function setup(initial: boolean | undefined) {
        const { container } = render(makeTree(initial));
        const q = (id: string) => container.querySelector("#" + id) as HTMLElement;
        return { user: userEvent.setup(), parent: q("parent"), child: q("child"), leaf: q("leaf") };
    }

    test("aria-expanded follows the state; a leaf has none", () => {
        const { parent, leaf } = setup(false);
        expect(parent.getAttribute("aria-expanded")).toBe("false");
        expect(leaf.hasAttribute("aria-expanded")).toBe(false);
    });

    test("ArrowRight expands a collapsed item", async () => {
        const { user, parent } = setup(false);
        parent.focus();
        await user.keyboard("{ArrowRight}");
        expect(parent.getAttribute("aria-expanded")).toBe("true");
    });

    test("ArrowRight on an expanded item focuses its first child", async () => {
        const { user, parent, child } = setup(true);
        parent.focus();
        await user.keyboard("{ArrowRight}");
        expect(document.activeElement).toBe(child);
    });

    test("ArrowLeft collapses an expanded item", async () => {
        const { user, parent } = setup(true);
        parent.focus();
        await user.keyboard("{ArrowLeft}");
        expect(parent.getAttribute("aria-expanded")).toBe("false");
    });

    test("ArrowLeft in a child moves focus to the parent without collapsing it", async () => {
        const { user, parent, child } = setup(true);
        child.focus();
        await user.keyboard("{ArrowLeft}");
        expect(document.activeElement).toBe(parent);
        expect(parent.getAttribute("aria-expanded")).toBe("true");
    });

    test("a leaf ignores ArrowRight and, at top level, ArrowLeft", async () => {
        const { user, leaf } = setup(false);
        leaf.focus();
        await user.keyboard("{ArrowRight}{ArrowLeft}");
        expect(document.activeElement).toBe(leaf);
    });

    test("in a right-to-left item the keys swap", async () => {
        const { user, parent } = setup(false);
        parent.style.direction = "rtl";
        parent.focus();
        await user.keyboard("{ArrowRight}");
        expect(parent.getAttribute("aria-expanded")).toBe("false");
        await user.keyboard("{ArrowLeft}");
        expect(parent.getAttribute("aria-expanded")).toBe("true");
    });
});
