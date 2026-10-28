import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./RedOrangeYellowGreenBluePickerButton";

describe("RedOrangeYellowGreenBluePickerButton", () => {
    test("renders as a button", () => {
        render(
            <Subject
                value="red"
                label="Red"
            />,
        );
        expect(screen.getByRole("button", { name: "Red" })).toBeTruthy();
    });

    test("shows aria-pressed when selected", () => {
        render(
            <Subject
                value="green"
                label="Green"
                selected
            />,
        );
        expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("true");
    });

    test("shows aria-pressed false when not selected", () => {
        render(
            <Subject
                value="orange"
                label="Orange"
            />,
        );
        expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("false");
    });

    test("exposes data-value", () => {
        render(
            <Subject
                value="yellow"
                label="Yellow"
            />,
        );
        expect(screen.getByRole("button").getAttribute("data-value")).toBe("yellow");
    });

    test("displays label text", () => {
        render(
            <Subject
                value="blue"
                label="Blue"
            />,
        );
        expect(screen.getByRole("button").textContent).toContain("Blue");
    });

    test("handles click", async () => {
        const user: UserEvent = userEvent.setup();
        const fn = vi.fn();
        render(
            <Subject
                value="red"
                label="Red"
                onClick={fn}
            />,
        );
        await user.click(screen.getByRole("button"));
        expect(fn).toHaveBeenCalledOnce();
    });

    test("can be disabled", () => {
        render(
            <Subject
                value="red"
                label="Red"
                disabled
            />,
        );
        expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                value="red"
                label="Red"
                data-testid="roygb-btn"
            />,
        );
        expect(screen.getByTestId("roygb-btn")).toBeTruthy();
    });
});
