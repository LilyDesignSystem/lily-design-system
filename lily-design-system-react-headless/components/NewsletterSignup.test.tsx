import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./NewsletterSignup";

describe("NewsletterSignup", () => {
    test("renders a form with the required aria-label", () => {
        render(
            <Subject
                label="Newsletter"
                emailLabel="Email"
                submitLabel="Subscribe"
            />,
        );

        const form: HTMLElement = screen.getByRole("form", { name: "Newsletter" });
        expect(form).toBeTruthy();
    });

    test("applies the newsletter-signup root class", () => {
        const { container } = render(
            <Subject
                label="Newsletter"
                emailLabel="Email"
                submitLabel="Subscribe"
            />,
        );

        const form = container.querySelector("form");
        expect(form!.className.includes("newsletter-signup")).toBe(true);
    });

    test("defaults state to idle and exposes data-state", () => {
        const { container } = render(
            <Subject
                label="Newsletter"
                emailLabel="Email"
                submitLabel="Subscribe"
            />,
        );

        const form = container.querySelector("form");
        expect(form!.getAttribute("data-state")).toBe("idle");
    });

    test("renders heading and description when provided", () => {
        render(
            <Subject
                label="Newsletter"
                heading="Stay in the loop"
                description="Monthly updates, no spam."
                emailLabel="Email"
                submitLabel="Subscribe"
            />,
        );

        expect(screen.getByRole("heading", { level: 3, name: "Stay in the loop" })).toBeTruthy();
        expect(screen.getByText("Monthly updates, no spam.")).toBeTruthy();
    });

    test("renders an email input with the visible emailLabel", () => {
        render(
            <Subject
                label="Newsletter"
                emailLabel="Email address"
                submitLabel="Subscribe"
            />,
        );

        const input: HTMLInputElement = screen.getByLabelText("Email address") as HTMLInputElement;
        expect(input).toBeTruthy();
        expect(input.type).toBe("email");
    });

    test("renders the submit button with submitLabel", () => {
        render(
            <Subject
                label="Newsletter"
                emailLabel="Email"
                submitLabel="Subscribe now"
            />,
        );

        const button: HTMLButtonElement = screen.getByRole("button", { name: "Subscribe now" }) as HTMLButtonElement;
        expect(button).toBeTruthy();
        expect(button.type).toBe("submit");
    });

    test("disables input and button while submitting", () => {
        render(
            <Subject
                label="Newsletter"
                emailLabel="Email"
                submitLabel="Subscribe"
                state="submitting"
            />,
        );

        const input: HTMLInputElement = screen.getByLabelText("Email") as HTMLInputElement;
        const button: HTMLButtonElement = screen.getByRole("button", { name: "Subscribe" }) as HTMLButtonElement;
        expect(input.disabled).toBe(true);
        expect(button.disabled).toBe(true);
    });

    test("shows success message with role=status when state is success", () => {
        render(
            <Subject
                label="Newsletter"
                emailLabel="Email"
                submitLabel="Subscribe"
                state="success"
                successMessage="Thanks!"
            />,
        );

        const status: HTMLElement = screen.getByRole("status");
        expect(status.textContent).toBe("Thanks!");
        expect(status.getAttribute("aria-live")).toBe("polite");
        expect(status.hasAttribute("hidden")).toBe(false);
    });

    test("hides success message when state is not success", () => {
        const { container } = render(
            <Subject
                label="Newsletter"
                emailLabel="Email"
                submitLabel="Subscribe"
                successMessage="Thanks!"
            />,
        );

        const status = container.querySelector("p.newsletter-signup-success");
        expect(status).toBeTruthy();
        expect(status!.hasAttribute("hidden")).toBe(true);
    });

    test("shows error message with role=alert when state is error", () => {
        render(
            <Subject
                label="Newsletter"
                emailLabel="Email"
                submitLabel="Subscribe"
                state="error"
                errorMessage="Oops"
            />,
        );

        const alert: HTMLElement = screen.getByRole("alert");
        expect(alert.textContent).toBe("Oops");
        expect(alert.hasAttribute("hidden")).toBe(false);
    });

    test("hides error message when state is not error", () => {
        const { container } = render(
            <Subject
                label="Newsletter"
                emailLabel="Email"
                submitLabel="Subscribe"
                errorMessage="Oops"
            />,
        );

        const error = container.querySelector("p.newsletter-signup-error");
        expect(error).toBeTruthy();
        expect(error!.hasAttribute("hidden")).toBe(true);
    });

    test("calls onSubmit when the form is submitted", async () => {
        const user: UserEvent = userEvent.setup();
        const handleSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
        render(
            <Subject
                label="Newsletter"
                emailLabel="Email"
                submitLabel="Subscribe"
                onSubmit={handleSubmit}
            />,
        );

        await user.click(screen.getByRole("button", { name: "Subscribe" }));
        expect(handleSubmit).toHaveBeenCalledOnce();
    });
});
