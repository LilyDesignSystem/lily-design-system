import { render } from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./ObservationView.svelte";

const root = () => document.querySelector(".observation-view") as HTMLElement;
const part = (name: string) => root().querySelector(`.observation-view-${name}`);

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("ObservationView", () => {
    test("renders a span with the value, unit, flag and range as parts", () => {
        render(Subject, {
            props: {
                value: "5.9",
                unit: "mmol/L",
                interpretation: "H",
                flagLabel: "High",
                range: "3.5–5.3",
            },
        });
        expect(root().tagName).toBe("SPAN");
        expect(part("value")?.textContent).toBe("5.9");
        expect(part("unit")?.textContent).toBe("mmol/L");
        expect(part("flag")?.textContent).toBe("High");
        expect(part("range")?.textContent).toBe("3.5–5.3");
    });

    test("HC-F4: joins value and unit with a no-break space", () => {
        render(Subject, { props: { value: "5.9", unit: "mmol/L" } });
        expect(root().textContent).toContain("5.9 mmol/L");
    });

    test("HC-C1: renders the interpretation code as data, and the flag only as the consumer's words", () => {
        render(Subject, {
            props: { value: "2.1", interpretation: "LL", flagLabel: "Critically low" },
        });
        expect(root().getAttribute("data-interpretation")).toBe("LL");
        expect(root().textContent).not.toContain("LL");
        expect(root().textContent).toContain("Critically low");
    });

    test("HC-C3: not-recorded and unavailable show different words, never a blank", () => {
        const { unmount } = render(Subject, {
            props: { status: "not-recorded", statusLabel: "Not recorded" },
        });
        expect(root().getAttribute("data-status")).toBe("not-recorded");
        expect(part("status")?.textContent).toBe("Not recorded");
        expect(part("value")).toBeNull();
        unmount();
        render(Subject, { props: { status: "unavailable", statusLabel: "Result unavailable" } });
        expect(root().getAttribute("data-status")).toBe("unavailable");
        expect(part("status")?.textContent).toBe("Result unavailable");
    });

    test.each([
        ["amended", "Amended"],
        ["corrected", "Corrected"],
    ])("an %s result shows its value with its words beside it", (status, words) => {
        render(Subject, { props: { value: "5.9", status, statusLabel: words } as never });
        expect(root().getAttribute("data-status")).toBe(status);
        expect(part("value")?.textContent).toBe("5.9");
        expect(part("status")?.textContent).toBe(words);
    });

    test.each([
        ["cancelled", "Test cancelled"],
        ["masked", "Withheld"],
    ])("a %s result shows its words instead of a value", (status, words) => {
        render(Subject, { props: { value: "5.9", status, statusLabel: words } as never });
        expect(part("value")).toBeNull();
        expect(part("status")?.textContent).toBe(words);
    });

    test("a preliminary result shows its value and its status", () => {
        render(Subject, {
            props: { value: "140", status: "preliminary", statusLabel: "Preliminary" },
        });
        expect(part("value")?.textContent).toBe("140");
        expect(part("status")?.textContent).toBe("Preliminary");
    });

    test("label renders as hidden text, not aria-label", () => {
        render(Subject, { props: { label: "Potassium", value: "4.1" } });
        expect(root().querySelector(".screen-reader-span")?.textContent).toBe("Potassium ");
        expect(root().hasAttribute("aria-label")).toBe(false);
    });

    test("warns when an abnormal flag or a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { value: "5.9", interpretation: "H" } });
        render(Subject, { props: { status: "unavailable" } });
        const messages = spy.mock.calls.map((call) => String(call[0]));
        expect(messages.some((m) => m.includes("ObservationView has no flagLabel"))).toBe(true);
        expect(messages.some((m) => m.includes("ObservationView has no statusLabel"))).toBe(true);
    });

    test("a normal result needs no flag words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { value: "4.1", interpretation: "N" } });
        expect(spy).not.toHaveBeenCalled();
    });

    test("not-applicable replaces the value with the consumer's words", () => {
        render(Subject, {
            props: { value: "", status: "not-applicable", statusLabel: "Not applicable" },
        });
        expect(root().getAttribute("data-status")).toBe("not-applicable");
        expect(part("status")!.textContent).toBe("Not applicable");
        expect(part("value")).toBeNull();
    });

    test("HC-C2: never infers an interpretation: with a range but no interpretation, no flag and no data", () => {
        render(Subject, { props: { value: "5.9", unit: "mmol/L", range: "3.5–5.3" } });
        expect(root().hasAttribute("data-interpretation")).toBe(false);
        expect(part("flag")).toBeNull();
    });

    test("renders each named range as its own part", () => {
        render(Subject, {
            props: {
                value: "2.1",
                range: "3.5–5.3",
                ranges: [{ label: "Critical", text: "below 2.5" }],
            },
        });
        const ranges = root().querySelectorAll(".observation-view-range");
        expect(ranges).toHaveLength(2);
        expect(ranges[1].querySelector(".observation-view-range-label")?.textContent).toBe(
            "Critical",
        );
        expect(ranges[1].textContent).toBe("Critical below 2.5");
    });

    test("HC-C4: a corrected result keeps the superseded value in a del, with words", () => {
        render(Subject, {
            props: {
                value: "4.8",
                status: "corrected",
                statusLabel: "Corrected",
                previousValue: "5.1",
                previousLabel: "was 5.1 until 3 Nov",
            },
        });
        expect(root().querySelector("del.observation-view-previous-value")?.textContent).toBe(
            "5.1",
        );
        expect(part("previous-label")?.textContent).toBe("was 5.1 until 3 Nov");
        expect(part("value")?.textContent).toBe("4.8");
    });

    test("warns when a superseded value has no words", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { value: "4.8", previousValue: "5.1" } });
        expect(warn).toHaveBeenCalledWith(
            expect.stringContaining("ObservationView has no previousLabel"),
        );
    });

    test("a meter shows where the value sits, hidden from assistive technology because the words say it", () => {
        const { container } = render(Subject, {
            props: {
                value: "5.9",
                unit: "mmol/L",
                interpretation: "H",
                flagLabel: "High",
                range: "3.5–5.3",
                meterValue: 5.9,
                meterMin: 2,
                meterMax: 8,
                meterLow: 3.5,
                meterHigh: 5.3,
                meterOptimum: 4.4,
            },
        });
        const meter = container.querySelector("meter.observation-view-meter") as HTMLMeterElement;
        expect(meter.getAttribute("aria-hidden")).toBe("true");
        expect([meter.value, meter.min, meter.max, meter.low, meter.high, meter.optimum]).toEqual([
            5.9, 2, 8, 3.5, 5.3, 4.4,
        ]);
        // The flag and range stay in words.
        expect(container.querySelector(".observation-view-flag")?.textContent).toBe("High");
        expect(container.querySelector(".observation-view-range")?.textContent).toBe("3.5–5.3");
    });

    test("no meter without a value, min and max, or for a missing result", () => {
        const partial = render(Subject, { props: { value: "5.9", meterValue: 5.9, meterMin: 2 } });
        expect(partial.container.querySelector("meter")).toBeNull();
        const missing = render(Subject, {
            props: {
                status: "unavailable",
                statusLabel: "Unavailable",
                meterValue: 5.9,
                meterMin: 2,
                meterMax: 8,
            },
        });
        expect(missing.container.querySelector("meter")).toBeNull();
    });
});

const show = (props: object) => {
    document.body.innerHTML = "";
    render(Subject, { props: props as never });
    return root();
};

// the audit of 2026-11-25, finding 2: a result that is withdrawn, withheld or has no words is never read as a plain one.
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
        expect(root.getAttribute("data-status")).toBe("entered-in-error");
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

    test.each([
        " ",
        "   ",
        "\u00a0",
        "\u3000",
        "\u200b",
        "\u2060\ufeff",
        "\t\n",
        "-",
        "\u2014",
        "...",
    ])(
        "HC-C14: a label of %j is not words, so a preliminary result shows no value",
        (statusLabel) => {
            vi.spyOn(console, "warn").mockImplementation(() => {});
            expectNoRecord(show({ ...stale, status: "preliminary", statusLabel }));
            expectNoRecord(
                show({ ...stale, status: "entered-in-error", statusLabel, showWithdrawn: true }),
            );
        },
    );

    test.each(["Preliminary", "暂定", "प्रारंभिक", "مبدئي", "初"])(
        "HC-C14: a label in any script, %s, is words",
        (statusLabel) => {
            const root = show({ value: "5.9", status: "preliminary", statusLabel });
            expect(root.textContent?.trim()).toBe(`5.9 ${statusLabel}`);
        },
    );

    test("an unknown status shows its value beside its words", () => {
        const root = show({ value: "5.9", status: "unknown", statusLabel: "Status not known" });
        expect(root.textContent?.trim()).toBe("5.9 Status not known");
    });

    test("HC-C12, HC-C13: a result that becomes masked or withdrawn stops showing its value", async () => {
        document.body.innerHTML = "";
        const { rerender } = render(Subject, { props: { ...stale, status: "final" } });
        expect(root().textContent).toContain("5.9");
        await rerender({ ...stale, status: "masked", statusLabel: "Withheld" });
        expectNoRecord(root());
        await rerender({ ...stale, status: "final", statusLabel: undefined });
        await rerender({ ...stale, status: "entered-in-error", statusLabel: "Entered in error" });
        expectNoRecord(root());
    });
});
