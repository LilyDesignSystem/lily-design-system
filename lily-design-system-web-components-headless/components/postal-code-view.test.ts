import { afterEach, describe, expect, test } from "vitest";

import { PostalCodeView } from "./postal-code-view.js";

if (!customElements.get("lily-postal-code-view")) {
    customElements.define("lily-postal-code-view", PostalCodeView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PostalCodeView", () => {
    test("renders a native span with the correct class", () => {
        const host = render("<lily-postal-code-view></lily-postal-code-view>");

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("postal-code-view");
    });

    test("seeds the initial text as textContent and exposes a live text property", () => {
        const host = render('<lily-postal-code-view text="SW1A 1AA"></lily-postal-code-view>') as unknown as PostalCodeView;

        expect(host.querySelector("span")!.textContent).toBe("SW1A 1AA");
        expect(host.text).toBe("SW1A 1AA");

        host.text = "90210";
        expect(host.querySelector("span")!.textContent).toBe("90210");
        expect(host.text).toBe("90210");
    });

    test("defaults to an empty string when text is absent", () => {
        const host = render("<lily-postal-code-view></lily-postal-code-view>");

        expect(host.querySelector("span")!.textContent).toBe("");
    });

    test("passes through rest attributes onto the span", () => {
        const host = render('<lily-postal-code-view text="90210" data-testid="zip"></lily-postal-code-view>');

        expect(host.querySelector("span")!.getAttribute("data-testid")).toBe("zip");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render('<lily-postal-code-view text="90210" class="my-view"></lily-postal-code-view>');

        expect(host.querySelector("span")!.className).toBe("postal-code-view my-view");
    });
});
