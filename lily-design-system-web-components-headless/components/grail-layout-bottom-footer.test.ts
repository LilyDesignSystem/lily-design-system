import { afterEach, describe, expect, test } from "vitest";

import { GrailLayoutBottomFooter } from "./grail-layout-bottom-footer.js";

if (!customElements.get("lily-grail-layout-bottom-footer")) {
    customElements.define("lily-grail-layout-bottom-footer", GrailLayoutBottomFooter);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("GrailLayoutBottomFooter", () => {
    test("renders a native footer", () => {
        const host = render("<lily-grail-layout-bottom-footer></lily-grail-layout-bottom-footer>");

        expect(host.querySelector("footer.grail-layout-bottom-footer")).toBeTruthy();
    });

    test("moves its children into the footer", () => {
        const host = render(
            '<lily-grail-layout-bottom-footer><p id="copyright"></p></lily-grail-layout-bottom-footer>',
        );

        expect(host.querySelector("footer > #copyright")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-grail-layout-bottom-footer class="extra"></lily-grail-layout-bottom-footer>');

        expect(host.querySelector("footer")!.className).toBe("grail-layout-bottom-footer extra");
    });

    test("rest attributes pass through to the footer", () => {
        const host = render('<lily-grail-layout-bottom-footer data-testid="x"></lily-grail-layout-bottom-footer>');

        expect(host.querySelector("footer")!.getAttribute("data-testid")).toBe("x");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-grail-layout-bottom-footer></lily-grail-layout-bottom-footer>");

        (host as unknown as GrailLayoutBottomFooter).connectedCallback();

        expect(host.querySelectorAll("footer").length).toBe(1);
    });
});
