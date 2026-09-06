import { afterEach, describe, expect, test } from "vitest";

import { AvatarText } from "./avatar-text.js";

if (!customElements.get("lily-avatar-text")) {
    customElements.define("lily-avatar-text", AvatarText);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AvatarText", () => {
    test("renders a native span with aria-hidden", () => {
        const host = render("<lily-avatar-text>JD</lily-avatar-text>");

        const span = host.querySelector("span.avatar-text") as HTMLSpanElement;
        expect(span.getAttribute("aria-hidden")).toBe("true");
    });

    test("moves original content into the span", () => {
        const host = render("<lily-avatar-text>JD</lily-avatar-text>");

        expect(host.querySelector("span")!.textContent).toBe("JD");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-avatar-text class="initials">JD</lily-avatar-text>');

        expect(host.querySelector("span")!.className).toBe("avatar-text initials");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-avatar-text>JD</lily-avatar-text>");

        (host as unknown as AvatarText).connectedCallback();

        expect(host.querySelectorAll("span.avatar-text").length).toBe(1);
    });
});
