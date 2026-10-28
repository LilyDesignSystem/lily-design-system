import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./CheckboxInput";

describe("CheckboxInput", () => {
    test("renders as a checkbox", () => {
        render(<Subject label="Accept" />);
        expect(screen.getByRole("checkbox", { name: "Accept" })).toBeTruthy();
    });

    test("toggles on click", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="Toggle" />);
        const cb = screen.getByRole("checkbox") as HTMLInputElement;
        await user.click(cb);
        expect(cb.checked).toBe(true);
    });

    test("can be disabled", () => {
        render(
            <Subject
                label="Disabled"
                disabled
            />,
        );
        expect((screen.getByRole("checkbox") as HTMLInputElement).disabled).toBe(true);
    });

    test("applies name and value", () => {
        render(
            <Subject
                label="Opt"
                name="opt"
                value="1"
            />,
        );
        const cb = screen.getByRole("checkbox");
        expect(cb.getAttribute("name")).toBe("opt");
        expect(cb.getAttribute("value")).toBe("1");
    });

    test("is focusable via keyboard", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="Focus" />);
        await user.tab();
        expect(document.activeElement).toBe(screen.getByRole("checkbox"));
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                label="Test"
                data-testid="cb"
            />,
        );
        expect(screen.getByTestId("cb")).toBeTruthy();
    });
});
