import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./FiveStarRatingPickerButton";

describe("FiveStarRatingPickerButton", () => {
    test("renders as a button", () => {
        render(
            <Subject
                value={3}
                label="3 stars"
            />,
        );
        expect(screen.getByRole("button", { name: "3 stars" })).toBeTruthy();
    });

    test("shows aria-pressed when selected", () => {
        render(
            <Subject
                value={4}
                label="4 stars"
                selected
            />,
        );
        expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("true");
    });

    test("shows aria-pressed false when not selected", () => {
        render(
            <Subject
                value={2}
                label="2 stars"
            />,
        );
        expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("false");
    });

    test("exposes data-value", () => {
        render(
            <Subject
                value={5}
                label="5 stars"
            />,
        );
        expect(screen.getByRole("button").getAttribute("data-value")).toBe("5");
    });

    test("displays label text", () => {
        render(
            <Subject
                value={1}
                label="1 star"
            />,
        );
        expect(screen.getByRole("button").textContent).toContain("1 star");
    });

    test("handles click", async () => {
        const user: UserEvent = userEvent.setup();
        const fn = vi.fn();
        render(
            <Subject
                value={3}
                label="3 stars"
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
                label="1 star"
                disabled
            />,
        );
        expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                value={3}
                label="3 stars"
                data-testid="star-btn"
            />,
        );
        expect(screen.getByTestId("star-btn")).toBeTruthy();
    });
});
