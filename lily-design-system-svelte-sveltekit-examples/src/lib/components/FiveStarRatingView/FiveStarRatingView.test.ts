import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import FiveStarRatingView from "./FiveStarRatingView.svelte";

describe("FiveStarRatingView", () => {
    test("renders the component", () => {
        render(FiveStarRatingView, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
