import { render } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./ObservationView";

const part = (c: HTMLElement, name: string) => c.querySelector(`.observation-view-${name}`);

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("ObservationView", () => {
    test("renders a span with value, unit, flag and range", () => {
        const { container } = render(
            <Subject
                value="5.9"
                unit="mmol/L"
                interpretation="H"
                flagLabel="High"
                range="3.5–5.3"
            />,
        );
        const root = container.querySelector(".observation-view") as HTMLElement;
        expect(root.tagName).toBe("SPAN");
        expect(root.getAttribute("data-interpretation")).toBe("H");
        expect(part(container, "value")?.textContent).toBe("5.9");
        expect(part(container, "unit")?.textContent).toBe("mmol/L");
        expect(part(container, "flag")?.textContent).toBe("High");
        expect(part(container, "range")?.textContent).toBe("3.5–5.3");
        expect(root.textContent).toContain("5.9 mmol/L");
        expect(root.textContent).not.toContain(" H ");
    });

    test("not-recorded and unavailable show different words, never a blank", () => {
        const a = render(
            <Subject
                status="not-recorded"
                statusLabel="Not recorded"
            />,
        );
        expect(part(a.container, "status")?.textContent).toBe("Not recorded");
        expect(part(a.container, "value")).toBeNull();
        const b = render(
            <Subject
                status="unavailable"
                statusLabel="Result unavailable"
            />,
        );
        expect(part(b.container, "status")?.textContent).toBe("Result unavailable");
        expect(b.container.querySelector(".observation-view")?.getAttribute("data-status")).toBe(
            "unavailable",
        );
    });

    test.each([
        ["amended", "Amended"],
        ["corrected", "Corrected"],
        ["entered-in-error", "Entered in error"],
    ] as const)("an %s result shows its value with its words beside it", (status, words) => {
        const { container } = render(
            <Subject
                value="5.9"
                status={status}
                statusLabel={words}
            />,
        );
        expect(part(container, "value")?.textContent).toBe("5.9");
        expect(part(container, "status")?.textContent).toBe(words);
    });

    test.each([
        ["cancelled", "Test cancelled"],
        ["masked", "Withheld"],
    ] as const)("a %s result shows its words instead of a value", (status, words) => {
        const { container } = render(
            <Subject
                value="5.9"
                status={status}
                statusLabel={words}
            />,
        );
        expect(part(container, "value")).toBeNull();
        expect(part(container, "status")?.textContent).toBe(words);
    });

    test("label renders as hidden text, not aria-label", () => {
        const { container } = render(
            <Subject
                label="Potassium"
                value="4.1"
            />,
        );
        const root = container.querySelector(".observation-view") as HTMLElement;
        expect(root.querySelector(".screen-reader-span")?.textContent).toBe("Potassium ");
        expect(root.hasAttribute("aria-label")).toBe(false);
    });

    test("warns when an abnormal flag or a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(
            <Subject
                value="5.9"
                interpretation="H"
            />,
        );
        render(<Subject status="unavailable" />);
        const messages = spy.mock.calls.map((call) => String(call[0]));
        expect(messages.some((m) => m.includes("has no flagLabel"))).toBe(true);
        expect(messages.some((m) => m.includes("has no statusLabel"))).toBe(true);
    });

    test("not-applicable replaces the value with the consumer's words", () => {
        const { container } = render(
            <Subject
                value=""
                status="not-applicable"
                statusLabel="Not applicable"
            />,
        );
        const root = container.querySelector(".observation-view") as HTMLElement;
        expect(root.getAttribute("data-status")).toBe("not-applicable");
        expect(root.querySelector(".observation-view-status")?.textContent).toBe("Not applicable");
        expect(root.querySelector(".observation-view-value")).toBeNull();
    });

    test("never infers an interpretation: with a range but no interpretation, no flag and no data", () => {
        const { container } = render(
            <Subject
                value="5.9"
                unit="mmol/L"
                range="3.5–5.3"
            />,
        );
        const root = container.querySelector(".observation-view") as HTMLElement;
        expect(root.hasAttribute("data-interpretation")).toBe(false);
        expect(root.querySelector(".observation-view-flag")).toBeNull();
    });

    test("renders each named range as its own part", () => {
        const { container } = render(
            <Subject
                value="2.1"
                range="3.5–5.3"
                ranges={[{ label: "Critical", text: "below 2.5" }]}
            />,
        );
        const ranges = container.querySelectorAll(".observation-view-range");
        expect(ranges).toHaveLength(2);
        expect(ranges[1].textContent).toBe("Critical below 2.5");
    });

    test("a corrected result keeps the superseded value in a del, with words", () => {
        const { container } = render(
            <Subject
                value="4.8"
                status="corrected"
                statusLabel="Corrected"
                previousValue="5.1"
                previousLabel="was 5.1 until 3 Nov"
            />,
        );
        expect(container.querySelector("del.observation-view-previous-value")?.textContent).toBe(
            "5.1",
        );
        expect(container.querySelector(".observation-view-previous-label")?.textContent).toBe(
            "was 5.1 until 3 Nov",
        );
    });

    test("a meter shows where the value sits, hidden from assistive technology because the words say it", () => {
        const { container } = render(
            <Subject
                value="5.9"
                unit="mmol/L"
                interpretation="H"
                flagLabel="High"
                range="3.5–5.3"
                meterValue={5.9}
                meterMin={2}
                meterMax={8}
                meterLow={3.5}
                meterHigh={5.3}
                meterOptimum={4.4}
            />,
        );
        const meter = container.querySelector("meter.observation-view-meter") as HTMLMeterElement;
        expect(meter.getAttribute("aria-hidden")).toBe("true");
        expect([meter.value, meter.min, meter.max, meter.low, meter.high, meter.optimum]).toEqual([
            5.9, 2, 8, 3.5, 5.3, 4.4,
        ]);
        expect(container.querySelector(".observation-view-flag")?.textContent).toBe("High");
    });

    test("no meter without a value, min and max, or for a missing result", () => {
        const partial = render(
            <Subject
                value="5.9"
                meterValue={5.9}
                meterMin={2}
            />,
        );
        expect(partial.container.querySelector("meter")).toBeNull();
        const missing = render(
            <Subject
                status="unavailable"
                statusLabel="Unavailable"
                meterValue={5.9}
                meterMin={2}
                meterMax={8}
            />,
        );
        expect(missing.container.querySelector("meter")).toBeNull();
    });
});
