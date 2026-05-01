import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import ContactFormPage from "../../app/contact-form/page";

describe("ContactForm", () => {
    test("renders the contact form heading", () => {
        render(<ContactFormPage />);
        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toBeTruthy();
        expect(heading.textContent).toContain("Contact Us");
    });

    test("renders form fields", () => {
        render(<ContactFormPage />);
        expect(screen.getByLabelText("Full name")).toBeTruthy();
        expect(screen.getByLabelText("Email address")).toBeTruthy();
        expect(screen.getByLabelText("Message")).toBeTruthy();
    });

    test("shows error summary on empty submit", () => {
        render(<ContactFormPage />);
        const form = screen.getByRole("form");
        fireEvent.submit(form);
        const alerts = screen.getAllByRole("alert");
        expect(alerts.length).toBeGreaterThan(0);
        const errorSummary = alerts[0];
        expect(errorSummary.textContent).toContain("Name is required");
        expect(errorSummary.textContent).toContain("Email is required");
        expect(errorSummary.textContent).toContain("Message is required");
    });

    test("shows success message on valid submit", async () => {
        const user = userEvent.setup();
        render(<ContactFormPage />);
        await user.type(screen.getByLabelText("Full name"), "Alice");
        await user.type(screen.getByLabelText("Email address"), "alice@example.com");
        await user.type(screen.getByLabelText("Message"), "Hello there");
        const form = screen.getByRole("form");
        fireEvent.submit(form);
        expect(screen.getByRole("status").textContent).toContain("Thank you, Alice");
    });
});
