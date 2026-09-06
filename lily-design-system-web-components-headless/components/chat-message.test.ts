import { afterEach, describe, expect, test } from "vitest";

import { ChatMessage } from "./chat-message.js";

if (!customElements.get("lily-chat-message")) {
    customElements.define("lily-chat-message", ChatMessage);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ChatMessage", () => {
    test("renders a native article", () => {
        const host = render("<lily-chat-message></lily-chat-message>");

        expect(host.querySelector("article.chat-message")).toBeTruthy();
    });

    test("uses label as the accessible description when provided", () => {
        const host = render('<lily-chat-message label="Message from Alex"></lily-chat-message>');

        expect(host.querySelector("article")!.getAttribute("aria-label")).toBe("Message from Alex");
    });

    test("aria-label is omitted when label is absent", () => {
        const host = render("<lily-chat-message></lily-chat-message>");

        expect(host.querySelector("article")!.hasAttribute("aria-label")).toBe(false);
    });

    test("moves its children into the article", () => {
        const host = render('<lily-chat-message><time datetime="2026-09-04"></time></lily-chat-message>');

        expect(host.querySelector("article > time")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-chat-message class="extra"></lily-chat-message>');

        expect(host.querySelector("article")!.className).toBe("chat-message extra");
    });
});
