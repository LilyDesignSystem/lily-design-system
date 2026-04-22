import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import FiveStarRatingPickerButton from "./FiveStarRatingPickerButton.svelte";

describe("FiveStarRatingPickerButton", () => {
    test("renders the component", () => {
        render(FiveStarRatingPickerButton, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
