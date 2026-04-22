import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TextInput from "./TextInput.svelte";

describe("TextInput", () => {
    test("renders the component", () => {
        render(TextInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
