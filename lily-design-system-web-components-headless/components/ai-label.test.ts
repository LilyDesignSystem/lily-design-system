import { afterEach, describe, expect, test } from "vitest";

import { AiLabel } from "./ai-label.js";

if (!customElements.get("lily-ai-label")) {
    customElements.define("lily-ai-label", AiLabel);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AiLabel", () => {
    test("renders a native span", () => {
        const host = render("<lily-ai-label></lily-ai-label>");

        expect(host.querySelector("span.ai-label")).toBeTruthy();
    });

    test("defaults label and text to AI", () => {
        const host = render("<lily-ai-label></lily-ai-label>");

        const span = host.querySelector("span")!;
        expect(span.getAttribute("aria-label")).toBe("AI");
        expect(span.textContent).toBe("AI");
    });

    test("honours an explicit label and text", () => {
        const host = render('<lily-ai-label label="AI-generated summary" text="AI"></lily-ai-label>');

        const span = host.querySelector("span")!;
        expect(span.getAttribute("aria-label")).toBe("AI-generated summary");
        expect(span.textContent).toBe("AI");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-ai-label class="badge"></lily-ai-label>');

        expect(host.querySelector("span")!.className).toBe("ai-label badge");
    });

    test("updates when attributes change externally", () => {
        const host = render("<lily-ai-label></lily-ai-label>");

        host.setAttribute("text", "AI-assisted");

        expect(host.querySelector("span")!.textContent).toBe("AI-assisted");
    });
});
