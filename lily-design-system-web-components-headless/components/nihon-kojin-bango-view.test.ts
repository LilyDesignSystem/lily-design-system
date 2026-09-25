import { afterEach, describe, expect, test } from "vitest";

import { NihonKojinBangoView } from "./nihon-kojin-bango-view.js";

if (!customElements.get("lily-nihon-kojin-bango-view")) {
    customElements.define("lily-nihon-kojin-bango-view", NihonKojinBangoView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("NihonKojinBangoView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-nihon-kojin-bango-view label="Individual Number / My Number (マイナンバー)" value="123456789012"></lily-nihon-kojin-bango-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("nihon-kojin-bango-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-nihon-kojin-bango-view label="Individual Number / My Number (マイナンバー)" value="123456789012"></lily-nihon-kojin-bango-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Individual Number / My Number (マイナンバー)");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-nihon-kojin-bango-view label="Individual Number / My Number (マイナンバー)" value="123456789012"></lily-nihon-kojin-bango-view>') as unknown as NihonKojinBangoView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("123456789012");
        expect(host.value).toBe("123456789012");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-nihon-kojin-bango-view label="Individual Number / My Number (マイナンバー)" value="123456789012"></lily-nihon-kojin-bango-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
