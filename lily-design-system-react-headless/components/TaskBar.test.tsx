import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./TaskBar";

const buttons = (
    <>
        <button>New</button>
        <button>Open</button>
        <button>Save</button>
    </>
);

describe("TaskBar", () => {
    test("renders a toolbar", () => {
        render(<Subject label="Tasks">{buttons}</Subject>);
        expect(screen.getByRole("toolbar")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Task actions">{buttons}</Subject>);
        expect(screen.getByRole("toolbar").getAttribute("aria-label")).toBe("Task actions");
    });

    test("renders children", () => {
        render(<Subject label="Tasks">{buttons}</Subject>);
        expect(screen.getByText("New")).toBeTruthy();
    });

    test("arrow right navigates to next item", async () => {
        const user = userEvent.setup();
        render(<Subject label="Tasks">{buttons}</Subject>);
        const btns = screen.getAllByRole("button");
        btns[0].focus();
        await user.keyboard("{ArrowRight}");
        expect(document.activeElement).toBe(btns[1]);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="T"
                data-testid="tb"
            >
                {buttons}
            </Subject>,
        );
        expect(screen.getByTestId("tb")).toBeTruthy();
    });
});
