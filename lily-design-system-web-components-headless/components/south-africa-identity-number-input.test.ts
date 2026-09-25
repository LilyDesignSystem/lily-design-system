import { afterEach, describe, expect, test } from "vitest";

import { SouthAfricaIdentityNumberInput } from "./south-africa-identity-number-input.js";

if (!customElements.get("lily-south-africa-identity-number-input")) {
    customElements.define("lily-south-africa-identity-number-input", SouthAfricaIdentityNumberInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SouthAfricaIdentityNumberInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-south-africa-identity-number-input label="South African Identity Number"></lily-south-africa-identity-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("south-africa-identity-number-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-south-africa-identity-number-input label="South African Identity Number" autocomplete="on"></lily-south-africa-identity-number-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-south-africa-identity-number-input label="South African Identity Number" value="9001015008086"></lily-south-africa-identity-number-input>') as unknown as SouthAfricaIdentityNumberInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("9001015008086");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-south-africa-identity-number-input label="South African Identity Number" required disabled></lily-south-africa-identity-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-south-africa-identity-number-input label="South African Identity Number"></lily-south-africa-identity-number-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("South African Identity Number");
    });
});
