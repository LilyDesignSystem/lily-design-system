import { afterEach, describe, expect, test } from "vitest";

import { UrlInput } from "./url-input.js";

if (!customElements.get("lily-url-input")) {
    customElements.define("lily-url-input", UrlInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("UrlInput", () => {
    test("renders a native input type=url", () => {
        const host = render('<lily-url-input label="Website"></lily-url-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("url");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-url-input label="Website"></lily-url-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Website");
    });

    test("seeds the initial value from the value attribute", () => {
        const host = render('<lily-url-input label="Website" value="https://example.com"></lily-url-input>');

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("https://example.com");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render('<lily-url-input label="Website"></lily-url-input>') as unknown as UrlInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "https://lily.example";

        expect(input.value).toBe("https://lily.example");
        expect(host.value).toBe("https://lily.example");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-url-input label="Website" required disabled></lily-url-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("passes through rest attributes such as placeholder", () => {
        const host = render('<lily-url-input label="Website" placeholder="https://…"></lily-url-input>');

        expect(host.querySelector("input")!.getAttribute("placeholder")).toBe("https://…");
    });
});
