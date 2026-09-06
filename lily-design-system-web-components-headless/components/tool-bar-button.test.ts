import { afterEach, describe, expect, test } from "vitest";

import { ToolBarButton } from "./tool-bar-button.js";

if (!customElements.get("lily-tool-bar-button")) {
    customElements.define("lily-tool-bar-button", ToolBarButton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ToolBarButton", () => {
    test("renders a native button element", () => {
        const host = render("<lily-tool-bar-button>Bold</lily-tool-bar-button>");

        const button = host.querySelector("button.tool-bar-button") as HTMLButtonElement;
        expect(button).toBeTruthy();
        expect(button.type).toBe("button");
    });

    test("is not disabled by default", () => {
        const host = render("<lily-tool-bar-button>Bold</lily-tool-bar-button>");

        expect((host.querySelector("button") as HTMLButtonElement).disabled).toBe(false);
    });

    test("reflects the disabled attribute", () => {
        const host = render("<lily-tool-bar-button disabled>Strikethrough</lily-tool-bar-button>");

        expect((host.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("moves its children into the button", () => {
        const host = render("<lily-tool-bar-button>Italic</lily-tool-bar-button>");

        expect(host.querySelector("button")!.textContent).toBe("Italic");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-tool-bar-button class="extra">Bold</lily-tool-bar-button>');

        expect(host.querySelector("button")!.className).toBe("tool-bar-button extra");
    });

    test("passes through rest attributes to the button", () => {
        const host = render('<lily-tool-bar-button aria-label="Pen tool">Pen</lily-tool-bar-button>');

        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Pen tool");
    });
});
