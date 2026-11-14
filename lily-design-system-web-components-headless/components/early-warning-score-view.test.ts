import { afterEach, describe, expect, test, vi } from "vitest";

import { EarlyWarningScoreView } from "./early-warning-score-view.js";

if (!customElements.get("lily-early-warning-score-view"))
    customElements.define("lily-early-warning-score-view", EarlyWarningScoreView);

afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body;
}

describe("EarlyWarningScoreView", () => {
    test("renders system, score, band and escalation", () => {
        const body = render(
            `<lily-early-warning-score-view system="NEWS2" score="7" band="high" band-label="High" escalation="Urgent response"></lily-early-warning-score-view>`,
        );
        const root = body.querySelector("span.early-warning-score-view") as HTMLElement;
        expect(root.getAttribute("data-band")).toBe("high");
        expect(root.querySelector(".early-warning-score-view-system")?.textContent).toBe("NEWS2");
        expect(root.querySelector(".early-warning-score-view-score")?.textContent).toBe("7");
        expect(root.querySelector(".early-warning-score-view-band")?.textContent).toBe("High");
        expect(root.querySelector(".early-warning-score-view-escalation")?.textContent).toBe(
            "Urgent response",
        );
    });
});
