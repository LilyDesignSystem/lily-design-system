import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import RedAmberGreenPickerButton from "./RedAmberGreenPickerButton.svelte";

describe("RedAmberGreenPickerButton", () => {
    test("renders the component", () => {
        render(RedAmberGreenPickerButton, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
