import { afterEach, describe, expect, test } from "vitest";

import { HangukJuminDeungnokBeonhoInput } from "./hanguk-jumin-deungnok-beonho-input.js";

if (!customElements.get("lily-hanguk-jumin-deungnok-beonho-input")) {
    customElements.define("lily-hanguk-jumin-deungnok-beonho-input", HangukJuminDeungnokBeonhoInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("HangukJuminDeungnokBeonhoInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-hanguk-jumin-deungnok-beonho-input label="Resident Registration Number (주민등록번호)"></lily-hanguk-jumin-deungnok-beonho-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("hanguk-jumin-deungnok-beonho-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-hanguk-jumin-deungnok-beonho-input label="Resident Registration Number (주민등록번호)" autocomplete="on"></lily-hanguk-jumin-deungnok-beonho-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-hanguk-jumin-deungnok-beonho-input label="Resident Registration Number (주민등록번호)" value="900101-1234567"></lily-hanguk-jumin-deungnok-beonho-input>') as unknown as HangukJuminDeungnokBeonhoInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("900101-1234567");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-hanguk-jumin-deungnok-beonho-input label="Resident Registration Number (주민등록번호)" required disabled></lily-hanguk-jumin-deungnok-beonho-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-hanguk-jumin-deungnok-beonho-input label="Resident Registration Number (주민등록번호)"></lily-hanguk-jumin-deungnok-beonho-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Resident Registration Number (주민등록번호)");
    });
});
