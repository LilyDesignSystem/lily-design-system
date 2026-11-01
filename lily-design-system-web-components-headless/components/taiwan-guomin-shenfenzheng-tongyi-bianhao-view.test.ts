import { afterEach, describe, expect, test } from "vitest";

import { TaiwanGuominShenfenzhengTongyiBianhaoView } from "./taiwan-guomin-shenfenzheng-tongyi-bianhao-view.js";

if (!customElements.get("lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-view")) {
    customElements.define(
        "lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-view",
        TaiwanGuominShenfenzhengTongyiBianhaoView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TaiwanGuominShenfenzhengTongyiBianhaoView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-view label="National Identification Card Number" value="A123456789"></lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("taiwan-guomin-shenfenzheng-tongyi-bianhao-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-view label="National Identification Card Number" value="A123456789"></lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-view>',
        );

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe(
            "National Identification Card Number",
        );
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-view label="National Identification Card Number" value="A123456789"></lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-view>',
        ) as unknown as TaiwanGuominShenfenzhengTongyiBianhaoView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("A123456789");
        expect(host.value).toBe("A123456789");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render(
            '<lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-view label="National Identification Card Number" value="A123456789"></lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-view>',
        );

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
