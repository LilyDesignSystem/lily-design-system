import { afterEach, describe, expect, test, vi } from "vitest";

import { ObservationView } from "./observation-view.js";

if (!customElements.get("lily-observation-view"))
    customElements.define("lily-observation-view", ObservationView);

afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body;
}

describe("ObservationView", () => {
    test("renders a span with value, unit, flag and range", () => {
        const body = render(
            `<lily-observation-view value="5.9" unit="mmol/L" interpretation="H" flag-label="High" range="3.5–5.3"></lily-observation-view>`,
        );
        const root = body.querySelector("span.observation-view") as HTMLElement;
        expect(root.getAttribute("data-interpretation")).toBe("H");
        expect(root.querySelector(".observation-view-value")?.textContent).toBe("5.9");
        expect(root.querySelector(".observation-view-unit")?.textContent).toBe("mmol/L");
        expect(root.querySelector(".observation-view-flag")?.textContent).toBe("High");
        expect(root.querySelector(".observation-view-range")?.textContent).toBe("3.5–5.3");
        expect(root.textContent).toContain("5.9 mmol/L");
    });

    test("not-recorded and unavailable show different words, never a blank", () => {
        const a = render(
            `<lily-observation-view status="not-recorded" status-label="Not recorded"></lily-observation-view>`,
        );
        expect(a.querySelector(".observation-view-status")?.textContent).toBe("Not recorded");
        expect(a.querySelector(".observation-view-value")).toBeNull();
        const b = render(
            `<lily-observation-view status="unavailable" status-label="Result unavailable"></lily-observation-view>`,
        );
        expect(b.querySelector(".observation-view")?.getAttribute("data-status")).toBe(
            "unavailable",
        );
        expect(b.querySelector(".observation-view-status")?.textContent).toBe("Result unavailable");
    });

    test("label renders as hidden text, not aria-label", () => {
        const body = render(
            `<lily-observation-view label="Potassium" value="4.1"></lily-observation-view>`,
        );
        expect(body.querySelector(".screen-reader-span")?.textContent).toBe("Potassium ");
        expect(body.querySelector(".observation-view")?.hasAttribute("aria-label")).toBe(false);
    });
});
