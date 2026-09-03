import { afterEach, describe, expect, test } from "vitest";

import { ToggleButton } from "./toggle-button.js";

if (!customElements.get("lily-toggle-button")) {
    customElements.define("lily-toggle-button", ToggleButton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ToggleButton", () => {
    test("renders role=switch on a native button", () => {
        const host = render('<lily-toggle-button label="Notifications"></lily-toggle-button>');

        const button = host.querySelector("button") as HTMLButtonElement;
        expect(button.getAttribute("role")).toBe("switch");
    });

    test("defaults aria-checked to false", () => {
        const host = render('<lily-toggle-button label="Notifications"></lily-toggle-button>');

        expect(host.querySelector("button")!.getAttribute("aria-checked")).toBe("false");
    });

    test("reflects the pressed attribute as aria-checked=true", () => {
        const host = render('<lily-toggle-button label="Notifications" pressed></lily-toggle-button>');

        expect(host.querySelector("button")!.getAttribute("aria-checked")).toBe("true");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-toggle-button label="Notifications"></lily-toggle-button>');

        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Notifications");
    });

    test("toggles pressed and dispatches lily-change on click", () => {
        const host = render('<lily-toggle-button label="Notifications"></lily-toggle-button>');
        const button = host.querySelector("button") as HTMLButtonElement;
        let detail: { pressed: boolean } | undefined;
        host.addEventListener("lily-change", (event) => {
            detail = (event as CustomEvent<{ pressed: boolean }>).detail;
        });

        button.click();

        expect(host.hasAttribute("pressed")).toBe(true);
        expect(detail).toEqual({ pressed: true });
        expect(button.getAttribute("aria-checked")).toBe("true");
    });

    test("toggles back off on a second click", () => {
        const host = render('<lily-toggle-button label="Notifications" pressed></lily-toggle-button>');
        const button = host.querySelector("button") as HTMLButtonElement;

        button.click();

        expect(host.hasAttribute("pressed")).toBe(false);
        expect(button.getAttribute("aria-checked")).toBe("false");
    });

    test("does not toggle when disabled", () => {
        const host = render('<lily-toggle-button label="Notifications" disabled></lily-toggle-button>');
        const button = host.querySelector("button") as HTMLButtonElement;

        button.click();

        expect(host.hasAttribute("pressed")).toBe(false);
        expect(button.disabled).toBe(true);
    });

    test("external toggleAttribute API updates aria-checked via attributeChangedCallback", () => {
        const host = render('<lily-toggle-button label="Notifications"></lily-toggle-button>');

        host.toggleAttribute("pressed", true);

        expect(host.querySelector("button")!.getAttribute("aria-checked")).toBe("true");
    });
});
