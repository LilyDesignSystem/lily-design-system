import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./ToggleButton";

describe("ToggleButton", () => {
    test("renders with switch role", () => {
        render(<Subject label="Dark mode" />);
        expect(screen.getByRole("switch")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Dark mode" />);
        expect(screen.getByLabelText("Dark mode")).toBeTruthy();
    });

    test("has aria-checked false by default", () => {
        render(<Subject label="ToggleButton" />);
        expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe("false");
    });

    test("toggles on click", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="ToggleButton" />);
        const btn = screen.getByRole("switch");
        await user.click(btn);
        expect(btn.getAttribute("aria-checked")).toBe("true");
    });

    test("toggles on space key", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="ToggleButton" />);
        const btn = screen.getByRole("switch");
        btn.focus();
        await user.keyboard(" ");
        expect(btn.getAttribute("aria-checked")).toBe("true");
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="ToggleButton"
                disabled
            />,
        );
        expect((screen.getByRole("switch") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="T"
                data-testid="tg"
            />,
        );
        expect(screen.getByTestId("tg")).toBeTruthy();
    });
});
