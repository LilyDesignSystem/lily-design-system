import { afterEach, describe, expect, test } from "vitest";

import { ResetInput } from "./reset-input.js";

if (!customElements.get("lily-reset-input")) {
    customElements.define("lily-reset-input", ResetInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ResetInput", () => {
    test("renders a native input type=reset", () => {
        const host = render("<lily-reset-input></lily-reset-input>");

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("reset");
    });

    test("defaults the visible value to Reset", () => {
        const host = render("<lily-reset-input></lily-reset-input>");

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("Reset");
    });

    test("seeds the value from the value attribute", () => {
        const host = render('<lily-reset-input value="Start over"></lily-reset-input>');

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("Start over");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render("<lily-reset-input></lily-reset-input>") as unknown as ResetInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "Clear";

        expect(input.value).toBe("Clear");
        expect(host.value).toBe("Clear");
    });

    test("disabled propagates to the inner input", () => {
        const host = render("<lily-reset-input disabled></lily-reset-input>");

        expect((host.querySelector("input") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through rest attributes such as aria-label", () => {
        const host = render('<lily-reset-input aria-label="Custom reset"></lily-reset-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Custom reset");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-reset-input class="extra"></lily-reset-input>');

        expect(host.querySelector("input")!.className).toBe("reset-input extra");
    });
});
