import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import FiveFaceRatingPicker from "./FiveFaceRatingPicker.svelte";

describe("FiveFaceRatingPicker", () => {
    test("renders the component", () => {
        render(FiveFaceRatingPicker, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
