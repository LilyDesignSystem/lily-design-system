import { afterEach, describe, expect, test, vi } from "vitest";

import { AgeView } from "./age-view.js";

if (!customElements.get("lily-age-view")) customElements.define("lily-age-view", AgeView);

afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body;
}

describe("AgeView", () => {
    test("renders the consumer\x27s words and the duration as data", () => {
        const body = render(
            `<lily-age-view label="Age" value="3 weeks 2 days" duration="P23D"></lily-age-view>`,
        );
        const root = body.querySelector("span.age-view") as HTMLElement;
        expect(root.getAttribute("data-duration")).toBe("P23D");
        expect(root.textContent).toBe("Age 3 weeks 2 days");
        expect(root.hasAttribute("aria-label")).toBe(false);
    });
});
