import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./Menu";

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

describe("Menu", () => {
    test("renders a menu", () => {
        render(<Subject label="Actions">{menuItems}</Subject>);
        expect(screen.getByRole("menu")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Edit">{menuItems}</Subject>);
        expect(screen.getByLabelText("Edit")).toBeTruthy();
    });

    test("renders children", () => {
        render(<Subject label="Actions">{menuItems}</Subject>);
        expect(screen.getByText("Cut")).toBeTruthy();
        expect(screen.getByText("Copy")).toBeTruthy();
    });

    test("arrow down navigates to next item", async () => {
        const user = userEvent.setup();
        render(<Subject label="Actions">{menuItems}</Subject>);
        const items = screen.getAllByRole("menuitem");
        items[0].focus();
        await user.keyboard("{ArrowDown}");
        expect(document.activeElement).toBe(items[1]);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="A"
                data-testid="m"
            >
                {menuItems}
            </Subject>,
        );
        expect(screen.getByTestId("m")).toBeTruthy();
    });
});
