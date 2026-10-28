import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./BackLink";

describe("BackLink", () => {
    test("renders as a link with href", () => {
        render(<Subject href="/previous">Back</Subject>);

        const link: HTMLElement = screen.getByRole("link", { name: "Back" });
        expect(link).toBeTruthy();
        expect(link.getAttribute("href")).toBe("/previous");
    });

    test("applies aria-label when label prop is provided", () => {
        render(
            <Subject
                href="/dashboard"
                label="Return to dashboard"
            >
                Back
            </Subject>,
        );

        const link: HTMLElement = screen.getByRole("link", { name: "Return to dashboard" });
        expect(link.getAttribute("aria-label")).toBe("Return to dashboard");
    });

    test("does not set aria-label when label prop is not provided", () => {
        render(<Subject href="/home">Go back</Subject>);

        const link: HTMLElement = screen.getByRole("link", { name: "Go back" });
        expect(link.getAttribute("aria-label")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                href="/home"
                data-testid="back-link"
            >
                Back
            </Subject>,
        );

        const link: HTMLElement = screen.getByTestId("back-link");
        expect(link).toBeTruthy();
    });

    test("is focusable via keyboard", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject href="/prev">Back</Subject>);

        const link: HTMLElement = screen.getByRole("link");
        await user.tab();
        expect(document.activeElement).toBe(link);
    });
});
