import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
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

function Tree({ initial }: { initial: boolean | undefined }) {
    const [open, setOpen] = useState(initial);
    return (
        <ol role="tree">
            <Subject id="parent" expanded={open} onExpandedChange={setOpen}>
                parent
                <ol role="group">
                    <Subject id="child">child</Subject>
                </ol>
            </Subject>
            <Subject id="leaf">leaf</Subject>
        </ol>
    );
}

describe("TreeListItem — expand, collapse and move between levels", () => {
    function setup(initial: boolean | undefined) {
        const utils = render(<Tree initial={initial} />);
        const q = (id: string) => utils.container.querySelector("#" + id) as HTMLElement;
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

    test("a consumer onKeyDown still runs", async () => {
        const seen: string[] = [];
        const { container } = render(<Subject id="x" onKeyDown={(e: React.KeyboardEvent) => seen.push(e.key)}>x</Subject>);
        const user = userEvent.setup();
        (container.querySelector("#x") as HTMLElement).focus();
        await user.keyboard("{ArrowLeft}");
        expect(seen).toEqual(["ArrowLeft"]);
    });
});
