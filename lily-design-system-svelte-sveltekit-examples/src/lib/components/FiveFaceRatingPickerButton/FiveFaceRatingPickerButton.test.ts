import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import FiveFaceRatingPickerButton from "./FiveFaceRatingPickerButton.svelte";

describe("FiveFaceRatingPickerButton", () => {
    test("renders the component", () => {
        render(FiveFaceRatingPickerButton, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
