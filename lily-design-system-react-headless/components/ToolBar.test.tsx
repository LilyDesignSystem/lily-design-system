import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./ToolBar";

const buttons = (
    <>
        <button>Bold</button>
        <button>Italic</button>
        <button>Underline</button>
    </>
);

describe("ToolBar", () => {
    test("renders a toolbar", () => {
        render(<Subject label="Tools">{buttons}</Subject>);
        expect(screen.getByRole("toolbar")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Editor tools">{buttons}</Subject>);
        expect(screen.getByLabelText("Editor tools")).toBeTruthy();
    });

    test("renders children", () => {
        render(<Subject label="Tools">{buttons}</Subject>);
        expect(screen.getByText("Bold")).toBeTruthy();
    });

    test("arrow right navigates to next item", async () => {
        const user = userEvent.setup();
        render(<Subject label="Tools">{buttons}</Subject>);
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
