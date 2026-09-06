import { afterEach, describe, expect, test } from "vitest";

import { TuaisceartEireannHealthAndCareNumberView } from "./tuaisceart-eireann-health-and-care-number-view.js";

if (!customElements.get("lily-tuaisceart-eireann-health-and-care-number-view")) {
    customElements.define("lily-tuaisceart-eireann-health-and-care-number-view", TuaisceartEireannHealthAndCareNumberView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TuaisceartEireannHealthAndCareNumberView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-tuaisceart-eireann-health-and-care-number-view label="Health and Care (H&C) Number" value="123 456 7890"></lily-tuaisceart-eireann-health-and-care-number-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("tuaisceart-eireann-health-and-care-number-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-tuaisceart-eireann-health-and-care-number-view label="Health and Care (H&C) Number" value="123 456 7890"></lily-tuaisceart-eireann-health-and-care-number-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Health and Care (H&C) Number");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-tuaisceart-eireann-health-and-care-number-view label="Health and Care (H&C) Number" value="123 456 7890"></lily-tuaisceart-eireann-health-and-care-number-view>') as unknown as TuaisceartEireannHealthAndCareNumberView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("123 456 7890");
        expect(host.value).toBe("123 456 7890");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });
});
