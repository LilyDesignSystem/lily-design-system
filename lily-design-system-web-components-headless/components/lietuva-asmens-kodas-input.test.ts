import { afterEach, describe, expect, test } from "vitest";

import { LietuvaAsmensKodasInput } from "./lietuva-asmens-kodas-input.js";

if (!customElements.get("lily-lietuva-asmens-kodas-input")) {
    customElements.define("lily-lietuva-asmens-kodas-input", LietuvaAsmensKodasInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("LietuvaAsmensKodasInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-lietuva-asmens-kodas-input label="Asmens kodas"></lily-lietuva-asmens-kodas-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("lietuva-asmens-kodas-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-lietuva-asmens-kodas-input label="Asmens kodas" autocomplete="on"></lily-lietuva-asmens-kodas-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-lietuva-asmens-kodas-input label="Asmens kodas" value="38801234567"></lily-lietuva-asmens-kodas-input>') as unknown as LietuvaAsmensKodasInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("38801234567");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-lietuva-asmens-kodas-input label="Asmens kodas" required disabled></lily-lietuva-asmens-kodas-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-lietuva-asmens-kodas-input label="Asmens kodas"></lily-lietuva-asmens-kodas-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Asmens kodas");
    });
});
