import { afterEach, describe, expect, test } from "vitest";

import { Caption } from "./caption.js";

if (!customElements.get("lily-caption")) {
    customElements.define("lily-caption", Caption);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Caption", () => {
    test("renders a native caption with the base class", () => {
        const host = render("<lily-caption>Quarterly sales</lily-caption>");

        const caption = host.querySelector("caption")!;
        expect(caption.className).toBe("caption");
    });

    test("moves the consumer's children into the caption", () => {
        const host = render("<lily-caption>Quarterly sales</lily-caption>");

        expect(host.querySelector("caption")!.textContent).toBe("Quarterly sales");
        expect(host.childNodes.length).toBe(1);
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-caption class="wide">Sales</lily-caption>');

        expect(host.querySelector("caption")!.className).toBe("caption wide");
    });

    test("passes rest attributes through onto the caption", () => {
        const host = render('<lily-caption id="chart-caption">Sales</lily-caption>');

        expect(host.querySelector("caption")!.id).toBe("chart-caption");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-caption>Sales</lily-caption>");

        (host as unknown as Caption).connectedCallback();

        expect(host.querySelectorAll("caption").length).toBe(1);
    });
});
