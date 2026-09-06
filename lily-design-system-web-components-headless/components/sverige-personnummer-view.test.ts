import { afterEach, describe, expect, test } from "vitest";

import { SverigePersonnummerView } from "./sverige-personnummer-view.js";

if (!customElements.get("lily-sverige-personnummer-view")) {
    customElements.define("lily-sverige-personnummer-view", SverigePersonnummerView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SverigePersonnummerView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-sverige-personnummer-view label="Personnummer"></lily-sverige-personnummer-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("sverige-personnummer-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-sverige-personnummer-view label="Personnummer"></lily-sverige-personnummer-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Personnummer");
    });

    test("seeds the initial value as text content and exposes a live value property", () => {
        const host = render('<lily-sverige-personnummer-view label="Personnummer" value="198507099805"></lily-sverige-personnummer-view>') as unknown as SverigePersonnummerView;

        expect(host.value).toBe("198507099805");
        expect(host.querySelector("span")!.textContent).toBe("198507099805");

        host.value = "199001011234";
        expect(host.querySelector("span")!.textContent).toBe("199001011234");
        expect(host.value).toBe("199001011234");
    });

    test('sets role="text" so the identifier announces as a single unit', () => {
        const host = render('<lily-sverige-personnummer-view label="Personnummer"></lily-sverige-personnummer-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
