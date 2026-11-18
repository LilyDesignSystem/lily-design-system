import { afterEach, describe, expect, test } from "vitest";

import { VietNamCanCuocCongDanInput } from "./viet-nam-can-cuoc-cong-dan-input.js";

if (!customElements.get("lily-viet-nam-can-cuoc-cong-dan-input")) {
    customElements.define("lily-viet-nam-can-cuoc-cong-dan-input", VietNamCanCuocCongDanInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("VietNamCanCuocCongDanInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-viet-nam-can-cuoc-cong-dan-input label="Citizen Identification Number (CCCD)"></lily-viet-nam-can-cuoc-cong-dan-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("viet-nam-can-cuoc-cong-dan-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-viet-nam-can-cuoc-cong-dan-input label="Citizen Identification Number (CCCD)" autocomplete="on"></lily-viet-nam-can-cuoc-cong-dan-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-viet-nam-can-cuoc-cong-dan-input label="Citizen Identification Number (CCCD)" value="079205012345"></lily-viet-nam-can-cuoc-cong-dan-input>',
        ) as unknown as VietNamCanCuocCongDanInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("079205012345");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-viet-nam-can-cuoc-cong-dan-input label="Citizen Identification Number (CCCD)" required disabled></lily-viet-nam-can-cuoc-cong-dan-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-viet-nam-can-cuoc-cong-dan-input label="Citizen Identification Number (CCCD)"></lily-viet-nam-can-cuoc-cong-dan-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe(
            "Citizen Identification Number (CCCD)",
        );
    });
});
