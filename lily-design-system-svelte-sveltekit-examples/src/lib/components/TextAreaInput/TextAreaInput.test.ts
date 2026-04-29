import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TextAreaInput from "./TextAreaInput.svelte";

describe("TextAreaInput", () => {
    test("renders the component", () => {
        render(TextAreaInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
