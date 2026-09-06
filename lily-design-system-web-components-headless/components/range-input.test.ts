import { afterEach, describe, expect, test } from "vitest";

import { RangeInput } from "./range-input.js";

if (!customElements.get("lily-range-input")) {
    customElements.define("lily-range-input", RangeInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("RangeInput", () => {
    test("renders a native input type=range", () => {
        const host = render('<lily-range-input label="Volume"></lily-range-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("range");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-range-input label="Volume"></lily-range-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Volume");
    });

    test("defaults value to 50 and min/max/step to 0/100/1", () => {
        const host = render('<lily-range-input label="Volume"></lily-range-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.value).toBe("50");
        expect(input.min).toBe("0");
        expect(input.max).toBe("100");
        expect(input.step).toBe("1");
    });

    test("seeds min/max/step/value from attributes", () => {
        const host = render(
            '<lily-range-input label="Volume" value="5" min="1" max="10" step="1"></lily-range-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.value).toBe("5");
        expect(input.min).toBe("1");
        expect(input.max).toBe("10");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render('<lily-range-input label="Volume"></lily-range-input>') as unknown as RangeInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "75";

        expect(input.value).toBe("75");
        expect(host.value).toBe("75");
    });

    test("disabled propagates to the inner input", () => {
        const host = render('<lily-range-input label="Volume" disabled></lily-range-input>');

        expect((host.querySelector("input") as HTMLInputElement).disabled).toBe(true);
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-range-input label="Volume" class="extra"></lily-range-input>');

        expect(host.querySelector("input")!.className).toBe("range-input extra");
    });
});
