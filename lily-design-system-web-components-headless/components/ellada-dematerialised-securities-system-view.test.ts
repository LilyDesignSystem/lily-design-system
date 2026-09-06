import { afterEach, describe, expect, test } from "vitest";

import { ElladaDematerialisedSecuritiesSystemView } from "./ellada-dematerialised-securities-system-view.js";

if (!customElements.get("lily-ellada-dematerialised-securities-system-view")) {
    customElements.define("lily-ellada-dematerialised-securities-system-view", ElladaDematerialisedSecuritiesSystemView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ElladaDematerialisedSecuritiesSystemView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-ellada-dematerialised-securities-system-view label="ID"></lily-ellada-dematerialised-securities-system-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("ellada-dematerialised-securities-system-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-ellada-dematerialised-securities-system-view label="Dematerialised Securities System"></lily-ellada-dematerialised-securities-system-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Dematerialised Securities System");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-ellada-dematerialised-securities-system-view label="ID"></lily-ellada-dematerialised-securities-system-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-ellada-dematerialised-securities-system-view label="ID" value="1234567890"></lily-ellada-dematerialised-securities-system-view>') as unknown as ElladaDematerialisedSecuritiesSystemView;

        expect(host.querySelector("span")!.textContent).toBe("1234567890");
        expect(host.value).toBe("1234567890");

        host.value = "changed";
        expect(host.querySelector("span")!.textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });
});
