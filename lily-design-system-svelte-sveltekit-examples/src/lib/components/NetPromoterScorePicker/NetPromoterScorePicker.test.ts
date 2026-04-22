import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import NetPromoterScorePicker from "./NetPromoterScorePicker.svelte";

describe("NetPromoterScorePicker", () => {
    test("renders the component", () => {
        render(NetPromoterScorePicker, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
