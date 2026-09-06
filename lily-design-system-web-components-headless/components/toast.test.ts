import { afterEach, describe, expect, test } from "vitest";

import { Toast } from "./toast.js";

if (!customElements.get("lily-toast")) {
    customElements.define("lily-toast", Toast);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Toast", () => {
    test("carries the base class, role=status, and aria-live=polite by default", () => {
        const host = render("<lily-toast>Your changes have been saved.</lily-toast>");

        expect(host.classList.contains("toast")).toBe(true);
        expect(host.getAttribute("role")).toBe("status");
        expect(host.getAttribute("aria-live")).toBe("polite");
    });

    test("urgent switches to role=alert and aria-live=assertive", () => {
        const host = render("<lily-toast urgent>Something went wrong.</lily-toast>");

        expect(host.getAttribute("role")).toBe("alert");
        expect(host.getAttribute("aria-live")).toBe("assertive");
    });

    test("applies an explicit label as aria-label", () => {
        const host = render('<lily-toast label="Success">Saved.</lily-toast>');

        expect(host.getAttribute("aria-label")).toBe("Success");
    });

    test("omits aria-label when no label is given", () => {
        const host = render("<lily-toast>Saved.</lily-toast>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("preserves the consumer's children", () => {
        const host = render("<lily-toast><p>3 new messages.</p></lily-toast>");

        expect(host.querySelector("p")?.textContent).toBe("3 new messages.");
    });
});
