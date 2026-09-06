import { afterEach, describe, expect, test } from "vitest";

import { ChatList } from "./chat-list.js";

if (!customElements.get("lily-chat-list")) {
    customElements.define("lily-chat-list", ChatList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ChatList", () => {
    test("renders a native ordered list", () => {
        const host = render("<lily-chat-list></lily-chat-list>");

        expect(host.querySelector("ol.chat-list")).toBeTruthy();
    });

    test("aria-label is omitted when label is absent", () => {
        const host = render("<lily-chat-list></lily-chat-list>");

        expect(host.querySelector("ol")!.hasAttribute("aria-label")).toBe(false);
    });

    test("aria-label reflects a provided label", () => {
        const host = render('<lily-chat-list label="Conversation"></lily-chat-list>');

        expect(host.querySelector("ol")!.getAttribute("aria-label")).toBe("Conversation");
    });

    test("moves its children into the ol", () => {
        const host = render("<lily-chat-list><li>Hi</li></lily-chat-list>");

        expect(host.querySelector("ol > li")!.textContent).toBe("Hi");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-chat-list class="extra"></lily-chat-list>');

        expect(host.querySelector("ol")!.className).toBe("chat-list extra");
    });

    test("passes through rest attributes to the ol", () => {
        const host = render('<lily-chat-list data-testid="thread"></lily-chat-list>');

        expect(host.querySelector("ol")!.getAttribute("data-testid")).toBe("thread");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-chat-list></lily-chat-list>");

        (host as unknown as ChatList).connectedCallback();

        expect(host.querySelectorAll("ol").length).toBe(1);
    });
});
