import { afterEach, describe, expect, test } from "vitest";

import { AvatarGroup } from "./avatar-group.js";

if (!customElements.get("lily-avatar-group")) {
    customElements.define("lily-avatar-group", AvatarGroup);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AvatarGroup", () => {
    test("renders itself with the base class and role=group", () => {
        const host = render('<lily-avatar-group label="Team members"></lily-avatar-group>');

        expect(host.classList.contains("avatar-group")).toBe(true);
        expect(host.getAttribute("role")).toBe("group");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-avatar-group label="Team members"></lily-avatar-group>');

        expect(host.getAttribute("aria-label")).toBe("Team members");
    });

    test("renders child avatar content in place", () => {
        const host = render(
            '<lily-avatar-group label="Team members"><span data-testid="avatar">AB</span></lily-avatar-group>',
        );

        expect(host.querySelector('[data-testid="avatar"]')!.textContent).toBe("AB");
    });

    test("appends the consumer's class attribute to the base class", () => {
        const host = render('<lily-avatar-group label="Team members" class="my-extra"></lily-avatar-group>');

        expect(host.className).toBe("avatar-group my-extra");
    });
});
