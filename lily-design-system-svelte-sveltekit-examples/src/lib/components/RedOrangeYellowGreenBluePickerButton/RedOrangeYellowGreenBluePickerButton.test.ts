import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import RedOrangeYellowGreenBluePickerButton from "./RedOrangeYellowGreenBluePickerButton.svelte";

describe("RedOrangeYellowGreenBluePickerButton", () => {
    test("renders the component", () => {
        render(RedOrangeYellowGreenBluePickerButton, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
