import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TextAreaInputWithCharacterCounter from "./TextAreaInputWithCharacterCounter.svelte";

describe("TextAreaInputWithCharacterCounter", () => {
    test("renders with content", () => {
        render(TextAreaInputWithCharacterCounter, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("text-area-input-with-character-counter");
    });
});
