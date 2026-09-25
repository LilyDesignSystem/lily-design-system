import { afterEach, describe, expect, test } from "vitest";

import { MisrAlRaqmAlQawmiInput } from "./misr-al-raqm-al-qawmi-input.js";

if (!customElements.get("lily-misr-al-raqm-al-qawmi-input")) {
    customElements.define("lily-misr-al-raqm-al-qawmi-input", MisrAlRaqmAlQawmiInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MisrAlRaqmAlQawmiInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-misr-al-raqm-al-qawmi-input label="الرقم القومي (National Number)"></lily-misr-al-raqm-al-qawmi-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("misr-al-raqm-al-qawmi-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-misr-al-raqm-al-qawmi-input label="الرقم القومي (National Number)" autocomplete="on"></lily-misr-al-raqm-al-qawmi-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-misr-al-raqm-al-qawmi-input label="الرقم القومي (National Number)" value="29001011234567"></lily-misr-al-raqm-al-qawmi-input>') as unknown as MisrAlRaqmAlQawmiInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("29001011234567");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-misr-al-raqm-al-qawmi-input label="الرقم القومي (National Number)" required disabled></lily-misr-al-raqm-al-qawmi-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-misr-al-raqm-al-qawmi-input label="الرقم القومي (National Number)"></lily-misr-al-raqm-al-qawmi-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("الرقم القومي (National Number)");
    });
});
