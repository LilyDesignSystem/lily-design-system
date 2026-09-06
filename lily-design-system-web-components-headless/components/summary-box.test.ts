import { afterEach, describe, expect, test } from "vitest";

import { SummaryBox } from "./summary-box.js";

if (!customElements.get("lily-summary-box")) {
    customElements.define("lily-summary-box", SummaryBox);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SummaryBox", () => {
    test("renders a native aside", () => {
        const host = render('<lily-summary-box heading="Key takeaways"></lily-summary-box>');

        expect(host.querySelector("aside.summary-box")).toBeTruthy();
    });

    test("renders the heading inside an h3 with the heading class", () => {
        const host = render('<lily-summary-box heading="Key takeaways"></lily-summary-box>');

        const h3 = host.querySelector("h3.summary-box-heading");
        expect(h3).toBeTruthy();
        expect(h3!.textContent).toBe("Key takeaways");
    });

    test("aria-label defaults to the heading when label is omitted", () => {
        const host = render('<lily-summary-box heading="Key takeaways"></lily-summary-box>');

        expect(host.querySelector("aside")!.getAttribute("aria-label")).toBe("Key takeaways");
    });

    test("aria-label uses the label override when supplied", () => {
        const host = render('<lily-summary-box heading="Next steps" label="What to do next"></lily-summary-box>');

        expect(host.querySelector("aside")!.getAttribute("aria-label")).toBe("What to do next");
    });

    test("renders children inside a summary-box-body", () => {
        const host = render(
            '<lily-summary-box heading="Key takeaways"><ul><li>Item one</li></ul></lily-summary-box>',
        );

        const body = host.querySelector("div.summary-box-body");
        expect(body).toBeTruthy();
        expect(body!.querySelector("ul")).toBeTruthy();
    });

    test("passes through rest attributes to the aside", () => {
        const host = render('<lily-summary-box heading="Key takeaways" data-testid="sbox"></lily-summary-box>');

        expect(host.querySelector("aside")!.getAttribute("data-testid")).toBe("sbox");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-summary-box heading="Key takeaways" class="extra"></lily-summary-box>');

        expect(host.querySelector("aside")!.className).toBe("summary-box extra");
    });
});
