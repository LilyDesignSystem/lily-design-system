import { afterEach, describe, expect, test } from "vitest";

import { GhanaCardPersonalIdentificationNumberInput } from "./ghana-card-personal-identification-number-input.js";

if (!customElements.get("lily-ghana-card-personal-identification-number-input")) {
    customElements.define(
        "lily-ghana-card-personal-identification-number-input",
        GhanaCardPersonalIdentificationNumberInput,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("GhanaCardPersonalIdentificationNumberInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-ghana-card-personal-identification-number-input label="Ghana Card PIN"></lily-ghana-card-personal-identification-number-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("ghana-card-personal-identification-number-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-ghana-card-personal-identification-number-input label="Ghana Card PIN" autocomplete="on"></lily-ghana-card-personal-identification-number-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-ghana-card-personal-identification-number-input label="Ghana Card PIN" value="GHA-123456789-1"></lily-ghana-card-personal-identification-number-input>',
        ) as unknown as GhanaCardPersonalIdentificationNumberInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("GHA-123456789-1");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-ghana-card-personal-identification-number-input label="Ghana Card PIN" required disabled></lily-ghana-card-personal-identification-number-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-ghana-card-personal-identification-number-input label="Ghana Card PIN"></lily-ghana-card-personal-identification-number-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Ghana Card PIN");
    });
});
