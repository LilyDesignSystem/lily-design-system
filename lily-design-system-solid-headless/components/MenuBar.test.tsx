import { render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./MenuBar";

const menuItems = () => (
    <>
        <div
            role="menuitem"
            tabindex={-1}
        >
            File
        </div>
        <div
            role="menuitem"
            tabindex={-1}
        >
            Edit
        </div>
        <div
            role="menuitem"
            tabindex={-1}
        >
            View
        </div>
    </>
);

describe("MenuBar", () => {
    test("renders a menubar", () => {
        render(() => <Subject label="Main">{menuItems()}</Subject>);
        expect(screen.getByRole("menubar")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(() => <Subject label="Main menu">{menuItems()}</Subject>);
        expect(screen.getByLabelText("Main menu")).toBeTruthy();
    });

    test("arrow right navigates to next item", async () => {
        const user = userEvent.setup();
        render(() => <Subject label="Main">{menuItems()}</Subject>);
        const items = screen.getAllByRole("menuitem");
        items[0].focus();
        await user.keyboard("{ArrowRight}");
        expect(document.activeElement).toBe(items[1]);
    });

    test("passes through attributes", () => {
        render(() => (
            <Subject
                label="M"
                data-testid="mb"
            >
                {menuItems()}
            </Subject>
        ));
        expect(screen.getByTestId("mb")).toBeTruthy();
    });
});
