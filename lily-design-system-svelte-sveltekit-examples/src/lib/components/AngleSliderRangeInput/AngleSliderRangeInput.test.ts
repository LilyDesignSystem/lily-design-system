import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import AngleSliderRangeInput from "./AngleSliderRangeInput.svelte";

describe("AngleSliderRangeInput", () => {
    test("renders the component", () => {
        render(AngleSliderRangeInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
