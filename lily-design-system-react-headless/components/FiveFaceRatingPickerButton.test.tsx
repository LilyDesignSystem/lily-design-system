import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./FiveFaceRatingPickerButton";

describe("FiveFaceRatingPickerButton", () => {
    test("renders as a button", () => {
        render(
            <Subject
                value={3}
                label="Okay"
            />,
        );
        expect(screen.getByRole("button", { name: "Okay" })).toBeTruthy();
    });

    test("shows aria-pressed when selected", () => {
        render(
            <Subject
                value={4}
                label="Good"
                selected
            />,
        );
        expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("true");
    });

    test("shows aria-pressed false when not selected", () => {
        render(
            <Subject
                value={2}
                label="Bad"
            />,
        );
        expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("false");
    });

    test("exposes data-value", () => {
        render(
            <Subject
                value={5}
                label="Very good"
            />,
        );
        expect(screen.getByRole("button").getAttribute("data-value")).toBe("5");
    });

    test("displays label text", () => {
        render(
            <Subject
                value={1}
                label="Very bad"
            />,
        );
        expect(screen.getByRole("button").textContent).toContain("Very bad");
    });

    test("handles click", async () => {
        const user: UserEvent = userEvent.setup();
        const fn = vi.fn();
        render(
            <Subject
                value={3}
                label="Okay"
                onClick={fn}
            />,
        );
        await user.click(screen.getByRole("button"));
        expect(fn).toHaveBeenCalledOnce();
    });

    test("can be disabled", () => {
        render(
            <Subject
                value={1}
                label="Very bad"
                disabled
            />,
        );
        expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                value={3}
                label="Okay"
                data-testid="face-btn"
            />,
        );
        expect(screen.getByTestId("face-btn")).toBeTruthy();
    });
});
