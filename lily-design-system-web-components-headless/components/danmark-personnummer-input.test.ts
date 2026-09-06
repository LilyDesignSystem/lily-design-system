import { afterEach, describe, expect, test } from "vitest";

import { DanmarkPersonnummerInput } from "./danmark-personnummer-input.js";

if (!customElements.get("lily-danmark-personnummer-input")) {
    customElements.define("lily-danmark-personnummer-input", DanmarkPersonnummerInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("DanmarkPersonnummerInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-danmark-personnummer-input label="ID"></lily-danmark-personnummer-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("danmark-personnummer-input");
    });

    test("autocomplete is always off, even if the consumer tries to override it", () => {
        const host = render('<lily-danmark-personnummer-input label="ID" autocomplete="on"></lily-danmark-personnummer-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-danmark-personnummer-input label="ID" value="0101851234"></lily-danmark-personnummer-input>') as unknown as DanmarkPersonnummerInput;

        expect(host.value).toBe("0101851234");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-danmark-personnummer-input label="ID" required disabled></lily-danmark-personnummer-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-danmark-personnummer-input label="Personnummer"></lily-danmark-personnummer-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Personnummer");
    });
});
