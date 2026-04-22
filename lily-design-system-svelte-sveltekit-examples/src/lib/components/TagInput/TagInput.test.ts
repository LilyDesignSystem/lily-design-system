import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TagInput from "./TagInput.svelte";

describe("TagInput", () => {
    test("renders the component", () => {
        render(TagInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
