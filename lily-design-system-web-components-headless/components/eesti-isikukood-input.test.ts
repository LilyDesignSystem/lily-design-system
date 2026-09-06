import { afterEach, describe, expect, test } from "vitest";

import { EestiIsikukoodInput } from "./eesti-isikukood-input.js";

if (!customElements.get("lily-eesti-isikukood-input")) {
    customElements.define("lily-eesti-isikukood-input", EestiIsikukoodInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("EestiIsikukoodInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-eesti-isikukood-input label="ID"></lily-eesti-isikukood-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("eesti-isikukood-input");
    });

    test("autocomplete is always off, even if the consumer tries to override it", () => {
        const host = render('<lily-eesti-isikukood-input label="ID" autocomplete="on"></lily-eesti-isikukood-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-eesti-isikukood-input label="ID" value="38001085718"></lily-eesti-isikukood-input>') as unknown as EestiIsikukoodInput;

        expect(host.value).toBe("38001085718");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-eesti-isikukood-input label="ID" required disabled></lily-eesti-isikukood-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-eesti-isikukood-input label="Isikukood"></lily-eesti-isikukood-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Isikukood");
    });
});
