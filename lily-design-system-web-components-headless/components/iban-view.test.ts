import { afterEach, describe, expect, test } from "vitest";

import { IbanView } from "./iban-view.js";

if (!customElements.get("lily-iban-view")) {
    customElements.define("lily-iban-view", IbanView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("IbanView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-iban-view label="IBAN"></lily-iban-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("iban-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-iban-view label="IBAN"></lily-iban-view>',
        );

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("IBAN");
    });

    test("seeds the initial value as text content and exposes a live value property", () => {
        const host = render(
            '<lily-iban-view label="IBAN" value="GB82WEST12345698765432"></lily-iban-view>',
        ) as unknown as IbanView;

        expect(host.value).toBe("GB82WEST12345698765432");
        expect(host.querySelector("span")!.textContent).toBe("GB82WEST12345698765432");

        host.value = "DE89370400440532013000";
        expect(host.querySelector("span")!.textContent).toBe("DE89370400440532013000");
        expect(host.value).toBe("DE89370400440532013000");
    });

    test('sets role="text" so the identifier announces as a single unit', () => {
        const host = render(
            '<lily-iban-view label="IBAN"></lily-iban-view>',
        );

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
