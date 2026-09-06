import { afterEach, describe, expect, test } from "vitest";

import { IslandKennitalaInput } from "./island-kennitala-input.js";

if (!customElements.get("lily-island-kennitala-input")) {
    customElements.define("lily-island-kennitala-input", IslandKennitalaInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("IslandKennitalaInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-island-kennitala-input label="Kennitala"></lily-island-kennitala-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("island-kennitala-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-island-kennitala-input label="Kennitala" autocomplete="on"></lily-island-kennitala-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-island-kennitala-input label="Kennitala" value="1207904929"></lily-island-kennitala-input>') as unknown as IslandKennitalaInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("1207904929");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-island-kennitala-input label="Kennitala" required disabled></lily-island-kennitala-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-island-kennitala-input label="Kennitala"></lily-island-kennitala-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Kennitala");
    });
});
