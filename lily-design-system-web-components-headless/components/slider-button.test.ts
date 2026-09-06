import { afterEach, describe, expect, test, vi } from "vitest";

import { SliderButton } from "./slider-button.js";

if (!customElements.get("lily-slider-button")) {
    customElements.define("lily-slider-button", SliderButton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SliderButton", () => {
    test("renders a native button with role=slider", () => {
        const host = render('<lily-slider-button label="Slide to confirm">Slide to confirm</lily-slider-button>');

        const button = host.querySelector("button") as HTMLButtonElement;
        expect(button.className).toBe("slider-button");
        expect(button.getAttribute("role")).toBe("slider");
        expect(button.type).toBe("button");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-slider-button label="Slide to confirm">Slide</lily-slider-button>');

        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Slide to confirm");
    });

    test("defaults aria-valuenow to 0 with min 0 and max 100", () => {
        const host = render('<lily-slider-button label="Slide to confirm">Slide</lily-slider-button>');

        const button = host.querySelector("button")!;
        expect(button.getAttribute("aria-valuenow")).toBe("0");
        expect(button.getAttribute("aria-valuemin")).toBe("0");
        expect(button.getAttribute("aria-valuemax")).toBe("100");
    });

    test("disabled propagates to the native button", () => {
        const host = render('<lily-slider-button label="Slide to confirm" disabled>Slide</lily-slider-button>');

        expect((host.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("ArrowRight increases the value, and reaching 100 fires lily-confirm", () => {
        const host = render('<lily-slider-button label="Slide to confirm">Slide</lily-slider-button>');
        const button = host.querySelector("button") as HTMLButtonElement;
        const handler = vi.fn();
        host.addEventListener("lily-confirm", handler);

        for (let i = 0; i < 10; i++) {
            button.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        }

        expect(button.getAttribute("aria-valuenow")).toBe("100");
        expect(handler).toHaveBeenCalledTimes(1);
    });

    test("Enter activates immediately", () => {
        const host = render('<lily-slider-button label="Slide to confirm">Slide</lily-slider-button>');
        const button = host.querySelector("button") as HTMLButtonElement;
        const handler = vi.fn();
        host.addEventListener("lily-confirm", handler);

        button.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

        expect(button.getAttribute("aria-valuenow")).toBe("100");
        expect(handler).toHaveBeenCalled();
    });

    test("clicking activates immediately", () => {
        const host = render('<lily-slider-button label="Slide to confirm">Slide</lily-slider-button>');
        const handler = vi.fn();
        host.addEventListener("lily-confirm", handler);

        (host.querySelector("button") as HTMLButtonElement).click();

        expect(handler).toHaveBeenCalled();
    });
});
