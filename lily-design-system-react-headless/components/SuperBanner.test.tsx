import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./SuperBanner";

describe("SuperBanner", () => {
    test("renders a div with class super-banner", () => {
        const { container } = render(<Subject>Outage</Subject>);
        const root = container.querySelector(".super-banner");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies role=alert and aria-live=assertive", () => {
        render(<Subject>Outage</Subject>);
        const alert = screen.getByRole("alert");
        expect(alert.getAttribute("aria-live")).toBe("assertive");
    });

    test("renders children content", () => {
        const { container } = render(<Subject>Service is down</Subject>);
        expect(container.textContent).toContain("Service is down");
    });

    test("does not render dismiss button by default", () => {
        render(<Subject>Outage</Subject>);
        expect(screen.queryByRole("button")).toBeNull();
    });

    test("renders dismiss button when dismissable", () => {
        render(<Subject dismissable>Outage</Subject>);
        const btn = screen.getByRole("button", { name: "Dismiss" });
        expect(btn).toBeTruthy();
    });

    test("uses custom dismissLabel for the dismiss button", () => {
        render(<Subject dismissable dismissLabel="Close banner">Outage</Subject>);
        const btn = screen.getByRole("button", { name: "Close banner" });
        expect(btn).toBeTruthy();
    });

    test("calls onDismiss when the dismiss button is clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const onDismiss = vi.fn();
        render(<Subject dismissable onDismiss={onDismiss}>Outage</Subject>);
        await user.click(screen.getByRole("button"));
        expect(onDismiss).toHaveBeenCalledOnce();
    });
});
