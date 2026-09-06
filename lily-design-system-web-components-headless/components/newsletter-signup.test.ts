import { afterEach, describe, expect, test } from "vitest";

import { NewsletterSignup } from "./newsletter-signup.js";

if (!customElements.get("lily-newsletter-signup")) {
    customElements.define("lily-newsletter-signup", NewsletterSignup);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const BASE_ATTRS =
    'label="Newsletter signup" email-label="Email" submit-label="Subscribe" success-message="Thanks!" error-message="Something went wrong."';

describe("NewsletterSignup", () => {
    test("renders a native form with the base class", () => {
        const host = render(`<lily-newsletter-signup ${BASE_ATTRS}></lily-newsletter-signup>`);

        expect(host.querySelector("form")!.className).toBe("newsletter-signup");
    });

    test("uses label as the form's accessible name", () => {
        const host = render(`<lily-newsletter-signup ${BASE_ATTRS}></lily-newsletter-signup>`);

        expect(host.querySelector("form")!.getAttribute("aria-label")).toBe("Newsletter signup");
    });

    test("defaults data-state to idle", () => {
        const host = render(`<lily-newsletter-signup ${BASE_ATTRS}></lily-newsletter-signup>`);

        expect(host.querySelector("form")!.getAttribute("data-state")).toBe("idle");
    });

    test("renders the email input and submit button with consumer-supplied text", () => {
        const host = render(`<lily-newsletter-signup ${BASE_ATTRS}></lily-newsletter-signup>`);

        expect(host.querySelector(".newsletter-signup-email")).toBeTruthy();
        expect(host.querySelector(".newsletter-signup-submit")!.textContent).toBe("Subscribe");
    });

    test("success message uses role=status and aria-live=polite, hidden by default", () => {
        const host = render(`<lily-newsletter-signup ${BASE_ATTRS}></lily-newsletter-signup>`);

        const success = host.querySelector(".newsletter-signup-success") as HTMLElement;
        expect(success.getAttribute("role")).toBe("status");
        expect(success.getAttribute("aria-live")).toBe("polite");
        expect(success.hidden).toBe(true);
    });

    test("error message uses role=alert, hidden by default", () => {
        const host = render(`<lily-newsletter-signup ${BASE_ATTRS}></lily-newsletter-signup>`);

        const error = host.querySelector(".newsletter-signup-error") as HTMLElement;
        expect(error.getAttribute("role")).toBe("alert");
        expect(error.hidden).toBe(true);
    });

    test("state=submitting disables the email input and submit button", () => {
        const host = render(`<lily-newsletter-signup ${BASE_ATTRS} state="submitting"></lily-newsletter-signup>`);

        expect((host.querySelector(".newsletter-signup-email") as HTMLInputElement).disabled).toBe(true);
        expect((host.querySelector(".newsletter-signup-submit") as HTMLButtonElement).disabled).toBe(true);
    });

    test("state=success reveals the success message and re-enables the form", () => {
        const host = render(`<lily-newsletter-signup ${BASE_ATTRS} state="success"></lily-newsletter-signup>`);

        expect((host.querySelector(".newsletter-signup-success") as HTMLElement).hidden).toBe(false);
        expect((host.querySelector(".newsletter-signup-error") as HTMLElement).hidden).toBe(true);
        expect((host.querySelector(".newsletter-signup-email") as HTMLInputElement).disabled).toBe(false);
    });

    test("state=error reveals the error message", () => {
        const host = render(`<lily-newsletter-signup ${BASE_ATTRS} state="error"></lily-newsletter-signup>`);

        expect((host.querySelector(".newsletter-signup-error") as HTMLElement).hidden).toBe(false);
        expect((host.querySelector(".newsletter-signup-success") as HTMLElement).hidden).toBe(true);
    });

    test("reacts to a later change of the state attribute", () => {
        const host = render(`<lily-newsletter-signup ${BASE_ATTRS}></lily-newsletter-signup>`);

        host.setAttribute("state", "success");

        expect(host.querySelector("form")!.getAttribute("data-state")).toBe("success");
        expect((host.querySelector(".newsletter-signup-success") as HTMLElement).hidden).toBe(false);
    });

    test("renders the optional heading and description", () => {
        const host = render(
            `<lily-newsletter-signup ${BASE_ATTRS} heading="Stay in the loop" description="Monthly updates, no spam."></lily-newsletter-signup>`,
        );

        expect(host.querySelector(".newsletter-signup-heading")!.textContent).toBe("Stay in the loop");
        expect(host.querySelector(".newsletter-signup-description")!.textContent).toBe("Monthly updates, no spam.");
    });
});
