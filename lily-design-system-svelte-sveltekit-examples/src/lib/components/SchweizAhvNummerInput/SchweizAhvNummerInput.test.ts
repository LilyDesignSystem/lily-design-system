import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SchweizAhvNummerInput from "./SchweizAhvNummerInput.svelte";

describe("SchweizAhvNummerInput", () => {
    test("renders with content", () => {
        render(SchweizAhvNummerInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("schweiz-ahv-nummer-input");
    });
});
