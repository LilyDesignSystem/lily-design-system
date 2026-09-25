import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CanadaSocialInsuranceNumberView from "./CanadaSocialInsuranceNumberView.svelte";

describe("CanadaSocialInsuranceNumberView", () => {
    test("renders with content", () => {
        render(CanadaSocialInsuranceNumberView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("canada-social-insurance-number-view");
    });
});
