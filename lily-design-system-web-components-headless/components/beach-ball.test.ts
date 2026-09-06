import { afterEach, describe, expect, test } from "vitest";

import { BeachBall } from "./beach-ball.js";

if (!customElements.get("lily-beach-ball")) {
    customElements.define("lily-beach-ball", BeachBall);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("BeachBall", () => {
    test("the custom element itself is the status region (self-is-the-wrapper)", () => {
        const host = render('<lily-beach-ball label="Loading results"></lily-beach-ball>');

        expect(host.className).toBe("beach-ball");
        expect(host.getAttribute("role")).toBe("status");
        expect(host.getAttribute("aria-live")).toBe("polite");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-beach-ball label="Loading results"></lily-beach-ball>');

        expect(host.getAttribute("aria-label")).toBe("Loading results");
    });

    test("defaults active to true, with aria-busy and a spinner span", () => {
        const host = render('<lily-beach-ball label="Loading results"></lily-beach-ball>');

        expect(host.getAttribute("aria-busy")).toBe("true");
        expect(host.getAttribute("data-active")).toBe("true");
        expect(host.querySelector("span[aria-hidden='true']")).toBeTruthy();
    });

    test("active=false omits the spinner span", () => {
        const host = render('<lily-beach-ball label="Loading results" active="false"></lily-beach-ball>');

        expect(host.getAttribute("aria-busy")).toBe("false");
        expect(host.getAttribute("data-active")).toBe("false");
        expect(host.querySelector("span[aria-hidden='true']")).toBeNull();
    });

    test("toggling active externally adds/removes the spinner span", () => {
        const host = render('<lily-beach-ball label="Loading results" active="false"></lily-beach-ball>');

        host.setAttribute("active", "true");

        expect(host.querySelector("span[aria-hidden='true']")).toBeTruthy();
    });
});
