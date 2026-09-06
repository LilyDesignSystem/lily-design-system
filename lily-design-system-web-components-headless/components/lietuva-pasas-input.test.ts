import { afterEach, describe, expect, test } from "vitest";

import { LietuvaPasasInput } from "./lietuva-pasas-input.js";

if (!customElements.get("lily-lietuva-pasas-input")) {
    customElements.define("lily-lietuva-pasas-input", LietuvaPasasInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("LietuvaPasasInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-lietuva-pasas-input label="Pasas (Passport Number)"></lily-lietuva-pasas-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("lietuva-pasas-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-lietuva-pasas-input label="Pasas (Passport Number)" autocomplete="on"></lily-lietuva-pasas-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-lietuva-pasas-input label="Pasas (Passport Number)" value="12345678"></lily-lietuva-pasas-input>') as unknown as LietuvaPasasInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("12345678");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-lietuva-pasas-input label="Pasas (Passport Number)" required disabled></lily-lietuva-pasas-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-lietuva-pasas-input label="Pasas (Passport Number)"></lily-lietuva-pasas-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Pasas (Passport Number)");
    });
});
