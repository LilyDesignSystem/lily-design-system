import { afterEach, describe, expect, test, vi } from "vitest";

import { ActionBarButton } from "./action-bar-button.js";

if (!customElements.get("lily-action-bar-button")) {
    customElements.define("lily-action-bar-button", ActionBarButton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ActionBarButton", () => {
    test("renders a native button", () => {
        const host = render('<lily-action-bar-button label="Delete"></lily-action-bar-button>');

        expect(host.querySelector("button.action-bar-button")).toBeTruthy();
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-action-bar-button label="Delete"></lily-action-bar-button>');

        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Delete");
    });

    test("defaults type to button", () => {
        const host = render('<lily-action-bar-button label="Delete"></lily-action-bar-button>');

        expect((host.querySelector("button") as HTMLButtonElement).type).toBe("button");
    });

    test("disabled attribute propagates to the native button", () => {
        const host = render('<lily-action-bar-button label="Delete" disabled></lily-action-bar-button>');

        expect((host.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("moves its children into the button", () => {
        const host = render('<lily-action-bar-button label="Delete"><span>Delete</span></lily-action-bar-button>');

        expect(host.querySelector("button > span")).toBeTruthy();
    });

    test("click fires a native click event on the button", () => {
        const host = render('<lily-action-bar-button label="Delete"></lily-action-bar-button>');
        const handler = vi.fn();
        const button = host.querySelector("button") as HTMLButtonElement;
        button.addEventListener("click", handler);

        button.click();

        expect(handler).toHaveBeenCalledOnce();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-action-bar-button label="Delete" class="extra"></lily-action-bar-button>');

        expect(host.querySelector("button")!.className).toBe("action-bar-button extra");
    });
});
