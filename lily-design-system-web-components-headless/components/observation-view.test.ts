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

    test.each([
        ["amended", "Amended"],
        ["corrected", "Corrected"],
        ["entered-in-error", "Entered in error"],
    ])("an %s result shows its value with its words beside it", (status, words) => {
        const body = render(
            `<lily-observation-view value="5.9" status="${status}" status-label="${words}"></lily-observation-view>`,
        );
        expect(body.querySelector(".observation-view-value")?.textContent).toBe("5.9");
        expect(body.querySelector(".observation-view-status")?.textContent).toBe(words);
    });

    test.each([
        ["cancelled", "Test cancelled"],
        ["masked", "Withheld"],
    ])("a %s result shows its words instead of a value", (status, words) => {
        const body = render(
            `<lily-observation-view value="5.9" status="${status}" status-label="${words}"></lily-observation-view>`,
        );
        expect(body.querySelector(".observation-view-value")).toBeNull();
        expect(body.querySelector(".observation-view-status")?.textContent).toBe(words);
    });

    test("label renders as hidden text, not aria-label", () => {
        const body = render(
            `<lily-observation-view label="Potassium" value="4.1"></lily-observation-view>`,
        );
        expect(body.querySelector(".screen-reader-span")?.textContent).toBe("Potassium ");
        expect(body.querySelector(".observation-view")?.hasAttribute("aria-label")).toBe(false);
    });

    test("never infers an interpretation, renders named ranges, and keeps a superseded value", () => {
        document.body.innerHTML = `<lily-observation-view value="4.8" range="3.5–5.3" ranges='[{"label":"Critical","text":"below 2.5"}]' status="corrected" status-label="Corrected" previous-value="5.1" previous-label="was 5.1 until 3 Nov"></lily-observation-view>`;
        const root = document.querySelector("span.observation-view") as HTMLElement;
        expect(root.hasAttribute("data-interpretation")).toBe(false);
        expect(root.querySelector(".observation-view-flag")).toBeNull();
        const ranges = root.querySelectorAll(".observation-view-range");
        expect(ranges).toHaveLength(2);
        expect(ranges[1].textContent).toBe("Critical below 2.5");
        expect(root.querySelector("del.observation-view-previous-value")?.textContent).toBe("5.1");
        expect(root.querySelector(".observation-view-previous-label")?.textContent).toBe(
            "was 5.1 until 3 Nov",
        );
    });

    test("a meter shows where the value sits, hidden from assistive technology because the words say it", () => {
        const host = render(
            '<lily-observation-view value="5.9" interpretation="H" flag-label="High" meter-value="5.9" meter-min="2" meter-max="8" meter-low="3.5" meter-high="5.3" meter-optimum="4.4"></lily-observation-view>',
        );
        const meter = host.querySelector("meter.observation-view-meter") as HTMLMeterElement;
        expect(meter.getAttribute("aria-hidden")).toBe("true");
        expect([meter.value, meter.min, meter.max, meter.low, meter.high, meter.optimum]).toEqual([
            5.9, 2, 8, 3.5, 5.3, 4.4,
        ]);
    });

    test("no meter without a value, min and max, or for a missing result", () => {
        expect(
            render(
                '<lily-observation-view value="5.9" meter-value="5.9" meter-min="2"></lily-observation-view>',
            ).querySelector("meter"),
        ).toBeNull();
        expect(
            render(
                '<lily-observation-view status="unavailable" status-label="Unavailable" meter-value="5.9" meter-min="2" meter-max="8"></lily-observation-view>',
            ).querySelector("meter"),
        ).toBeNull();
    });
});
