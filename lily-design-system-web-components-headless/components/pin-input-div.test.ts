import { afterEach, describe, expect, test } from "vitest";

import { PinInputDiv } from "./pin-input-div.js";

if (!customElements.get("lily-pin-input-div")) {
    customElements.define("lily-pin-input-div", PinInputDiv);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PinInputDiv", () => {
    test("the custom element itself is the group (self-is-the-wrapper)", () => {
        const host = render('<lily-pin-input-div label="Enter PIN"></lily-pin-input-div>');

        expect(host.className).toBe("pin-input-div");
        expect(host.getAttribute("role")).toBe("group");
        expect(host.getAttribute("aria-label")).toBe("Enter PIN");
    });

    test("defaults to 4 digit inputs with positional labels", () => {
        const host = render('<lily-pin-input-div label="Enter PIN"></lily-pin-input-div>');
        const inputs = host.querySelectorAll("input");

        expect(inputs.length).toBe(4);
        expect(inputs[0]!.getAttribute("aria-label")).toBe("Digit 1 of 4");
        expect(inputs[3]!.getAttribute("aria-label")).toBe("Digit 4 of 4");
    });

    test("length overrides the number of digit inputs", () => {
        const host = render('<lily-pin-input-div label="Verification code" length="6"></lily-pin-input-div>');

        expect(host.querySelectorAll("input").length).toBe(6);
    });

    test("each digit input has inputmode=numeric and maxlength=1", () => {
        const host = render('<lily-pin-input-div label="Enter PIN"></lily-pin-input-div>');
        const input = host.querySelector("input") as HTMLInputElement;

        expect(input.inputMode).toBe("numeric");
        expect(input.maxLength).toBe(1);
    });

    test("seeds each digit from the initial value", () => {
        const host = render('<lily-pin-input-div label="Enter PIN" value="12"></lily-pin-input-div>');
        const inputs = host.querySelectorAll("input") as NodeListOf<HTMLInputElement>;

        expect(inputs[0]!.value).toBe("1");
        expect(inputs[1]!.value).toBe("2");
        expect(inputs[2]!.value).toBe("");
    });

    test("disabled propagates to every digit input", () => {
        const host = render('<lily-pin-input-div label="Enter PIN" disabled></lily-pin-input-div>');
        const inputs = host.querySelectorAll("input") as NodeListOf<HTMLInputElement>;

        inputs.forEach((input) => expect(input.disabled).toBe(true));
    });

    test("digit entry auto-focuses the next input", () => {
        const host = render('<lily-pin-input-div label="Enter PIN"></lily-pin-input-div>');
        const inputs = host.querySelectorAll("input") as NodeListOf<HTMLInputElement>;

        inputs[0]!.value = "1";
        inputs[0]!.dispatchEvent(new Event("input", { bubbles: true }));

        expect(document.activeElement).toBe(inputs[1]);
    });

    test("non-numeric input is rejected", () => {
        const host = render('<lily-pin-input-div label="Enter PIN"></lily-pin-input-div>');
        const input = host.querySelector("input") as HTMLInputElement;

        input.value = "a";
        input.dispatchEvent(new Event("input", { bubbles: true }));

        expect(input.value).toBe("");
    });

    test("Backspace on an empty input clears and focuses the previous input", () => {
        const host = render('<lily-pin-input-div label="Enter PIN" value="12"></lily-pin-input-div>');
        const inputs = host.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
        inputs[2]!.focus();

        inputs[2]!.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace", bubbles: true }));

        expect(document.activeElement).toBe(inputs[1]);
        expect(inputs[1]!.value).toBe("");
    });

    test("ArrowLeft and ArrowRight move focus between digits", () => {
        const host = render('<lily-pin-input-div label="Enter PIN"></lily-pin-input-div>');
        const inputs = host.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
        inputs[1]!.focus();

        inputs[1]!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
        expect(document.activeElement).toBe(inputs[0]);

        inputs[0]!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(document.activeElement).toBe(inputs[1]);
    });

    test("exposes a combined, bindable value property", () => {
        const host = render('<lily-pin-input-div label="Enter PIN" value="12"></lily-pin-input-div>') as unknown as PinInputDiv;

        expect(host.value).toBe("12");
        host.value = "9876";
        const inputs = host.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
        expect(inputs[0]!.value).toBe("9");
        expect(host.value).toBe("9876");
    });
});
