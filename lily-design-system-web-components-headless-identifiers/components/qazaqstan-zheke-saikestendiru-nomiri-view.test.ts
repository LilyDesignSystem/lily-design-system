import { afterEach, describe, expect, test } from "vitest";

import { QazaqstanZhekeSaikestendiruNomiriView } from "./qazaqstan-zheke-saikestendiru-nomiri-view.js";

if (!customElements.get("lily-qazaqstan-zheke-saikestendiru-nomiri-view")) {
    customElements.define(
        "lily-qazaqstan-zheke-saikestendiru-nomiri-view",
        QazaqstanZhekeSaikestendiruNomiriView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("QazaqstanZhekeSaikestendiruNomiriView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-qazaqstan-zheke-saikestendiru-nomiri-view label="Individual Identification Number (IIN)" value="900101300123"></lily-qazaqstan-zheke-saikestendiru-nomiri-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("qazaqstan-zheke-saikestendiru-nomiri-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-qazaqstan-zheke-saikestendiru-nomiri-view label="Individual Identification Number (IIN)" value="900101300123"></lily-qazaqstan-zheke-saikestendiru-nomiri-view>',
        );

        expect(
            host
                .querySelector("span .screen-reader-span")
                ?.textContent?.replace(
                    host
                        .querySelector("span .screen-reader-span")
                        ?.querySelector(".screen-reader-span")?.textContent ?? "",
                    "",
                ),
        ).toBe(`${"Individual Identification Number (IIN)"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-qazaqstan-zheke-saikestendiru-nomiri-view label="Individual Identification Number (IIN)" value="900101300123"></lily-qazaqstan-zheke-saikestendiru-nomiri-view>',
        ) as unknown as QazaqstanZhekeSaikestendiruNomiriView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("900101300123");
        expect(host.value).toBe("900101300123");

        host.value = "changed";
        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("changed");
        expect(host.value).toBe("changed");
    });
});
