import { afterEach, describe, expect, test } from "vitest";

import { VietNamCanCuocCongDanView } from "./viet-nam-can-cuoc-cong-dan-view.js";

if (!customElements.get("lily-viet-nam-can-cuoc-cong-dan-view")) {
    customElements.define("lily-viet-nam-can-cuoc-cong-dan-view", VietNamCanCuocCongDanView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("VietNamCanCuocCongDanView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-viet-nam-can-cuoc-cong-dan-view label="Citizen Identification Number (CCCD)" value="079205012345"></lily-viet-nam-can-cuoc-cong-dan-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("viet-nam-can-cuoc-cong-dan-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-viet-nam-can-cuoc-cong-dan-view label="Citizen Identification Number (CCCD)" value="079205012345"></lily-viet-nam-can-cuoc-cong-dan-view>',
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
        ).toBe(`${"Citizen Identification Number (CCCD)"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-viet-nam-can-cuoc-cong-dan-view label="Citizen Identification Number (CCCD)" value="079205012345"></lily-viet-nam-can-cuoc-cong-dan-view>',
        ) as unknown as VietNamCanCuocCongDanView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("079205012345");
        expect(host.value).toBe("079205012345");

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
