import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MeasurementSystemInput from "./MeasurementSystemInput.svelte";

describe("MeasurementSystemInput", () => {
    test("renders the component", () => {
        render(MeasurementSystemInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
