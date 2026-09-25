import { afterEach, describe, expect, test } from "vitest";

import { AotearoaNationalHealthIndexInput } from "./aotearoa-national-health-index-input.js";

if (!customElements.get("lily-aotearoa-national-health-index-input")) {
    customElements.define("lily-aotearoa-national-health-index-input", AotearoaNationalHealthIndexInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AotearoaNationalHealthIndexInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-aotearoa-national-health-index-input label="National Health Index (NHI) Number"></lily-aotearoa-national-health-index-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("aotearoa-national-health-index-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-aotearoa-national-health-index-input label="National Health Index (NHI) Number" autocomplete="on"></lily-aotearoa-national-health-index-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-aotearoa-national-health-index-input label="National Health Index (NHI) Number" value="ABC1234"></lily-aotearoa-national-health-index-input>') as unknown as AotearoaNationalHealthIndexInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("ABC1234");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-aotearoa-national-health-index-input label="National Health Index (NHI) Number" required disabled></lily-aotearoa-national-health-index-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-aotearoa-national-health-index-input label="National Health Index (NHI) Number"></lily-aotearoa-national-health-index-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("National Health Index (NHI) Number");
    });
});
