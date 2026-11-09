import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./ToggleButton";

describe("ToggleButton", () => {
    test("renders a native button with no switch role: the toggle button pattern", () => {
        render(<Subject label="Dark mode" />);
        expect(screen.getByRole("button").getAttribute("role")).toBeNull();
        expect(screen.queryByRole("switch")).toBeNull();
    });

    test("has aria-label", () => {
        render(<Subject label="Dark mode" />);
        expect(screen.getByLabelText("Dark mode")).toBeTruthy();
    });

    test("has aria-pressed false by default", () => {
        render(<Subject label="ToggleButton" />);
        expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("false");
    });

    test("toggles on click", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="ToggleButton" />);
        const btn = screen.getByRole("button");
        await user.click(btn);
        expect(btn.getAttribute("aria-pressed")).toBe("true");
    });

    test("toggles on space key", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="ToggleButton" />);
        const btn = screen.getByRole("button");
        btn.focus();
        await user.keyboard(" ");
        expect(btn.getAttribute("aria-pressed")).toBe("true");
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="ToggleButton"
                disabled
            />,
        );
        expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
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
