import { afterEach, describe, expect, test } from "vitest";

import { AvatarImage } from "./avatar-image.js";

if (!customElements.get("lily-avatar-image")) {
    customElements.define("lily-avatar-image", AvatarImage);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AvatarImage", () => {
    test("renders a native img with src and alt", () => {
        const host = render('<lily-avatar-image src="/avatar.png" alt="Ada Lovelace"></lily-avatar-image>');

        const img = host.querySelector("img") as HTMLImageElement;
        expect(img.getAttribute("src")).toBe("/avatar.png");
        expect(img.alt).toBe("Ada Lovelace");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-avatar-image src="/a.png" alt="A" class="large"></lily-avatar-image>');

        expect(host.querySelector("img")!.className).toBe("avatar-image large");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-avatar-image src="/a.png" alt="A"></lily-avatar-image>');

        (host as unknown as AvatarImage).connectedCallback();

        expect(host.querySelectorAll("img").length).toBe(1);
    });
});
