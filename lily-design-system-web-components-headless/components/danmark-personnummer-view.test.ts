import { afterEach, describe, expect, test } from "vitest";

import { DanmarkPersonnummerView } from "./danmark-personnummer-view.js";

if (!customElements.get("lily-danmark-personnummer-view")) {
    customElements.define("lily-danmark-personnummer-view", DanmarkPersonnummerView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("DanmarkPersonnummerView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-danmark-personnummer-view label="ID"></lily-danmark-personnummer-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("danmark-personnummer-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-danmark-personnummer-view label="Personnummer"></lily-danmark-personnummer-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Personnummer");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-danmark-personnummer-view label="ID"></lily-danmark-personnummer-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-danmark-personnummer-view label="ID" value="0101851234"></lily-danmark-personnummer-view>') as unknown as DanmarkPersonnummerView;

        expect(host.querySelector("span")!.textContent).toBe("0101851234");
        expect(host.value).toBe("0101851234");

        host.value = "changed";
        expect(host.querySelector("span")!.textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });
});
