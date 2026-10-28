import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./Banner";

describe("Banner", () => {
    test("renders with region role", () => {
        render(<Subject>Announcement</Subject>);

        const banner: HTMLElement = screen.getByRole("region");
        expect(banner).toBeTruthy();
        expect(banner.textContent).toContain("Announcement");
    });

    test("defaults to type info", () => {
        render(<Subject>Info message</Subject>);

        const banner: HTMLElement = screen.getByRole("region");
        expect(banner.getAttribute("data-type")).toBe("info");
    });

    test("applies custom type", () => {
        render(<Subject type="warning">Warning</Subject>);

        const banner: HTMLElement = screen.getByRole("region");
        expect(banner.getAttribute("data-type")).toBe("warning");
    });

    test("has aria-live polite for dynamic content", () => {
        render(<Subject>Dynamic</Subject>);

        const banner: HTMLElement = screen.getByRole("region");
        expect(banner.getAttribute("aria-live")).toBe("polite");
    });

    test("shows dismiss button when dismissible", () => {
        render(
            <Subject
                dismissible
                closeLabel="Dismiss banner"
            >
                Dismissible
            </Subject>,
        );

        const button: HTMLElement = screen.getByRole("button", { name: "Dismiss banner" });
        expect(button).toBeTruthy();
    });

    test("hides dismiss button when not dismissible", () => {
        render(<Subject>Not dismissible</Subject>);

        const button: HTMLElement | null = screen.queryByRole("button");
        expect(button).toBeNull();
    });

    test("dismisses banner on button click", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClose = vi.fn();
        render(
            <Subject
                dismissible
                closeLabel="Close"
                onClose={handleClose}
            >
                Dismiss me
            </Subject>,
        );

        const button: HTMLElement = screen.getByRole("button", { name: "Close" });
        await user.click(button);

        expect(handleClose).toHaveBeenCalledOnce();
        expect(screen.queryByRole("region")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject data-testid="my-banner">Content</Subject>);

        const banner: HTMLElement = screen.getByTestId("my-banner");
        expect(banner).toBeTruthy();
    });
});
