import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignBodyFatAsPercentageInput.svelte";

describe("VitalSignBodyFatAsPercentageInput", () => {
    test("renders a number input", () => {
        render(Subject, { props: { label: "Body fat percentage" } });
        expect((screen.getByLabelText("Body fat percentage") as HTMLInputElement).type).toBe("number");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "Body fat percentage" } });
        expect(screen.getByLabelText("Body fat percentage")).toBeTruthy();
    });

    test("has default min=0, max=100, step=0.1", () => {
        render(Subject, { props: { label: "BFP" } });
        const input = screen.getByLabelText("BFP") as HTMLInputElement;
        expect(input.min).toBe("0");
        expect(input.max).toBe("100");
        expect(input.step).toBe("0.1");
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "BFP", disabled: true } });
        expect((screen.getByLabelText("BFP") as HTMLInputElement).disabled).toBe(true);
    });

    test("supports required", () => {
        render(Subject, { props: { label: "BFP", required: true } });
        expect((screen.getByLabelText("BFP") as HTMLInputElement).required).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "BFP", "data-testid": "bf" } });
        expect(screen.getByTestId("bf")).toBeTruthy();
    });
});
