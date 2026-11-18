import { afterEach, describe, expect, test } from "vitest";

import { QazaqstanZhekeSaikestendiruNomiriInput } from "./qazaqstan-zheke-saikestendiru-nomiri-input.js";

if (!customElements.get("lily-qazaqstan-zheke-saikestendiru-nomiri-input")) {
    customElements.define(
        "lily-qazaqstan-zheke-saikestendiru-nomiri-input",
        QazaqstanZhekeSaikestendiruNomiriInput,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("QazaqstanZhekeSaikestendiruNomiriInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-qazaqstan-zheke-saikestendiru-nomiri-input label="Individual Identification Number (IIN)"></lily-qazaqstan-zheke-saikestendiru-nomiri-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("qazaqstan-zheke-saikestendiru-nomiri-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-qazaqstan-zheke-saikestendiru-nomiri-input label="Individual Identification Number (IIN)" autocomplete="on"></lily-qazaqstan-zheke-saikestendiru-nomiri-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-qazaqstan-zheke-saikestendiru-nomiri-input label="Individual Identification Number (IIN)" value="900101300123"></lily-qazaqstan-zheke-saikestendiru-nomiri-input>',
        ) as unknown as QazaqstanZhekeSaikestendiruNomiriInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("900101300123");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-qazaqstan-zheke-saikestendiru-nomiri-input label="Individual Identification Number (IIN)" required disabled></lily-qazaqstan-zheke-saikestendiru-nomiri-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-qazaqstan-zheke-saikestendiru-nomiri-input label="Individual Identification Number (IIN)"></lily-qazaqstan-zheke-saikestendiru-nomiri-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe(
            "Individual Identification Number (IIN)",
        );
    });
});
