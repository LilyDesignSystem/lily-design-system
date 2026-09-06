import { afterEach, describe, expect, test } from "vitest";

import { EnglandNationalHealthServiceNumberInput } from "./england-national-health-service-number-input.js";

if (!customElements.get("lily-england-national-health-service-number-input")) {
    customElements.define("lily-england-national-health-service-number-input", EnglandNationalHealthServiceNumberInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("EnglandNationalHealthServiceNumberInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-england-national-health-service-number-input label="ID"></lily-england-national-health-service-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("england-national-health-service-number-input");
    });

    test("autocomplete is always off, even if the consumer tries to override it", () => {
        const host = render('<lily-england-national-health-service-number-input label="ID" autocomplete="on"></lily-england-national-health-service-number-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-england-national-health-service-number-input label="ID" value="943 476 5919"></lily-england-national-health-service-number-input>') as unknown as EnglandNationalHealthServiceNumberInput;

        expect(host.value).toBe("943 476 5919");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-england-national-health-service-number-input label="ID" required disabled></lily-england-national-health-service-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-england-national-health-service-number-input label="National Health Service Number"></lily-england-national-health-service-number-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("National Health Service Number");
    });
});
