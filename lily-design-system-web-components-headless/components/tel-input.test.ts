import { afterEach, describe, expect, test } from "vitest";

import { TelInput } from "./tel-input.js";

if (!customElements.get("lily-tel-input")) {
    customElements.define("lily-tel-input", TelInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TelInput", () => {
    test("renders a native input type=tel", () => {
        const host = render('<lily-tel-input label="Phone"></lily-tel-input>');

        expect((host.querySelector("input") as HTMLInputElement).type).toBe("tel");
    });

    test("sets autocomplete=tel", () => {
        const host = render('<lily-tel-input label="Phone"></lily-tel-input>');

        expect((host.querySelector("input") as HTMLInputElement).autocomplete).toBe("tel");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-tel-input label="Phone" value="0123"></lily-tel-input>') as unknown as TelInput;

        expect(host.value).toBe("0123");

        host.value = "0456";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("0456");
    });

    test("required and disabled propagate", () => {
        const host = render('<lily-tel-input label="Phone" required disabled></lily-tel-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-tel-input label="Phone number"></lily-tel-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Phone number");
    });
});
