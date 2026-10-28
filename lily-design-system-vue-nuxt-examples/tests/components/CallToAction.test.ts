import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "../../components/CallToAction.vue";

describe("CallToAction", () => {
    test("renders as a link when href is provided", () => {
        render(Subject, { props: { href: "/signup" }, slots: { default: "Sign Up" } });

        const link: HTMLElement = screen.getByRole("link", { name: "Sign Up" });
        expect(link).toBeTruthy();
        expect(link.getAttribute("href")).toBe("/signup");
    });

    test("renders as a button when no href", () => {
        render(Subject, { slots: { default: "Get Started" } });

        const button: HTMLElement = screen.getByRole("button", { name: "Get Started" });
        expect(button).toBeTruthy();
    });

    test("button handles click events", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(Subject, { props: { onClick: handleClick }, slots: { default: "Act Now" } });

        await user.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledOnce();
    });

    test("button can be disabled", () => {
        render(Subject, { props: { disabled: true }, slots: { default: "Disabled" } });

        const button = screen.getByRole("button") as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    test("applies aria-label", () => {
        render(Subject, {
            props: { href: "/learn", label: "Learn more about our services" },
            slots: { default: "Learn More" },
        });

        const link: HTMLElement = screen.getByRole("link", {
            name: "Learn more about our services",
        });
        expect(link).toBeTruthy();
    });

    test("is focusable via keyboard", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { slots: { default: "CTA" } });

        await user.tab();
        expect(document.activeElement).toBe(screen.getByRole("button"));
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { "data-testid": "cta" }, slots: { default: "Action" } });

        expect(screen.getByTestId("cta")).toBeTruthy();
    });
});
