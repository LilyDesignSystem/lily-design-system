import { render } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./EarlyWarningScoreView";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("EarlyWarningScoreView", () => {
    test("renders system, score, band and escalation", () => {
        const { container } = render(
            <Subject
                system="NEWS2"
                score={7}
                band="high"
                bandLabel="High"
                escalation="Urgent response"
            />,
        );
        const root = container.querySelector(".early-warning-score-view") as HTMLElement;
        expect(root.getAttribute("data-band")).toBe("high");
        expect(root.querySelector(".early-warning-score-view-score")?.textContent).toBe("7");
        expect(root.querySelector(".early-warning-score-view-band")?.textContent).toBe("High");
        expect(root.querySelector(".early-warning-score-view-escalation")?.textContent).toBe(
            "Urgent response",
        );
    });

    test("warns when a band has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(
            <Subject
                score={7}
                band="high"
            />,
        );
        expect(spy.mock.calls.some((call) => String(call[0]).includes("has no bandLabel"))).toBe(
            true,
        );
    });
});
