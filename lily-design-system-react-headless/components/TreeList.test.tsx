import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./TreeList";

describe("TreeList", () => {
    test("renders a tree", () => {
        render(
            <Subject label="Files">
                <li role="treeitem" tabIndex={-1}>Documents</li>
                <li role="treeitem" tabIndex={-1}>Photos</li>
            </Subject>
        );
        expect(screen.getByRole("tree")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(
            <Subject label="File browser">
                <li role="treeitem" tabIndex={-1}>Documents</li>
                <li role="treeitem" tabIndex={-1}>Photos</li>
            </Subject>
        );
        expect(screen.getByLabelText("File browser")).toBeTruthy();
    });

    test("renders treeitem children", () => {
        render(
            <Subject label="Files">
                <li role="treeitem" tabIndex={-1}>Documents</li>
                <li role="treeitem" tabIndex={-1}>Photos</li>
            </Subject>
        );
        expect(screen.getAllByRole("treeitem").length).toBe(2);
    });

    test("arrow down navigates to next item", () => {
        render(
            <Subject label="Files">
                <li role="treeitem" tabIndex={-1}>Documents</li>
                <li role="treeitem" tabIndex={-1}>Photos</li>
            </Subject>
        );
        const items = screen.getAllByRole("treeitem");
        items[0].focus();
        items[0].dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
        );
        expect(document.activeElement).toBe(items[1]);
    });

    test("passes through attributes", () => {
        render(
            <Subject label="F" data-testid="tv">
                <li role="treeitem" tabIndex={-1}>Documents</li>
                <li role="treeitem" tabIndex={-1}>Photos</li>
            </Subject>
        );
        expect(screen.getByTestId("tv")).toBeTruthy();
    });
});

describe("TreeList — skips items hidden in a collapsed branch", () => {
    test("ArrowDown from a collapsed parent goes to the next visible item, not its hidden child", async () => {
        const { container } = render(<Subject label="Files"><li role="treeitem" tabIndex={-1} id="a" aria-expanded="false">A<ol><li role="treeitem" tabIndex={-1} id="a1">A1</li></ol></li><li role="treeitem" tabIndex={-1} id="b">B</li></Subject>);
        const user = userEvent.setup();
        (container.querySelector("#a") as HTMLElement).focus();
        await user.keyboard("{ArrowDown}");
        expect(document.activeElement).toBe(container.querySelector("#b"));
    });
});
