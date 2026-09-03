import { afterEach, describe, expect, test } from "vitest";

import { SwitchButton } from "./switch-button.js";

if (!customElements.get("lily-switch-button")) {
    customElements.define("lily-switch-button", SwitchButton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SwitchButton", () => {
    test("renders role=switch", () => {
        const host = render('<lily-switch-button label="Dark mode"></lily-switch-button>');

        expect(host.querySelector("button")!.getAttribute("role")).toBe("switch");
    });

    test("defaults aria-checked to false", () => {
        const host = render('<lily-switch-button label="Dark mode"></lily-switch-button>');

        expect(host.querySelector("button")!.getAttribute("aria-checked")).toBe("false");
    });

    test("reflects the checked attribute (not pressed)", () => {
        const host = render('<lily-switch-button label="Dark mode" checked></lily-switch-button>');

        expect(host.querySelector("button")!.getAttribute("aria-checked")).toBe("true");
    });

    test("toggles checked and dispatches lily-change with {checked} on click", () => {
        const host = render('<lily-switch-button label="Dark mode"></lily-switch-button>');
        const button = host.querySelector("button") as HTMLButtonElement;
        let detail: { checked: boolean } | undefined;
        host.addEventListener("lily-change", (event) => {
            detail = (event as CustomEvent<{ checked: boolean }>).detail;
        });

        button.click();

        expect(host.hasAttribute("checked")).toBe(true);
        expect(detail).toEqual({ checked: true });
    });

    test("does not toggle when disabled", () => {
        const host = render('<lily-switch-button label="Dark mode" disabled></lily-switch-button>');
        const button = host.querySelector("button") as HTMLButtonElement;

        button.click();

        expect(host.hasAttribute("checked")).toBe(false);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-switch-button label="Dark mode"></lily-switch-button>');

        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Dark mode");
    });
});
