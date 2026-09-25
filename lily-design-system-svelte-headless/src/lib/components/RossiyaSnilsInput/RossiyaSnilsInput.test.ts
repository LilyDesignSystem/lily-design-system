import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import RossiyaSnilsInput from "./RossiyaSnilsInput.svelte";

describe("RossiyaSnilsInput", () => {
    test("renders with content", () => {
        render(RossiyaSnilsInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("rossiya-snils-input");
    });
});
