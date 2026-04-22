import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignBloodPressureSystolicAsMmhgView.svelte";

describe("VitalSignBloodPressureSystolicAsMmhgView", () => {
    test("renders span with img role", () => {
        render(Subject, { props: { value: 120, label: "120 mmHg systolic" } });
        expect(screen.getByRole("img", { name: "120 mmHg systolic" })).toBeTruthy();
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { value: 120, label: "120 mmHg systolic" } });
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("120 mmHg systolic");
    });

    test("displays value as text content", () => {
        render(Subject, { props: { value: 120, label: "120 mmHg systolic" } });
        expect(screen.getByRole("img").textContent).toBe("120");
    });

    test("has data-value attribute", () => {
        render(Subject, { props: { value: 140, label: "140 mmHg systolic" } });
        expect(screen.getByRole("img").getAttribute("data-value")).toBe("140");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: 120, label: "S", "data-testid": "vs" } });
        expect(screen.getByTestId("vs")).toBeTruthy();
    });
});
