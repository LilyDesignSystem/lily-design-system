import { afterEach, describe, expect, test } from "vitest";

import { Notification } from "./notification.js";

if (!customElements.get("lily-notification")) {
    customElements.define("lily-notification", Notification);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Notification", () => {
    test("the custom element itself is the live region (self-is-the-wrapper)", () => {
        const host = render("<lily-notification>Your changes have been saved.</lily-notification>");

        expect(host.className).toBe("notification");
    });

    test("defaults to role=status and aria-live=polite", () => {
        const host = render("<lily-notification>Your changes have been saved.</lily-notification>");

        expect(host.getAttribute("role")).toBe("status");
        expect(host.getAttribute("aria-live")).toBe("polite");
    });

    test("urgent switches to role=alert and aria-live=assertive", () => {
        const host = render("<lily-notification urgent>Something went wrong.</lily-notification>");

        expect(host.getAttribute("role")).toBe("alert");
        expect(host.getAttribute("aria-live")).toBe("assertive");
    });

    test("label is optional and maps to aria-label when provided", () => {
        const host = render('<lily-notification label="Success">Saved.</lily-notification>');

        expect(host.getAttribute("aria-label")).toBe("Success");
    });

    test("omits aria-label when label is not provided", () => {
        const host = render("<lily-notification>3 new messages</lily-notification>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("keeps content in place", () => {
        const host = render("<lily-notification>3 new messages</lily-notification>");

        expect(host.textContent).toBe("3 new messages");
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-notification class="extra"></lily-notification>');

        expect(host.className).toBe("notification extra");
    });
});
