import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./Banner.vue";

describe("Banner", () => {
    test("renders with region role", () => {
        render(Subject, { slots: { default: "Announcement" } });

        const banner: HTMLElement = screen.getByRole("region");
        expect(banner).toBeTruthy();
        expect(banner.textContent).toContain("Announcement");
    });

    test("defaults to type info", () => {
        render(Subject, { slots: { default: "Info message" } });

        const banner: HTMLElement = screen.getByRole("region");
        expect(banner.getAttribute("data-type")).toBe("info");
    });

    test("applies custom type", () => {
        render(Subject, { props: { type: "warning" }, slots: { default: "Warning" } });

        const banner: HTMLElement = screen.getByRole("region");
        expect(banner.getAttribute("data-type")).toBe("warning");
    });

    test("has aria-live polite for dynamic content", () => {
        render(Subject, { slots: { default: "Dynamic" } });

        const banner: HTMLElement = screen.getByRole("region");
        expect(banner.getAttribute("aria-live")).toBe("polite");
    });

    test("shows dismiss button when dismissible", () => {
        render(Subject, {
            props: { dismissible: true, closeLabel: "Dismiss banner" },
            slots: { default: "Dismissible" },
        });

        const button: HTMLElement = screen.getByRole("button", { name: "Dismiss banner" });
        expect(button).toBeTruthy();
    });

    test("hides dismiss button when not dismissible", () => {
        render(Subject, { slots: { default: "Not dismissible" } });

        const button: HTMLElement | null = screen.queryByRole("button");
        expect(button).toBeNull();
    });

    test("dismisses banner on button click", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClose = vi.fn();
        render(Subject, {
            props: { dismissible: true, closeLabel: "Close", onclose: handleClose },
            slots: { default: "Dismiss me" },
        });

        const button: HTMLElement = screen.getByRole("button", { name: "Close" });
        await user.click(button);

        expect(handleClose).toHaveBeenCalledOnce();
        expect(screen.queryByRole("region")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { "data-testid": "my-banner" }, slots: { default: "Content" } });

        const banner: HTMLElement = screen.getByTestId("my-banner");
        expect(banner).toBeTruthy();
    });
});
