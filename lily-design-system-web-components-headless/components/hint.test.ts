import { afterEach, describe, expect, test } from "vitest";

import { Hint } from "./hint.js";

if (!customElements.get("lily-hint")) {
    customElements.define("lily-hint", Hint);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Hint", () => {
    test("renders a span with the correct class", () => {
        const host = render("<lily-hint>This is a 10-digit number.</lily-hint>");

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("hint");
    });

    test("carries the id for aria-describedby linking when provided", () => {
        const host = render('<lily-hint id="nhs-number-hint">This is a 10-digit number.</lily-hint>');

        expect(host.querySelector("span")!.id).toBe("nhs-number-hint");
    });

    test("omits an id when not provided", () => {
        const host = render("<lily-hint>Hint text</lily-hint>");

        expect(host.querySelector("span")!.id).toBe("");
    });

    test("moves children into the inner span", () => {
        const host = render("<lily-hint>For example, 15 3 1984</lily-hint>");

        expect(host.querySelector("span")!.textContent).toBe("For example, 15 3 1984");
    });

    test("passes through rest attributes and the class hook", () => {
        const host = render('<lily-hint class="extra" data-testid="hint">Hint text</lily-hint>');

        const span = host.querySelector("span")!;
        expect(span.className).toBe("hint extra");
        expect(span.getAttribute("data-testid")).toBe("hint");
    });
});
