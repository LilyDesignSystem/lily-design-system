import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./CallToAction";

describe("CallToAction", () => {
    test("renders as a link when href is provided", () => {
        render(<Subject href="/signup">Sign Up</Subject>);

        const link: HTMLElement = screen.getByRole("link", { name: "Sign Up" });
        expect(link).toBeTruthy();
        expect(link.getAttribute("href")).toBe("/signup");
    });

    test("renders as a button when no href", () => {
        render(<Subject>Get Started</Subject>);

        const button: HTMLElement = screen.getByRole("button", { name: "Get Started" });
        expect(button).toBeTruthy();
    });

    test("button handles click events", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(<Subject onClick={handleClick}>Act Now</Subject>);

        await user.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledOnce();
    });

    test("button can be disabled", () => {
        render(<Subject disabled>Disabled</Subject>);

        const button = screen.getByRole("button") as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    test("applies aria-label", () => {
        render(
            <Subject
                href="/learn"
                label="Learn more about our services"
            >
                Learn More
            </Subject>,
        );

        const link: HTMLElement = screen.getByRole("link", {
            name: "Learn more about our services",
        });
        expect(link).toBeTruthy();
    });

    test("is focusable via keyboard", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject>CTA</Subject>);

        await user.tab();
        expect(document.activeElement).toBe(screen.getByRole("button"));
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject data-testid="cta">Action</Subject>);

        expect(screen.getByTestId("cta")).toBeTruthy();
    });
});
