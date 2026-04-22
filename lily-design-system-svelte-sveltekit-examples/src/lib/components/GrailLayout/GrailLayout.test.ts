import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GrailLayout from "./GrailLayout.svelte";

describe("GrailLayout", () => {
    test("renders with content", () => {
        render(GrailLayout, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("grail-layout");
    });
});
