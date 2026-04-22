import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignBodyFatAsPercentageInput from "./VitalSignBodyFatAsPercentageInput.svelte";

describe("VitalSignBodyFatAsPercentageInput", () => {
    test("renders with content", () => {
        render(VitalSignBodyFatAsPercentageInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-body-fat-as-percentage-input");
    });
});
