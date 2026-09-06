import { afterEach, describe, expect, test } from "vitest";

import { GrailLayoutCenterMain } from "./grail-layout-center-main.js";

if (!customElements.get("lily-grail-layout-center-main")) {
    customElements.define("lily-grail-layout-center-main", GrailLayoutCenterMain);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("GrailLayoutCenterMain", () => {
    test("renders a native main landmark", () => {
        const host = render("<lily-grail-layout-center-main></lily-grail-layout-center-main>");

        expect(host.querySelector("main.grail-layout-center-main")).toBeTruthy();
    });

    test("moves its children into the main", () => {
        const host = render('<lily-grail-layout-center-main><p id="content"></p></lily-grail-layout-center-main>');

        expect(host.querySelector("main > #content")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-grail-layout-center-main class="extra"></lily-grail-layout-center-main>');

        expect(host.querySelector("main")!.className).toBe("grail-layout-center-main extra");
    });

    test("rest attributes pass through to the main", () => {
        const host = render('<lily-grail-layout-center-main data-testid="x"></lily-grail-layout-center-main>');

        expect(host.querySelector("main")!.getAttribute("data-testid")).toBe("x");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-grail-layout-center-main></lily-grail-layout-center-main>");

        (host as unknown as GrailLayoutCenterMain).connectedCallback();

        expect(host.querySelectorAll("main").length).toBe(1);
    });
});
