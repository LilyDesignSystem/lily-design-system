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
    test("HC-F4: renders a span with value, unit, flag and range", () => {
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

    test("HC-C3: not-recorded and unavailable show different words, never a blank", () => {
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

    test("HC-C2, HC-C4: never infers an interpretation, renders named ranges, and keeps a superseded value", () => {
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

// The host element, so its own attributes are checked too.
const show = (props: Record<string, unknown>) => {
    document.body.innerHTML = "";
    const host = document.createElement("lily-observation-view");
    for (const [key, value] of Object.entries(props)) {
        const name = key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
        if (typeof value === "boolean") host.toggleAttribute(name, value);
        else
            host.setAttribute(
                name,
                typeof value === "object" ? JSON.stringify(value) : String(value),
            );
    }
    document.body.append(host);
    return host;
};

// docs/audits/gpt-6-2-astra-high finding 2: a result that is withdrawn, withheld or has no words is never read as a plain one.
describe("ObservationView: withheld and withdrawn results", () => {
    const stale = {
        value: "5.9",
        unit: "mmol/L",
        interpretation: "HH",
        flagLabel: "Critically high",
        range: "3.5-5.3",
        ranges: [{ label: "Critical", text: "above 6.5" }],
        meterValue: 5.9,
        meterMin: 2,
        meterMax: 8,
        previousValue: "5.1",
        previousLabel: "was 5.1",
    };
    const expectNoRecord = (root: HTMLElement) => {
        for (const trace of ["5.9", "HH", "Critically", "3.5", "6.5", "5.1", "<meter", "<del"])
            expect(root.outerHTML).not.toContain(trace);
        expect(root.hasAttribute("data-interpretation")).toBe(false);
    };

    test.each([
        ["masked", "Withheld"],
        ["registered", "Not yet available"],
        ["cancelled", "Test cancelled"],
        ["unavailable", "Result unavailable"],
        ["not-applicable", "Not applicable"],
    ])(
        "HC-C12: a %s result with a stale flag shows only its words, in text and attributes",
        (status, statusLabel) => {
            const root = show({ ...stale, status, statusLabel });
            expect(root.textContent?.trim()).toBe(statusLabel);
            expectNoRecord(root);
        },
    );

    test("HC-C13: an entered-in-error result shows only its words", () => {
        const root = show({
            ...stale,
            status: "entered-in-error",
            statusLabel: "Entered in error",
        });
        expect(root.textContent?.trim()).toBe("Entered in error");
        expectNoRecord(root);
        expect(root.querySelector("span.observation-view")?.getAttribute("data-status")).toBe(
            "entered-in-error",
        );
    });

    test("HC-C13: in a history view the former value follows its words, struck through, with no flag, range or meter", () => {
        const root = show({
            ...stale,
            status: "entered-in-error",
            statusLabel: "Entered in error",
            showWithdrawn: true,
        });
        expect(root.textContent?.trim()).toBe("Entered in error 5.9\u00a0mmol/L");
        expect(root.querySelector("del.observation-view-withdrawn-value")?.textContent).toBe(
            "5.9\u00a0mmol/L",
        );
        for (const trace of ["HH", "Critically", "3.5", "6.5", "<meter", "5.1"])
            expect(root.outerHTML).not.toContain(trace);
    });

    test.each([
        "preliminary",
        "amended",
        "corrected",
        "unknown",
        "entered-in-error",
        "masked",
        "registered",
    ])("HC-C14: a %s result with no words shows no value, even in a history view", (status) => {
        vi.spyOn(console, "warn").mockImplementation(() => {});
        expectNoRecord(show({ ...stale, status, showWithdrawn: true }));
    });

    test("an unknown status shows its value beside its words", () => {
        const root = show({ value: "5.9", status: "unknown", statusLabel: "Status not known" });
        expect(root.textContent?.trim()).toBe("5.9 Status not known");
    });
});
