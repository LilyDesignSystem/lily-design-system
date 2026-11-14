import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { EarlyWarningScoreView } from "./EarlyWarningScoreView";

function mount(inputs: Record<string, unknown>) {
    const fixture = TestBed.createComponent(EarlyWarningScoreView);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector(".early-warning-score-view") as HTMLElement;
}

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("EarlyWarningScoreView", () => {
    test("renders system, score, band and escalation", () => {
        const root = mount({
            system: "NEWS2",
            score: 7,
            band: "high",
            bandLabel: "High",
            escalation: "Urgent response",
        });
        expect(root.getAttribute("data-band")).toBe("high");
        expect(root.querySelector(".early-warning-score-view-system")?.textContent).toBe("NEWS2");
        expect(root.querySelector(".early-warning-score-view-score")?.textContent).toBe("7");
        expect(root.querySelector(".early-warning-score-view-band")?.textContent).toBe("High");
        expect(root.querySelector(".early-warning-score-view-escalation")?.textContent).toBe(
            "Urgent response",
        );
    });

    test("warns when a band has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        mount({ score: 7, band: "high" });
        expect(spy.mock.calls.some((call) => String(call[0]).includes("has no bandLabel"))).toBe(
            true,
        );
    });
});
