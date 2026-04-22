import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignWaistCircumferenceAsCmView.svelte";

describe("VitalSignWaistCircumferenceAsCmView", () => {
    test("renders span with img role", () => {
        render(Subject, { props: { value: 94, label: "94 cm waist circumference" } });
        expect(screen.getByRole("img", { name: "94 cm waist circumference" })).toBeTruthy();
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { value: 94, label: "94 cm waist circumference" } });
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("94 cm waist circumference");
    });

    test("displays value as text content", () => {
        render(Subject, { props: { value: 94, label: "94 cm waist circumference" } });
        expect(screen.getByRole("img").textContent).toBe("94");
    });

    test("has data-value attribute", () => {
        render(Subject, { props: { value: 110, label: "110 cm waist circumference" } });
        expect(screen.getByRole("img").getAttribute("data-value")).toBe("110");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: 94, label: "P", "data-testid": "vs" } });
        expect(screen.getByTestId("vs")).toBeTruthy();
    });
});
