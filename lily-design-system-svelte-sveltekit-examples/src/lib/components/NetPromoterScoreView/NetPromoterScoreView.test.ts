import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import NetPromoterScoreView from "./NetPromoterScoreView.svelte";

describe("NetPromoterScoreView", () => {
    test("renders the component", () => {
        render(NetPromoterScoreView, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
