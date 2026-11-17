import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { ObservationView } from "./ObservationView";

function mount(inputs: Record<string, unknown>) {
    const fixture = TestBed.createComponent(ObservationView);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector(".observation-view") as HTMLElement;
}

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("ObservationView", () => {
    test("renders a span with value, unit, flag and range", () => {
        const root = mount({
            value: "5.9",
            unit: "mmol/L",
            interpretation: "H",
            flagLabel: "High",
            range: "3.5–5.3",
        });
        expect(root.tagName).toBe("SPAN");
        expect(root.getAttribute("data-interpretation")).toBe("H");
        expect(root.querySelector(".observation-view-value")?.textContent).toBe("5.9");
        expect(root.querySelector(".observation-view-unit")?.textContent).toBe("mmol/L");
        expect(root.querySelector(".observation-view-flag")?.textContent).toBe("High");
        expect(root.querySelector(".observation-view-range")?.textContent).toBe("3.5–5.3");
        expect(root.textContent).toContain("5.9 mmol/L");
    });

    test("not-recorded and unavailable show different words, never a blank", () => {
        const a = mount({ status: "not-recorded", statusLabel: "Not recorded" });
        expect(a.querySelector(".observation-view-status")?.textContent).toBe("Not recorded");
        expect(a.querySelector(".observation-view-value")).toBeNull();
        const b = mount({ status: "unavailable", statusLabel: "Result unavailable" });
        expect(b.querySelector(".observation-view-status")?.textContent).toBe("Result unavailable");
        expect(b.getAttribute("data-status")).toBe("unavailable");
    });

    test.each([
        ["amended", "Amended"],
        ["corrected", "Corrected"],
        ["entered-in-error", "Entered in error"],
    ])("an %s result shows its value with its words beside it", (status, words) => {
        const root = mount({ value: "5.9", status, statusLabel: words });
        expect(root.querySelector(".observation-view-value")?.textContent).toBe("5.9");
        expect(root.querySelector(".observation-view-status")?.textContent).toBe(words);
    });

    test.each([
        ["cancelled", "Test cancelled"],
        ["masked", "Withheld"],
    ])("a %s result shows its words instead of a value", (status, words) => {
        const root = mount({ value: "5.9", status, statusLabel: words });
        expect(root.querySelector(".observation-view-value")).toBeNull();
        expect(root.querySelector(".observation-view-status")?.textContent).toBe(words);
    });

    test("label renders as hidden text, not aria-label", () => {
        const root = mount({ label: "Potassium", value: "4.1" });
        expect(root.querySelector(".screen-reader-span")?.textContent).toBe("Potassium ");
        expect(root.hasAttribute("aria-label")).toBe(false);
    });

    test("warns when an abnormal flag or a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        mount({ value: "5.9", interpretation: "H" });
        mount({ status: "unavailable" });
        const messages = spy.mock.calls.map((call) => String(call[0]));
        expect(messages.some((m) => m.includes("has no flagLabel"))).toBe(true);
        expect(messages.some((m) => m.includes("has no statusLabel"))).toBe(true);
    });

    test("not-applicable replaces the value with the consumer's words", () => {
        const root = mount({ value: "", status: "not-applicable", statusLabel: "Not applicable" });
        expect(root.getAttribute("data-status")).toBe("not-applicable");
        expect(root.querySelector(".observation-view-status")?.textContent).toBe("Not applicable");
        expect(root.querySelector(".observation-view-value")).toBeNull();
    });
});
