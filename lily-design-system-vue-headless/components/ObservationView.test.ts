import { render } from "@testing-library/vue";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./ObservationView.vue";

const part = (c: Element, name: string) => c.querySelector(`.observation-view-${name}`);

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("ObservationView", () => {
    test("renders a span with value, unit, flag and range", () => {
        const { container } = render(Subject, {
            props: {
                value: "5.9",
                unit: "mmol/L",
                interpretation: "H",
                flagLabel: "High",
                range: "3.5–5.3",
            },
        });
        const root = container.querySelector(".observation-view") as HTMLElement;
        expect(root.tagName).toBe("SPAN");
        expect(root.getAttribute("data-interpretation")).toBe("H");
        expect(part(container, "value")?.textContent).toBe("5.9");
        expect(part(container, "unit")?.textContent).toBe("mmol/L");
        expect(part(container, "flag")?.textContent).toBe("High");
        expect(part(container, "range")?.textContent).toBe("3.5–5.3");
        expect(root.textContent).toContain("5.9 mmol/L");
    });

    test("not-recorded and unavailable show different words, never a blank", () => {
        const a = render(Subject, {
            props: { status: "not-recorded", statusLabel: "Not recorded" },
        });
        expect(part(a.container, "status")?.textContent).toBe("Not recorded");
        expect(part(a.container, "value")).toBeNull();
        const b = render(Subject, {
            props: { status: "unavailable", statusLabel: "Result unavailable" },
        });
        expect(part(b.container, "status")?.textContent).toBe("Result unavailable");
    });

    test("label renders as hidden text, not aria-label", () => {
        const { container } = render(Subject, { props: { label: "Potassium", value: "4.1" } });
        const root = container.querySelector(".observation-view") as HTMLElement;
        expect(root.querySelector(".screen-reader-span")?.textContent).toBe("Potassium ");
        expect(root.hasAttribute("aria-label")).toBe(false);
    });

    test("warns when an abnormal flag or a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { value: "5.9", interpretation: "H" } });
        render(Subject, { props: { status: "unavailable" } });
        const messages = spy.mock.calls.map((call) => String(call[0]));
        expect(messages.some((m) => m.includes("has no flagLabel"))).toBe(true);
        expect(messages.some((m) => m.includes("has no statusLabel"))).toBe(true);
    });
});
