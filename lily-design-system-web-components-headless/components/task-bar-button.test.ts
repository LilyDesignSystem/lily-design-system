import { afterEach, describe, expect, test } from "vitest";

import { TaskBarButton } from "./task-bar-button.js";

if (!customElements.get("lily-task-bar-button")) {
    customElements.define("lily-task-bar-button", TaskBarButton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TaskBarButton", () => {
    test("renders a native button element", () => {
        const host = render("<lily-task-bar-button>New</lily-task-bar-button>");

        const button = host.querySelector("button.task-bar-button") as HTMLButtonElement;
        expect(button).toBeTruthy();
        expect(button.type).toBe("button");
    });

    test("is not disabled by default", () => {
        const host = render("<lily-task-bar-button>New</lily-task-bar-button>");

        expect((host.querySelector("button") as HTMLButtonElement).disabled).toBe(false);
    });

    test("reflects the disabled attribute", () => {
        const host = render("<lily-task-bar-button disabled>Delete</lily-task-bar-button>");

        expect((host.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("moves its children into the button", () => {
        const host = render("<lily-task-bar-button>Save</lily-task-bar-button>");

        expect(host.querySelector("button")!.textContent).toBe("Save");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-task-bar-button class="extra">New</lily-task-bar-button>');

        expect(host.querySelector("button")!.className).toBe("task-bar-button extra");
    });

    test("passes through rest attributes to the button", () => {
        const host = render('<lily-task-bar-button data-testid="tbb">New</lily-task-bar-button>');

        expect(host.querySelector("button")!.getAttribute("data-testid")).toBe("tbb");
    });
});
