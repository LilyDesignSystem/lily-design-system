import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import RossiyaSnilsView from "./RossiyaSnilsView.svelte";

describe("RossiyaSnilsView", () => {
    test("renders with content", () => {
        render(RossiyaSnilsView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("rossiya-snils-view");
    });
});
