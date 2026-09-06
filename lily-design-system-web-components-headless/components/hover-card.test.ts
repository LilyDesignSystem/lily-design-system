import { afterEach, describe, expect, test } from "vitest";

import { HoverCard } from "./hover-card.js";

if (!customElements.get("lily-hover-card")) {
    customElements.define("lily-hover-card", HoverCard);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("HoverCard", () => {
    test("renders as itself with the base class", () => {
        const host = render('<lily-hover-card label="User info"><p>Profile details</p></lily-hover-card>');

        expect(host.tagName.toLowerCase()).toBe("lily-hover-card");
        expect(host.className).toBe("hover-card");
    });

    test("is hidden and carries no role/aria-label by default (closed)", () => {
        const host = render('<lily-hover-card label="User info"></lily-hover-card>');

        expect(host.hidden).toBe(true);
        expect(host.hasAttribute("role")).toBe(false);
        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("shows role=tooltip and aria-label when open", () => {
        const host = render('<lily-hover-card open label="User info"></lily-hover-card>');

        expect(host.hidden).toBe(false);
        expect(host.getAttribute("role")).toBe("tooltip");
        expect(host.getAttribute("aria-label")).toBe("User info");
    });

    test("toggling the open attribute updates hidden and ARIA reactively", () => {
        const host = render('<lily-hover-card label="User info"></lily-hover-card>');

        host.setAttribute("open", "");
        expect(host.hidden).toBe(false);
        expect(host.getAttribute("role")).toBe("tooltip");

        host.removeAttribute("open");
        expect(host.hidden).toBe(true);
        expect(host.hasAttribute("role")).toBe(false);
    });

    test("preserves children content in place", () => {
        const host = render('<lily-hover-card open label="User info"><strong>Jane Doe</strong></lily-hover-card>');

        expect(host.querySelector("strong")!.textContent).toBe("Jane Doe");
    });

    test("appends the consumer's class hook to the base class", () => {
        const host = render('<lily-hover-card label="User info" class="profile-preview"></lily-hover-card>');

        expect(host.className).toBe("hover-card profile-preview");
    });
});
