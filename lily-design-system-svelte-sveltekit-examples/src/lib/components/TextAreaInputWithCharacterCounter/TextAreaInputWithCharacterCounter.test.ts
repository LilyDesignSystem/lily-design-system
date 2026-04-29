import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TextAreaInputWithCharacterCounter from "./TextAreaInputWithCharacterCounter.svelte";

describe("TextAreaInputWithCharacterCounter", () => {
    test("renders the component", () => {
        render(TextAreaInputWithCharacterCounter, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
