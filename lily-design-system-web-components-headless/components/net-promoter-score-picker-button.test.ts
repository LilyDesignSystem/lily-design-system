import { afterEach, describe, expect, test } from "vitest";

import { NetPromoterScorePickerButton } from "./net-promoter-score-picker-button.js";

if (!customElements.get("lily-net-promoter-score-picker-button")) {
    customElements.define("lily-net-promoter-score-picker-button", NetPromoterScorePickerButton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("NetPromoterScorePickerButton", () => {
    test("renders a native button with the label as visible text", () => {
        const host = render(
            '<lily-net-promoter-score-picker-button value="9" label="9"></lily-net-promoter-score-picker-button>',
        );

        const button = host.querySelector("button") as HTMLButtonElement;
        expect(button.type).toBe("button");
        expect(button.textContent).toBe("9");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-net-promoter-score-picker-button value="9" label="9"></lily-net-promoter-score-picker-button>',
        );

        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("9");
    });

    test("exposes value via data-value", () => {
        const host = render(
            '<lily-net-promoter-score-picker-button value="9" label="9"></lily-net-promoter-score-picker-button>',
        );

        expect(host.querySelector("button")!.getAttribute("data-value")).toBe("9");
    });

    test("defaults aria-pressed to false, and reflects selected", () => {
        const unselected = render(
            '<lily-net-promoter-score-picker-button value="9" label="9"></lily-net-promoter-score-picker-button>',
        );
        expect(unselected.querySelector("button")!.getAttribute("aria-pressed")).toBe("false");

        const selected = render(
            '<lily-net-promoter-score-picker-button value="9" label="9" selected></lily-net-promoter-score-picker-button>',
        );
        expect(selected.querySelector("button")!.getAttribute("aria-pressed")).toBe("true");
    });

    test("disabled propagates to the inner button", () => {
        const host = render(
            '<lily-net-promoter-score-picker-button value="9" label="9" disabled></lily-net-promoter-score-picker-button>',
        );

        expect((host.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through rest attributes", () => {
        const host = render(
            '<lily-net-promoter-score-picker-button value="9" label="9" data-testid="score-9"></lily-net-promoter-score-picker-button>',
        );

        expect(host.querySelector("button")!.getAttribute("data-testid")).toBe("score-9");
    });
});
