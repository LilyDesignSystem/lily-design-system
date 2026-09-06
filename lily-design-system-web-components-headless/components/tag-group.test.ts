import { afterEach, describe, expect, test } from "vitest";

import { TagGroup } from "./tag-group.js";

if (!customElements.get("lily-tag-group")) {
    customElements.define("lily-tag-group", TagGroup);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TagGroup", () => {
    test("the host itself carries the base class and role=group", () => {
        const host = render('<lily-tag-group label="Skills"></lily-tag-group>');

        expect(host.className).toBe("tag-group");
        expect(host.getAttribute("role")).toBe("group");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-tag-group label="Skills"></lily-tag-group>');

        expect(host.getAttribute("aria-label")).toBe("Skills");
    });

    test("leaves children in place, unmoved", () => {
        const host = render('<lily-tag-group label="Skills"><span class="tag">CSS</span></lily-tag-group>');

        expect(host.querySelector(":scope > span.tag")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-tag-group label="Skills" class="extra"></lily-tag-group>');

        expect(host.className).toBe("tag-group extra");
    });

    test("passes through rest attributes such as data-testid", () => {
        const host = render('<lily-tag-group label="Skills" data-testid="tags"></lily-tag-group>');

        expect(host.getAttribute("data-testid")).toBe("tags");
    });
});
