import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MeasurementInstanceInput from "./MeasurementInstanceInput.svelte";

describe("MeasurementInstanceInput", () => {
    test("renders the component", () => {
        render(MeasurementInstanceInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
