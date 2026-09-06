import { afterEach, describe, expect, test } from "vitest";

import { NederlandBurgerserviceNummerInput } from "./nederland-burgerservice-nummer-input.js";

if (!customElements.get("lily-nederland-burgerservice-nummer-input")) {
    customElements.define("lily-nederland-burgerservice-nummer-input", NederlandBurgerserviceNummerInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("NederlandBurgerserviceNummerInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-nederland-burgerservice-nummer-input label="Burgerservicenummer (BSN)"></lily-nederland-burgerservice-nummer-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("nederland-burgerservice-nummer-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-nederland-burgerservice-nummer-input label="Burgerservicenummer (BSN)" autocomplete="on"></lily-nederland-burgerservice-nummer-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-nederland-burgerservice-nummer-input label="Burgerservicenummer (BSN)" value="123456782"></lily-nederland-burgerservice-nummer-input>') as unknown as NederlandBurgerserviceNummerInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("123456782");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-nederland-burgerservice-nummer-input label="Burgerservicenummer (BSN)" required disabled></lily-nederland-burgerservice-nummer-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-nederland-burgerservice-nummer-input label="Burgerservicenummer (BSN)"></lily-nederland-burgerservice-nummer-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Burgerservicenummer (BSN)");
    });
});
