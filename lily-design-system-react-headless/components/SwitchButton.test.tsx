import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./SwitchButton";

describe("SwitchButton", () => {
    test("renders with switch role", () => {
        render(<Subject label="Toggle" />);
        expect(screen.getByRole("switch")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Enable notifications" />);
        expect(screen.getByLabelText("Enable notifications")).toBeTruthy();
    });

    test("has aria-checked false by default", () => {
        render(<Subject label="Toggle" />);
        expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe("false");
    });

    test("toggles on click", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="Toggle" />);
        const sw = screen.getByRole("switch");
        await user.click(sw);
        expect(sw.getAttribute("aria-checked")).toBe("true");
    });

    test("toggles on space key", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="Toggle" />);
        const sw = screen.getByRole("switch");
        sw.focus();
        await user.keyboard(" ");
        expect(sw.getAttribute("aria-checked")).toBe("true");
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="Toggle"
                disabled
            />,
        );
        expect((screen.getByRole("switch") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="T"
                data-testid="sw"
            />,
        );
        expect(screen.getByTestId("sw")).toBeTruthy();
    });
});
