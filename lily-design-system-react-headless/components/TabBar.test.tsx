import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./TabBar";

const tabs = (
    <>
        <button
            role="tab"
            tabIndex={0}
        >
            General
        </button>
        <button
            role="tab"
            tabIndex={-1}
        >
            Advanced
        </button>
    </>
);

describe("TabBar", () => {
    test("renders a tablist", () => {
        render(<Subject label="Settings">{tabs}</Subject>);
        expect(screen.getByRole("tablist")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Settings">{tabs}</Subject>);
        expect(screen.getByRole("tablist").getAttribute("aria-label")).toBe("Settings");
    });

    test("renders children", () => {
        render(<Subject label="Settings">{tabs}</Subject>);
        expect(screen.getByText("General")).toBeTruthy();
        expect(screen.getByText("Advanced")).toBeTruthy();
    });

    test("arrow right navigates to next tab", async () => {
        const user = userEvent.setup();
        render(<Subject label="Settings">{tabs}</Subject>);
        const tabEls = screen.getAllByRole("tab");
        tabEls[0].focus();
        await user.keyboard("{ArrowRight}");
        expect(document.activeElement).toBe(tabEls[1]);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="S"
                data-testid="tbar"
            >
                {tabs}
            </Subject>,
        );
        expect(screen.getByTestId("tbar")).toBeTruthy();
    });
});
