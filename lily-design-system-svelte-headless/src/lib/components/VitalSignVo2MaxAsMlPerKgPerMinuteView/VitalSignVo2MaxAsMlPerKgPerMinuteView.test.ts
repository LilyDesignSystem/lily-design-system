import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignVO2MaxAsMlPerKgPerMinuteView.svelte";

describe("VitalSignVO2MaxAsMlPerKgPerMinuteView", () => {
    test("renders span with img role", () => {
        render(Subject, { props: { value: 42, label: "42 ml/kg/min VO2 max" } });
        expect(screen.getByRole("img", { name: "42 ml/kg/min VO2 max" })).toBeTruthy();
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { value: 42, label: "42 ml/kg/min VO2 max" } });
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("42 ml/kg/min VO2 max");
    });

    test("displays value as text content", () => {
        render(Subject, { props: { value: 42, label: "42 ml/kg/min VO2 max" } });
        expect(screen.getByRole("img").textContent).toBe("42");
    });

    test("has data-value attribute", () => {
        render(Subject, { props: { value: 70, label: "70 ml/kg/min VO2 max" } });
        expect(screen.getByRole("img").getAttribute("data-value")).toBe("70");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: 42, label: "P", "data-testid": "vs" } });
        expect(screen.getByTestId("vs")).toBeTruthy();
    });
});
