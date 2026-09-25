import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CanadaSocialInsuranceNumberInput from "./CanadaSocialInsuranceNumberInput.svelte";

describe("CanadaSocialInsuranceNumberInput", () => {
    test("renders with content", () => {
        render(CanadaSocialInsuranceNumberInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("canada-social-insurance-number-input");
    });
});
