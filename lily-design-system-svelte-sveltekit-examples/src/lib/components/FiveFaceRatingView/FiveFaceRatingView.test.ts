import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import FiveFaceRatingView from "./FiveFaceRatingView.svelte";

describe("FiveFaceRatingView", () => {
    test("renders the component", () => {
        render(FiveFaceRatingView, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
