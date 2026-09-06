import { afterEach, describe, expect, test } from "vitest";

import { TimelineList } from "./timeline-list.js";

if (!customElements.get("lily-timeline-list")) {
    customElements.define("lily-timeline-list", TimelineList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TimelineList", () => {
    test("renders a native ordered list", () => {
        const host = render('<lily-timeline-list label="Order history"></lily-timeline-list>');

        expect(host.querySelector("ol.timeline-list")).toBeTruthy();
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-timeline-list label="Order history"></lily-timeline-list>');

        expect(host.querySelector("ol")!.getAttribute("aria-label")).toBe("Order history");
    });

    test("moves its children into the ol", () => {
        const host = render(
            '<lily-timeline-list label="Order history"><li><time datetime="2024-01-15">Order placed</time></li></lily-timeline-list>',
        );

        expect(host.querySelector("ol > li")!.textContent).toBe("Order placed");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-timeline-list label="Order history" class="extra"></lily-timeline-list>');

        expect(host.querySelector("ol")!.className).toBe("timeline-list extra");
    });

    test("passes through rest attributes to the ol", () => {
        const host = render('<lily-timeline-list label="Order history" data-testid="timeline"></lily-timeline-list>');

        expect(host.querySelector("ol")!.getAttribute("data-testid")).toBe("timeline");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-timeline-list label="Order history"></lily-timeline-list>');

        (host as unknown as TimelineList).connectedCallback();

        expect(host.querySelectorAll("ol").length).toBe(1);
    });
});
