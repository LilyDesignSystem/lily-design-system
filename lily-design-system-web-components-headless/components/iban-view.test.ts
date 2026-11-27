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
        const host = render('<lily-iban-view label="IBAN"></lily-iban-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("iban-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-iban-view label="IBAN"></lily-iban-view>');

        expect(
            host
                .querySelector("span .screen-reader-span")
                ?.textContent?.replace(
                    host
                        .querySelector("span .screen-reader-span")
                        ?.querySelector(".screen-reader-span")?.textContent ?? "",
                    "",
                ),
        ).toBe(`${"IBAN"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as text content and exposes a live value property", () => {
        const host = render(
            '<lily-iban-view label="IBAN" value="GB82WEST12345698765432"></lily-iban-view>',
        ) as unknown as IbanView;

        expect(host.value).toBe("GB82WEST12345698765432");
        expect(
            host
                .querySelector("span")!
                .textContent?.replace(
                    host.querySelector("span")!.querySelector(".screen-reader-span")?.textContent ??
                        "",
                    "",
                ),
        ).toBe("GB82WEST12345698765432");

        host.value = "DE89370400440532013000";
        expect(
            host
                .querySelector("span")!
                .textContent?.replace(
                    host.querySelector("span")!.querySelector(".screen-reader-span")?.textContent ??
                        "",
                    "",
                ),
        ).toBe("DE89370400440532013000");
        expect(host.value).toBe("DE89370400440532013000");
    });

    test("shows a change to its attributes after it is mounted (P50-T28)", async () => {
        document.body.innerHTML = `<lily-iban-view label="IBAN" value="GB82WEST12345698765432"></lily-iban-view>`;
        const el = document.querySelector("lily-iban-view")!;
        const span = el.querySelector("span.iban-view")!;
        el.setAttribute("value", "DE89370400440532013000");
        el.setAttribute("label", "Account");
        el.className = "mine";
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(el.querySelector("span.iban-view")).toBe(span);
        expect(span.textContent).toBe("Account DE89370400440532013000");
        expect(span.className).toBe("iban-view mine");
    });
});
