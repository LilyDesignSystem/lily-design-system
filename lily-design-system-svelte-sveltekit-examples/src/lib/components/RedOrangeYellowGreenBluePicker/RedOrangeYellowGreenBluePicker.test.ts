import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import RedOrangeYellowGreenBluePicker from "./RedOrangeYellowGreenBluePicker.svelte";

describe("RedOrangeYellowGreenBluePicker", () => {
    test("renders the component", () => {
        render(RedOrangeYellowGreenBluePicker, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
