import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TextAreaWithCharacterCounter from "./TextAreaWithCharacterCounter.svelte";

describe("TextAreaWithCharacterCounter", () => {
    test("renders the component", () => {
        render(TextAreaWithCharacterCounter, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
