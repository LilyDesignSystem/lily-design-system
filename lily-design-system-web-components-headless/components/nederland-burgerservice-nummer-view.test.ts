import { afterEach, describe, expect, test } from "vitest";

import { NederlandBurgerserviceNummerView } from "./nederland-burgerservice-nummer-view.js";

if (!customElements.get("lily-nederland-burgerservice-nummer-view")) {
    customElements.define("lily-nederland-burgerservice-nummer-view", NederlandBurgerserviceNummerView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("NederlandBurgerserviceNummerView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-nederland-burgerservice-nummer-view label="Burgerservicenummer (BSN)" value="123456782"></lily-nederland-burgerservice-nummer-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("nederland-burgerservice-nummer-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-nederland-burgerservice-nummer-view label="Burgerservicenummer (BSN)" value="123456782"></lily-nederland-burgerservice-nummer-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Burgerservicenummer (BSN)");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-nederland-burgerservice-nummer-view label="Burgerservicenummer (BSN)" value="123456782"></lily-nederland-burgerservice-nummer-view>') as unknown as NederlandBurgerserviceNummerView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("123456782");
        expect(host.value).toBe("123456782");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-nederland-burgerservice-nummer-view label="Burgerservicenummer (BSN)" value="123456782"></lily-nederland-burgerservice-nummer-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
