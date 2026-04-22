import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import FiveStarRatingPicker from "./FiveStarRatingPicker.svelte";

describe("FiveStarRatingPicker", () => {
    test("renders the component", () => {
        render(FiveStarRatingPicker, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
