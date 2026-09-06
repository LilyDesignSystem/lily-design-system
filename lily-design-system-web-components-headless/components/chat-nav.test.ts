import { afterEach, describe, expect, test } from "vitest";

import { ChatNav } from "./chat-nav.js";

if (!customElements.get("lily-chat-nav")) {
    customElements.define("lily-chat-nav", ChatNav);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ChatNav", () => {
    test("renders a native nav landmark", () => {
        const host = render('<lily-chat-nav label="Chat conversations"></lily-chat-nav>');

        expect(host.querySelector("nav.chat-nav")).toBeTruthy();
    });

    test("uses label as the landmark's accessible name", () => {
        const host = render('<lily-chat-nav label="Chat conversations"></lily-chat-nav>');

        expect(host.querySelector("nav")!.getAttribute("aria-label")).toBe("Chat conversations");
    });

    test("moves its children into the nav", () => {
        const host = render('<lily-chat-nav label="Chat conversations"><ol id="list"></ol></lily-chat-nav>');

        expect(host.querySelector("nav > #list")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-chat-nav label="Chat conversations" class="extra"></lily-chat-nav>');

        expect(host.querySelector("nav")!.className).toBe("chat-nav extra");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-chat-nav label="Chat conversations"></lily-chat-nav>');

        (host as unknown as ChatNav).connectedCallback();

        expect(host.querySelectorAll("nav").length).toBe(1);
    });
});
