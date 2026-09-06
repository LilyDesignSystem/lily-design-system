import { afterEach, describe, expect, test } from "vitest";

import { ButtonInput } from "./button-input.js";

if (!customElements.get("lily-button-input")) {
    customElements.define("lily-button-input", ButtonInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ButtonInput", () => {
    test("renders a native input type=button with the base class", () => {
        const host = render('<lily-button-input value="Submit"></lily-button-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("button");
        expect(input.classList.contains("button-input")).toBe(true);
    });

    test("value attribute is the visible label text", () => {
        const host = render('<lily-button-input value="Submit"></lily-button-input>');

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("Submit");
    });

    test("label attribute overrides the accessible name via aria-label", () => {
        const host = render('<lily-button-input value="Submit" label="Submit the form"></lily-button-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Submit the form");
    });

    test("disabled propagates to the inner input", () => {
        const host = render('<lily-button-input value="Submit" disabled></lily-button-input>');

        expect((host.querySelector("input") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through rest attributes such as name", () => {
        const host = render('<lily-button-input value="Submit" name="action"></lily-button-input>');

        expect(host.querySelector("input")!.getAttribute("name")).toBe("action");
    });
});
