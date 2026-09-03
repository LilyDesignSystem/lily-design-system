import { afterEach, describe, expect, test } from "vitest";

import { ActionLink } from "./action-link.js";

if (!customElements.get("lily-action-link")) {
    customElements.define("lily-action-link", ActionLink);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ActionLink", () => {
    test("renders a native anchor with the given href", () => {
        const host = render('<lily-action-link href="/settings">Settings</lily-action-link>');

        const a = host.querySelector("a") as HTMLAnchorElement;
        expect(a.getAttribute("href")).toBe("/settings");
        expect(a.textContent).toBe("Settings");
    });

    test("uses label as an aria-label override", () => {
        const host = render('<lily-action-link href="/settings" label="Open settings">Settings</lily-action-link>');

        expect(host.querySelector("a")!.getAttribute("aria-label")).toBe("Open settings");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-action-link href="/x" data-testid="settings-link">Go</lily-action-link>');

        expect(host.querySelector("a")!.getAttribute("data-testid")).toBe("settings-link");
    });
});
