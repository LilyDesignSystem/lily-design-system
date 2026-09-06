import { afterEach, describe, expect, test } from "vitest";

import { TuaisceartEireannHealthAndCareNumberInput } from "./tuaisceart-eireann-health-and-care-number-input.js";

if (!customElements.get("lily-tuaisceart-eireann-health-and-care-number-input")) {
    customElements.define("lily-tuaisceart-eireann-health-and-care-number-input", TuaisceartEireannHealthAndCareNumberInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TuaisceartEireannHealthAndCareNumberInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-tuaisceart-eireann-health-and-care-number-input label="Health and Care (H&C) Number"></lily-tuaisceart-eireann-health-and-care-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("tuaisceart-eireann-health-and-care-number-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-tuaisceart-eireann-health-and-care-number-input label="Health and Care (H&C) Number" autocomplete="on"></lily-tuaisceart-eireann-health-and-care-number-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-tuaisceart-eireann-health-and-care-number-input label="Health and Care (H&C) Number" value="123 456 7890"></lily-tuaisceart-eireann-health-and-care-number-input>') as unknown as TuaisceartEireannHealthAndCareNumberInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("123 456 7890");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-tuaisceart-eireann-health-and-care-number-input label="Health and Care (H&C) Number" required disabled></lily-tuaisceart-eireann-health-and-care-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-tuaisceart-eireann-health-and-care-number-input label="Health and Care (H&C) Number"></lily-tuaisceart-eireann-health-and-care-number-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Health and Care (H&C) Number");
    });

    test("has the documented pattern and inputmode", () => {
        const host = render('<lily-tuaisceart-eireann-health-and-care-number-input label="Health and Care (H&C) Number"></lily-tuaisceart-eireann-health-and-care-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.getAttribute("pattern")).toBe("[0-9]{3} [0-9]{3} [0-9]{4}");
        expect(input.getAttribute("inputmode")).toBe("numeric");
    });
});
