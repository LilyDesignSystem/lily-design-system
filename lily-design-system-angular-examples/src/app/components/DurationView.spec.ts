import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { DurationView } from "./DurationView";

function mount(inputs: Record<string, unknown>) {
    const fixture = TestBed.createComponent(DurationView);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector(".duration-view") as HTMLElement;
}

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("DurationView", () => {
    test("renders a time whose datetime is the duration, holding the consumer's words", () => {
        const root = mount({ value: "3 days 4 hours", duration: "P3DT4H" });
        expect(root.tagName).toBe("TIME");
        expect(root.getAttribute("datetime")).toBe("P3DT4H");
        expect(root.textContent).toBe("3 days 4 hours");
    });

    test("a negative duration keeps its length as datetime and is marked data-negative", () => {
        const root = mount({ value: "3 days early", duration: "-P3D" });
        expect(root.getAttribute("datetime")).toBe("P3D");
        expect(root.hasAttribute("data-negative")).toBe(true);
    });

    test("a duration in years is no datetime, and warns", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const root = mount({ value: "2 years", duration: "P2Y" });
        expect(root.hasAttribute("datetime")).toBe(false);
        expect(warn).toHaveBeenCalledWith(expect.stringContaining("DurationView has no duration"));
    });

    test("names the value with hidden text when a label is given", () => {
        const root = mount({ value: "4 days", duration: "P4D", label: "Length of stay" });
        expect(root.textContent).toBe("Length of stay 4 days");
    });
});
