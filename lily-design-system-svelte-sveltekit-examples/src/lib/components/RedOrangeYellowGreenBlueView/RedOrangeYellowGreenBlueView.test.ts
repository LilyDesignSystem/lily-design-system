import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import RedOrangeYellowGreenBlueView from "./RedOrangeYellowGreenBlueView.svelte";

describe("RedOrangeYellowGreenBlueView", () => {
    test("renders the component", () => {
        render(RedOrangeYellowGreenBlueView, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
