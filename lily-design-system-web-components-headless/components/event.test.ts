import { afterEach, describe, expect, test } from "vitest";

import { Event as EventComponent } from "./event.js";

if (!customElements.get("lily-event")) {
    customElements.define("lily-event", EventComponent);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Event", () => {
    test("renders a native article", () => {
        const host = render("<lily-event></lily-event>");

        expect(host.querySelector("article.event")).toBeTruthy();
    });

    test("uses label as the accessible name when provided", () => {
        const host = render('<lily-event label="Team meetup"></lily-event>');

        expect(host.querySelector("article")!.getAttribute("aria-label")).toBe("Team meetup");
    });

    test("aria-label is omitted when label is absent", () => {
        const host = render("<lily-event></lily-event>");

        expect(host.querySelector("article")!.hasAttribute("aria-label")).toBe(false);
    });

    test("moves its children into the article", () => {
        const host = render('<lily-event><time id="when"></time></lily-event>');

        expect(host.querySelector("article > #when")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-event class="extra"></lily-event>');

        expect(host.querySelector("article")!.className).toBe("event extra");
    });
});
