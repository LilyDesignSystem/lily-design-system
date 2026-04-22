import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import RangeInput from "./RangeInput.svelte";

describe("RangeInput", () => {
    test("renders the component", () => {
        render(RangeInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
