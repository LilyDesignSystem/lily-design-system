import { afterEach, describe, expect, test } from "vitest";

import { DeutschlandKrankenversichertennummerInput } from "./deutschland-krankenversichertennummer-input.js";

if (!customElements.get("lily-deutschland-krankenversichertennummer-input")) {
    customElements.define("lily-deutschland-krankenversichertennummer-input", DeutschlandKrankenversichertennummerInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("DeutschlandKrankenversichertennummerInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-deutschland-krankenversichertennummer-input label="ID"></lily-deutschland-krankenversichertennummer-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("deutschland-krankenversichertennummer-input");
    });

    test("autocomplete is always off, even if the consumer tries to override it", () => {
        const host = render('<lily-deutschland-krankenversichertennummer-input label="ID" autocomplete="on"></lily-deutschland-krankenversichertennummer-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-deutschland-krankenversichertennummer-input label="ID" value="A123456789"></lily-deutschland-krankenversichertennummer-input>') as unknown as DeutschlandKrankenversichertennummerInput;

        expect(host.value).toBe("A123456789");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-deutschland-krankenversichertennummer-input label="ID" required disabled></lily-deutschland-krankenversichertennummer-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-deutschland-krankenversichertennummer-input label="Krankenversichertennummer"></lily-deutschland-krankenversichertennummer-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Krankenversichertennummer");
    });
});
