import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./NewsletterSignup.vue";


describe("NewsletterSignup", () => {
    const baseProps = {
        label: "Subscribe to newsletter",
        emailLabel: "Email address",
        submitLabel: "Subscribe",
    };

    test("renders as a form element with aria-label", () => {
        const { container } = render(Subject, { props: baseProps });

        const form: HTMLElement | null = container.querySelector("form");
        expect(form).toBeTruthy();
        expect(form?.getAttribute("aria-label")).toBe("Subscribe to newsletter");
    });

    test("has newsletter-signup class on root", () => {
        const { container } = render(Subject, { props: baseProps });

        const form: HTMLElement = container.querySelector("form") as HTMLElement;
        expect(form.classList.contains("newsletter-signup")).toBe(true);
    });

    test("defaults state to idle", () => {
        const { container } = render(Subject, { props: baseProps });

        const form: HTMLElement = container.querySelector("form") as HTMLElement;
        expect(form.getAttribute("data-state")).toBe("idle");
    });

    test("applies state as data-state", () => {
        const { container } = render(Subject, {
            props: { ...baseProps, state: "submitting" },
        });

        const form: HTMLElement = container.querySelector("form") as HTMLElement;
        expect(form.getAttribute("data-state")).toBe("submitting");
    });

    test("renders heading when provided", () => {
        render(Subject, {
            props: { ...baseProps, heading: "Stay informed" },
        });

        const h3: HTMLElement = screen.getByRole("heading", { level: 3 });
        expect(h3.textContent).toBe("Stay informed");
    });

    test("renders email input with email type", () => {
        render(Subject, { props: baseProps });

        const input: HTMLInputElement = screen.getByLabelText("Email address") as HTMLInputElement;
        expect(input.type).toBe("email");
    });

    test("renders submit button with submitLabel", () => {
        render(Subject, { props: baseProps });

        const button: HTMLElement = screen.getByRole("button", { name: "Subscribe" });
        expect(button.getAttribute("type")).toBe("submit");
    });

    test("disables input and button when submitting", () => {
        render(Subject, {
            props: { ...baseProps, state: "submitting" },
        });

        const input: HTMLInputElement = screen.getByLabelText("Email address") as HTMLInputElement;
        const button: HTMLButtonElement = screen.getByRole("button") as HTMLButtonElement;
        expect(input.disabled).toBe(true);
        expect(button.disabled).toBe(true);
    });

    test("success message has role=status and aria-live=polite", () => {
        const { container } = render(Subject, {
            props: { ...baseProps, state: "success", successMessage: "Thanks!" },
        });

        const success: HTMLElement = container.querySelector(".newsletter-signup-success") as HTMLElement;
        expect(success.getAttribute("role")).toBe("status");
        expect(success.getAttribute("aria-live")).toBe("polite");
        expect(success.hasAttribute("hidden")).toBe(false);
        expect(success.textContent).toBe("Thanks!");
    });

    test("success message is hidden when not in success state", () => {
        const { container } = render(Subject, {
            props: { ...baseProps, state: "idle", successMessage: "Thanks!" },
        });

        const success: HTMLElement = container.querySelector(".newsletter-signup-success") as HTMLElement;
        expect(success.hasAttribute("hidden")).toBe(true);
    });

    test("error message has role=alert", () => {
        const { container } = render(Subject, {
            props: { ...baseProps, state: "error", errorMessage: "Try again" },
        });

        const error: HTMLElement = container.querySelector(".newsletter-signup-error") as HTMLElement;
        expect(error.getAttribute("role")).toBe("alert");
        expect(error.hasAttribute("hidden")).toBe(false);
        expect(error.textContent).toBe("Try again");
    });

    test("error message is hidden when not in error state", () => {
        const { container } = render(Subject, {
            props: { ...baseProps, state: "idle", errorMessage: "Try again" },
        });

        const error: HTMLElement = container.querySelector(".newsletter-signup-error") as HTMLElement;
        expect(error.hasAttribute("hidden")).toBe(true);
    });

    test("emits submit event on form submission", async () => {
        const user: UserEvent = userEvent.setup();
        const onSubmit = vi.fn((e: Event) => e.preventDefault());

        render(Subject, {
            props: { ...baseProps, onSubmit },
        });

        const button: HTMLElement = screen.getByRole("button", { name: "Subscribe" });
        await user.click(button);

        expect(onSubmit).toHaveBeenCalled();
    });
});
