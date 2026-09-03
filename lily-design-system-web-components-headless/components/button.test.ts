import { afterEach, beforeAll, describe, expect, test } from "vitest";

import { Button } from "./button.js";

if (!customElements.get("lily-button")) {
    customElements.define("lily-button", Button);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Button", () => {
    test("renders as a native button", () => {
        const host = render("<lily-button>Click me</lily-button>");

        const button = host.querySelector("button.button") as HTMLButtonElement;
        expect(button).toBeTruthy();
        expect(button.textContent).toBe("Click me");
    });

    test("defaults to type button", () => {
        const host = render("<lily-button>Click</lily-button>");

        const button = host.querySelector("button") as HTMLButtonElement;
        expect(button.type).toBe("button");
    });

    test("accepts submit type", () => {
        const host = render('<lily-button type="submit">Submit</lily-button>');

        const button = host.querySelector("button") as HTMLButtonElement;
        expect(button.type).toBe("submit");
    });

    test("can be disabled", () => {
        const host = render("<lily-button disabled>Disabled</lily-button>");

        const button = host.querySelector("button") as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    test("renders aria-pressed only when the pressed attribute is present", () => {
        const withPressed = render('<lily-button pressed="true">A</lily-button>');
        const withoutPressed = render("<lily-button>B</lily-button>");

        expect(withPressed.querySelector("button")!.getAttribute("aria-pressed")).toBe("true");
        expect(withoutPressed.querySelector("button")!.hasAttribute("aria-pressed")).toBe(false);
    });

    test("renders aria-pressed=false when pressed=false", () => {
        const host = render('<lily-button pressed="false">A</lily-button>');

        expect(host.querySelector("button")!.getAttribute("aria-pressed")).toBe("false");
    });

    test("uses the label attribute as aria-label", () => {
        const host = render('<lily-button label="Close dialog"><span aria-hidden="true">x</span></lily-button>');

        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Close dialog");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-button class="my-class">Click</lily-button>');

        expect(host.querySelector("button")!.className).toBe("button my-class");
    });

    test("passes through rest attributes to the inner button", () => {
        const host = render('<lily-button data-testid="save-button">Save</lily-button>');

        expect(host.querySelector("button")!.getAttribute("data-testid")).toBe("save-button");
    });

    test("handles click events dispatched on the inner button", () => {
        const host = render("<lily-button>Click</lily-button>");
        const button = host.querySelector("button") as HTMLButtonElement;
        let clicked = false;
        button.addEventListener("click", () => {
            clicked = true;
        });

        button.click();

        expect(clicked).toBe(true);
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-button>Click</lily-button>");
        const instance = host as unknown as Button;

        instance.connectedCallback();

        expect(host.querySelectorAll("button.button").length).toBe(1);
    });
});
