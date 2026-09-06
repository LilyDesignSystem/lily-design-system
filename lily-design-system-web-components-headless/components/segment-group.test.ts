import { afterEach, describe, expect, test } from "vitest";

import { SegmentGroup } from "./segment-group.js";

if (!customElements.get("lily-segment-group")) {
    customElements.define("lily-segment-group", SegmentGroup);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SegmentGroup", () => {
    test("the host itself carries the base class and role=radiogroup", () => {
        const host = render('<lily-segment-group label="View"></lily-segment-group>');

        expect(host.className).toBe("segment-group");
        expect(host.getAttribute("role")).toBe("radiogroup");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-segment-group label="View"></lily-segment-group>');

        expect(host.getAttribute("aria-label")).toBe("View");
    });

    test("leaves children in place, unmoved", () => {
        const host = render(
            '<lily-segment-group label="View"><button role="radio" aria-checked="true">Day</button></lily-segment-group>',
        );

        expect(host.querySelector(":scope > button")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-segment-group label="View" class="extra"></lily-segment-group>');

        expect(host.className).toBe("segment-group extra");
    });

    test("passes through rest attributes such as data-testid", () => {
        const host = render('<lily-segment-group label="View" data-testid="view"></lily-segment-group>');

        expect(host.getAttribute("data-testid")).toBe("view");
    });
});
