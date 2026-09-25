import { afterEach, describe, expect, test } from "vitest";

import { BharatAadhaarInput } from "./bharat-aadhaar-input.js";

if (!customElements.get("lily-bharat-aadhaar-input")) {
    customElements.define("lily-bharat-aadhaar-input", BharatAadhaarInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("BharatAadhaarInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-bharat-aadhaar-input label="Aadhaar (आधार)"></lily-bharat-aadhaar-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("bharat-aadhaar-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-bharat-aadhaar-input label="Aadhaar (आधार)" autocomplete="on"></lily-bharat-aadhaar-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-bharat-aadhaar-input label="Aadhaar (आधार)" value="234567890123"></lily-bharat-aadhaar-input>') as unknown as BharatAadhaarInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("234567890123");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-bharat-aadhaar-input label="Aadhaar (आधार)" required disabled></lily-bharat-aadhaar-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-bharat-aadhaar-input label="Aadhaar (आधार)"></lily-bharat-aadhaar-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Aadhaar (आधार)");
    });
});
