import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import AiLabel from "./AiLabel.svelte";

describe("AiLabel", () => {
    test("renders with content", () => {
        render(AiLabel, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("ai-label");
    });
});
