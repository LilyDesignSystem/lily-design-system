import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./DropdownMenu";

const menuItems = (
    <>
        <div
            role="menuitem"
            tabIndex={-1}
        >
            Edit
        </div>
        <div
            role="menuitem"
            tabIndex={-1}
        >
            Duplicate
        </div>
        <div
            role="menuitem"
            tabIndex={-1}
        >
            Delete
        </div>
    </>
);

describe("DropdownMenu", () => {
    test("renders a toggle button", () => {
        render(<Subject label="Options">{menuItems}</Subject>);
        expect(screen.getByRole("button", { name: "Options" })).toBeTruthy();
    });

    test("button has aria-haspopup", () => {
        render(<Subject label="Options">{menuItems}</Subject>);
        expect(screen.getByRole("button").getAttribute("aria-haspopup")).toBe("true");
    });

    test("button shows aria-expanded false when closed", () => {
        render(<Subject label="Options">{menuItems}</Subject>);
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
    });

    test("menu hidden when closed", () => {
        render(<Subject label="Options">{menuItems}</Subject>);
        expect(screen.queryByRole("menu")).toBeNull();
    });

    test("clicking button opens menu", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="Options">{menuItems}</Subject>);
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("menu")).toBeTruthy();
    });

    test("button shows aria-expanded true when open", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="Options">{menuItems}</Subject>);
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
    });

    test("ArrowDown navigates items", async () => {
        const user: UserEvent = userEvent.setup();
        render(
            <Subject
                label="Options"
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

    test("ArrowUp navigates items", async () => {
        const user: UserEvent = userEvent.setup();
        render(
            <Subject
                label="Options"
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

    test("Escape closes menu", async () => {
        const user: UserEvent = userEvent.setup();
        render(
            <Subject
                label="Options"
                open
            >
                {menuItems}
            </Subject>,
        );
        screen.getByRole("menu").focus();
        await user.keyboard("{Escape}");
        expect(screen.queryByRole("menu")).toBeNull();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="Options"
                data-testid="dd"
            >
                {menuItems}
            </Subject>,
        );
        expect(screen.getByTestId("dd")).toBeTruthy();
    });
});
