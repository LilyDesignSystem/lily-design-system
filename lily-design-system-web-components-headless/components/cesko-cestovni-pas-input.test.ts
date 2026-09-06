import { afterEach, describe, expect, test } from "vitest";

import { CeskoCestovniPasInput } from "./cesko-cestovni-pas-input.js";

if (!customElements.get("lily-cesko-cestovni-pas-input")) {
    customElements.define("lily-cesko-cestovni-pas-input", CeskoCestovniPasInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CeskoCestovniPasInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-cesko-cestovni-pas-input label="ID"></lily-cesko-cestovni-pas-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("cesko-cestovni-pas-input");
    });

    test("autocomplete is always off, even if the consumer tries to override it", () => {
        const host = render('<lily-cesko-cestovni-pas-input label="ID" autocomplete="on"></lily-cesko-cestovni-pas-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-cesko-cestovni-pas-input label="ID" value="12345678"></lily-cesko-cestovni-pas-input>') as unknown as CeskoCestovniPasInput;

        expect(host.value).toBe("12345678");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-cesko-cestovni-pas-input label="ID" required disabled></lily-cesko-cestovni-pas-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-cesko-cestovni-pas-input label="Cestovní Pas"></lily-cesko-cestovni-pas-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Cestovní Pas");
    });
});
