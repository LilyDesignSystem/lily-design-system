import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SchweizAhvNummerView from "./SchweizAhvNummerView.svelte";

describe("SchweizAhvNummerView", () => {
    test("renders with content", () => {
        render(SchweizAhvNummerView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("schweiz-ahv-nummer-view");
    });
});
