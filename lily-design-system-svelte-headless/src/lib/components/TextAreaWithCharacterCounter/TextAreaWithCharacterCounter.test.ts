import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TextAreaWithCharacterCounter from "./TextAreaWithCharacterCounter.svelte";

describe("TextAreaWithCharacterCounter", () => {
    test("renders with content", () => {
        render(TextAreaWithCharacterCounter, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("text-area-with-character-counter");
    });
});
