import { afterEach, describe, expect, test } from "vitest";

import { EmailLink } from "./email-link.js";

if (!customElements.get("lily-email-link")) {
    customElements.define("lily-email-link", EmailLink);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("EmailLink", () => {
    test("renders a mailto anchor with the email as visible text", () => {
        const host = render('<lily-email-link email="alice@example.com"></lily-email-link>');

        const a = host.querySelector("a") as HTMLAnchorElement;
        expect(a.className).toBe("email-link");
        expect(a.getAttribute("href")).toBe("mailto:alice@example.com");
        expect(a.textContent).toBe("alice@example.com");
    });

    test("uses label as an aria-label override", () => {
        const host = render(
            '<lily-email-link email="support@example.com" label="Contact support team"></lily-email-link>',
        );

        expect(host.querySelector("a")!.getAttribute("aria-label")).toBe("Contact support team");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-email-link email="a@b.com" class="extra"></lily-email-link>');

        expect(host.querySelector("a")!.className).toBe("email-link extra");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-email-link email="a@b.com" data-testid="email-link"></lily-email-link>');

        expect(host.querySelector("a")!.getAttribute("data-testid")).toBe("email-link");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-email-link email="a@b.com"></lily-email-link>');

        (host as unknown as EmailLink).connectedCallback();

        expect(host.querySelectorAll("a.email-link").length).toBe(1);
    });
});
