import { afterEach, describe, expect, test } from "vitest";

import { HangukJuminDeungnokBeonhoView } from "./hanguk-jumin-deungnok-beonho-view.js";

if (!customElements.get("lily-hanguk-jumin-deungnok-beonho-view")) {
    customElements.define("lily-hanguk-jumin-deungnok-beonho-view", HangukJuminDeungnokBeonhoView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("HangukJuminDeungnokBeonhoView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-hanguk-jumin-deungnok-beonho-view label="Resident Registration Number (주민등록번호)" value="900101-1234567"></lily-hanguk-jumin-deungnok-beonho-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("hanguk-jumin-deungnok-beonho-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-hanguk-jumin-deungnok-beonho-view label="Resident Registration Number (주민등록번호)" value="900101-1234567"></lily-hanguk-jumin-deungnok-beonho-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Resident Registration Number (주민등록번호)");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-hanguk-jumin-deungnok-beonho-view label="Resident Registration Number (주민등록번호)" value="900101-1234567"></lily-hanguk-jumin-deungnok-beonho-view>') as unknown as HangukJuminDeungnokBeonhoView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("900101-1234567");
        expect(host.value).toBe("900101-1234567");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-hanguk-jumin-deungnok-beonho-view label="Resident Registration Number (주민등록번호)" value="900101-1234567"></lily-hanguk-jumin-deungnok-beonho-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
