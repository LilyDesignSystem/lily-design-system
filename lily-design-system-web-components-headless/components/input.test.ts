import { afterEach, describe, expect, test } from "vitest";

import { Input } from "./input.js";

if (!customElements.get("lily-input")) {
    customElements.define("lily-input", Input);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Input", () => {
    test("defaults to type=text", () => {
        const host = render('<lily-input label="Name"></lily-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("honours a configured type", () => {
        const host = render('<lily-input label="Age" type="number"></lily-input>');

        expect((host.querySelector("input") as HTMLInputElement).type).toBe("number");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-input label="Name"></lily-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Name");
    });

    test("seeds the initial value from the value attribute", () => {
        const host = render('<lily-input label="Name" value="Ada"></lily-input>');

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("Ada");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render('<lily-input label="Name"></lily-input>') as unknown as Input;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "Grace";

        expect(input.value).toBe("Grace");
        expect(host.value).toBe("Grace");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-input label="Name" required disabled></lily-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("passes through rest attributes such as placeholder", () => {
        const host = render('<lily-input label="Name" placeholder="e.g. Ada"></lily-input>');

        expect(host.querySelector("input")!.getAttribute("placeholder")).toBe("e.g. Ada");
    });
});
