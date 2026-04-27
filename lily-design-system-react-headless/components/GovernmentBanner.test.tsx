import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./GovernmentBanner";

describe("GovernmentBanner", () => {
    test("renders as a complementary landmark with aria-label", () => {
        render(
            <Subject
                label="Official government website"
                headerText="An official website"
                expandLabel="Here's how you know"
            />
        );

        const aside: HTMLElement = screen.getByRole("complementary", {
            name: "Official government website",
        });
        expect(aside).toBeTruthy();
    });

    test("applies the government-banner root class", () => {
        render(
            <Subject
                label="Banner"
                headerText="Header"
                expandLabel="Toggle"
            />
        );

        const aside: HTMLElement = screen.getByRole("complementary");
        expect(aside.className.includes("government-banner")).toBe(true);
    });

    test("renders the header text", () => {
        render(
            <Subject
                label="Banner"
                headerText="An official website"
                expandLabel="Toggle"
            />
        );

        const aside: HTMLElement = screen.getByRole("complementary");
        expect(aside.textContent).toContain("An official website");
    });

    test("renders a toggle button with aria-expanded false by default", () => {
        render(
            <Subject
                label="Banner"
                headerText="Header"
                expandLabel="Here's how you know"
            />
        );

        const button: HTMLElement = screen.getByRole("button", {
            name: "Here's how you know",
        });
        expect(button.getAttribute("aria-expanded")).toBe("false");
    });

    test("aria-expanded reflects the expanded prop", () => {
        render(
            <Subject
                label="Banner"
                headerText="Header"
                expandLabel="Toggle"
                expanded
            />
        );

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("aria-expanded")).toBe("true");
    });

    test("toggle button aria-controls matches panel id", () => {
        const { container } = render(
            <Subject
                label="Banner"
                headerText="Header"
                expandLabel="Toggle"
                expanded
            >
                <p>Details</p>
            </Subject>
        );

        const button: HTMLElement = screen.getByRole("button");
        const panelId: string | null = button.getAttribute("aria-controls");
        expect(panelId).toBeTruthy();

        const panel: HTMLElement | null = container.querySelector(
            `[id="${panelId!}"]`
        );
        expect(panel).toBeTruthy();
    });

    test("panel is hidden when collapsed", () => {
        const { container } = render(
            <Subject
                label="Banner"
                headerText="Header"
                expandLabel="Toggle"
            >
                <p>Details</p>
            </Subject>
        );

        const panel: HTMLElement = container.querySelector(
            ".government-banner-details"
        )!;
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("panel is visible when expanded", () => {
        const { container } = render(
            <Subject
                label="Banner"
                headerText="Header"
                expandLabel="Toggle"
                expanded
            >
                <p>Details</p>
            </Subject>
        );

        const panel: HTMLElement = container.querySelector(
            ".government-banner-details"
        )!;
        expect(panel.hasAttribute("hidden")).toBe(false);
    });

    test("calls onToggle when the toggle button is clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handleToggle = vi.fn();
        render(
            <Subject
                label="Banner"
                headerText="Header"
                expandLabel="Toggle"
                onToggle={handleToggle}
            />
        );

        await user.click(screen.getByRole("button"));
        expect(handleToggle).toHaveBeenCalledOnce();
    });
});
