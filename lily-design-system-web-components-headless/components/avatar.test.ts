import { afterEach, describe, expect, test } from "vitest";

import { Avatar } from "./avatar.js";

if (!customElements.get("lily-avatar")) {
    customElements.define("lily-avatar", Avatar);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Avatar", () => {
    test("renders a native span with role=img", () => {
        const host = render('<lily-avatar alt="Jane Doe">JD</lily-avatar>');

        const span = host.querySelector("span.avatar") as HTMLSpanElement;
        expect(span.getAttribute("role")).toBe("img");
    });

    test("uses alt as the accessible name", () => {
        const host = render('<lily-avatar alt="Jane Doe">JD</lily-avatar>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Jane Doe");
    });

    test("moves original content into the span", () => {
        const host = render('<lily-avatar alt="Jane Doe">JD</lily-avatar>');

        expect(host.querySelector("span")!.textContent).toBe("JD");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-avatar alt="Jane Doe" class="large">JD</lily-avatar>');

        expect(host.querySelector("span")!.className).toBe("avatar large");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-avatar alt="Jane Doe">JD</lily-avatar>');

        (host as unknown as Avatar).connectedCallback();

        expect(host.querySelectorAll("span.avatar").length).toBe(1);
    });
});
