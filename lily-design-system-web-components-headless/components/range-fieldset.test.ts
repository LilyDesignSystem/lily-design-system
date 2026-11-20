import { afterEach, describe, expect, test } from "vitest";

import { RangeFieldset } from "./range-fieldset.js";

if (!customElements.get("lily-range-fieldset")) {
    customElements.define("lily-range-fieldset", RangeFieldset);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const ATTRS = 'legend="Price" minimum-label="Lowest price" maximum-label="Highest price"';

function render(extra = ""): {
    host: RangeFieldset;
    lower: HTMLInputElement;
    upper: HTMLInputElement;
} {
    document.body.innerHTML = `<form><lily-range-fieldset ${ATTRS} ${extra}></lily-range-fieldset></form>`;
    const host = document.querySelector("lily-range-fieldset") as RangeFieldset;
    return {
        host,
        lower: host.querySelector(".range-fieldset-minimum") as HTMLInputElement,
        upper: host.querySelector(".range-fieldset-maximum") as HTMLInputElement,
    };
}

function move(input: HTMLInputElement, value: string) {
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("RangeFieldset", () => {
    test("is a fieldset with a legend and two range inputs on one scale", () => {
        const { host, lower, upper } = render('min="10" max="90" step="5" class="extra"');
        const root = host.querySelector("fieldset") as HTMLFieldSetElement;
        expect(root.className).toBe("range-fieldset extra");
        expect(root.querySelector("legend.range-fieldset-legend")?.textContent).toBe("Price");
        expect(lower.getAttribute("aria-label")).toBe("Lowest price");
        expect(upper.getAttribute("aria-label")).toBe("Highest price");
        for (const input of [lower, upper]) {
            expect(input.type).toBe("range");
            expect(input.min).toBe("10");
            expect(input.max).toBe("90");
            expect(input.step).toBe("5");
        }
        expect(host.minimum).toBe(10);
        expect(host.maximum).toBe(90);
    });

    test("the lower thumb stops at the upper one, and the upper at the lower", () => {
        const { host, lower, upper } = render('minimum="20" maximum="60"');
        move(lower, "80");
        expect(lower.value).toBe("60");
        move(lower, "30");
        move(upper, "5");
        expect(upper.value).toBe("30");
        expect(host.minimum).toBe(30);
    });

    test("both values submit, and a form reset puts both back", () => {
        const { lower, upper } = render(
            'minimum="25" maximum="75" minimum-name="price-min" maximum-name="price-max"',
        );
        const form = document.querySelector("form") as HTMLFormElement;
        const data = new FormData(form);
        expect(data.get("price-min")).toBe("25");
        expect(data.get("price-max")).toBe("75");
        move(lower, "40");
        move(upper, "50");
        form.reset();
        expect(lower.value).toBe("25");
        expect(upper.value).toBe("75");
    });

    test("after a form reset the thumbs stay back, and the next move clamps against them", async () => {
        const { lower, upper } = render('minimum="20" maximum="80"');
        const form = document.querySelector("form") as HTMLFormElement;
        move(lower, "50");
        form.reset();
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(lower.value).toBe("20");
        move(upper, "30");
        expect(upper.value).toBe("30");
    });

    test("the minimum and maximum properties move the thumbs, never past each other", () => {
        const { host, lower, upper } = render('minimum="20" maximum="60"');
        host.minimum = 70;
        expect(lower.value).toBe("60");
        host.maximum = 90;
        expect(upper.value).toBe("90");
    });

    test("disabled disables the fieldset, and other attributes pass through", () => {
        const { host } = render('disabled data-test="v"');
        const root = host.querySelector("fieldset") as HTMLFieldSetElement;
        expect(root.disabled).toBe(true);
        expect(root.getAttribute("data-test")).toBe("v");
    });
});
