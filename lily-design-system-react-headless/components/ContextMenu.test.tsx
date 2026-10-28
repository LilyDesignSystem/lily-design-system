import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./ContextMenu";

const menuItems = (
    <>
        <div
            role="menuitem"
            tabIndex={-1}
        >
            Cut
        </div>
        <div
            role="menuitem"
            tabIndex={-1}
        >
            Copy
        </div>
        <div
            role="menuitem"
            tabIndex={-1}
        >
            Paste
        </div>
    </>
);

describe("ContextMenu", () => {
    test("hidden when open is false", () => {
        render(
            <Subject
                label="Actions"
                open={false}
            >
                {menuItems}
            </Subject>,
        );
        expect(screen.queryByRole("menu")).toBeNull();
    });

    test("visible when open is true", () => {
        render(
            <Subject
                label="Actions"
                open
            >
                {menuItems}
            </Subject>,
        );
        expect(screen.getByRole("menu", { name: "Actions" })).toBeTruthy();
    });

    test("renders children", () => {
        render(
            <Subject
                label="Actions"
                open
            >
                Custom Content
            </Subject>,
        );
        expect(screen.getByRole("menu").textContent).toContain("Custom Content");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="Actions"
                open
                data-testid="ctx"
            >
                {menuItems}
            </Subject>,
        );
        expect(screen.getByTestId("ctx")).toBeTruthy();
    });

    test("has correct aria-label", () => {
        render(
            <Subject
                label="File actions"
                open
            >
                {menuItems}
            </Subject>,
        );
        expect(screen.getByRole("menu").getAttribute("aria-label")).toBe("File actions");
    });

    test("ArrowDown navigates to next item", async () => {
        const user: UserEvent = userEvent.setup();
        render(
            <Subject
                label="Actions"
                open
            >
                {menuItems}
            </Subject>,
        );
        const items = screen.getAllByRole("menuitem");
        items[0].focus();
        await user.keyboard("{ArrowDown}");
        expect(document.activeElement).toBe(items[1]);
    });

    test("ArrowUp navigates to previous item", async () => {
        const user: UserEvent = userEvent.setup();
        render(
            <Subject
                label="Actions"
                open
            >
                {menuItems}
            </Subject>,
        );
        const items = screen.getAllByRole("menuitem");
        items[1].focus();
        await user.keyboard("{ArrowUp}");
        expect(document.activeElement).toBe(items[0]);
    });

    test("ArrowDown wraps from last to first", async () => {
        const user: UserEvent = userEvent.setup();
        render(
            <Subject
                label="Actions"
                open
            >
                {menuItems}
            </Subject>,
        );
        const items = screen.getAllByRole("menuitem");
        items[2].focus();
        await user.keyboard("{ArrowDown}");
        expect(document.activeElement).toBe(items[0]);
    });

    test("Home moves focus to first item", async () => {
        const user: UserEvent = userEvent.setup();
        render(
            <Subject
                label="Actions"
                open
            >
                {menuItems}
            </Subject>,
        );
        const items = screen.getAllByRole("menuitem");
        items[2].focus();
        await user.keyboard("{Home}");
        expect(document.activeElement).toBe(items[0]);
    });

    test("End moves focus to last item", async () => {
        const user: UserEvent = userEvent.setup();
        render(
            <Subject
                label="Actions"
                open
            >
                {menuItems}
            </Subject>,
        );
        const items = screen.getAllByRole("menuitem");
        items[0].focus();
        await user.keyboard("{End}");
        expect(document.activeElement).toBe(items[2]);
    });
});
