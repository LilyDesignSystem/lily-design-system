import { afterEach, describe, expect, test } from "vitest";

import { HiddenInput } from "./hidden-input.js";

if (!customElements.get("lily-hidden-input")) {
    customElements.define("lily-hidden-input", HiddenInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("HiddenInput", () => {
    test("renders a native input type=hidden with the base class", () => {
        const host = render('<lily-hidden-input name="csrf-token"></lily-hidden-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("hidden");
        expect(input.classList.contains("hidden-input")).toBe(true);
    });

    test("sets the name attribute", () => {
        const host = render('<lily-hidden-input name="csrf-token"></lily-hidden-input>');

        expect((host.querySelector("input") as HTMLInputElement).name).toBe("csrf-token");
    });

    test("defaults value to an empty string", () => {
        const host = render('<lily-hidden-input name="csrf-token"></lily-hidden-input>');

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("");
    });

    test("seeds the initial value from the value attribute", () => {
        const host = render('<lily-hidden-input name="csrf-token" value="abc123"></lily-hidden-input>');

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("abc123");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render('<lily-hidden-input name="csrf-token"></lily-hidden-input>') as unknown as HiddenInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "xyz789";

        expect(input.value).toBe("xyz789");
        expect(host.value).toBe("xyz789");
    });

    test("passes through rest attributes such as id", () => {
        const host = render('<lily-hidden-input name="csrf-token" id="csrf"></lily-hidden-input>');

        expect(host.querySelector("input")!.getAttribute("id")).toBe("csrf");
    });
});
