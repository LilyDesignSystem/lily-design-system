import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignRespiratoryRateAsBreathsPerMinuteView.svelte";

describe("VitalSignRespiratoryRateAsBreathsPerMinuteView", () => {
    test("renders span with img role", () => {
        render(Subject, { props: { value: 16, label: "16 breaths per minute" } });
        expect(screen.getByRole("img", { name: "16 breaths per minute" })).toBeTruthy();
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { value: 16, label: "16 breaths per minute" } });
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("16 breaths per minute");
    });

    test("displays value as text content", () => {
        render(Subject, { props: { value: 16, label: "16 breaths per minute" } });
        expect(screen.getByRole("img").textContent).toBe("16");
    });

    test("has data-value attribute", () => {
        render(Subject, { props: { value: 28, label: "28 breaths per minute" } });
        expect(screen.getByRole("img").getAttribute("data-value")).toBe("28");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: 16, label: "R", "data-testid": "vs" } });
        expect(screen.getByTestId("vs")).toBeTruthy();
    });
});
