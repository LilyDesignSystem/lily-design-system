import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import NetPromoterScorePickerButton from "./NetPromoterScorePickerButton.svelte";

describe("NetPromoterScorePickerButton", () => {
    test("renders the component", () => {
        render(NetPromoterScorePickerButton, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
