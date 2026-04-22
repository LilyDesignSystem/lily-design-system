import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ImageFileInput from "./ImageFileInput.svelte";

describe("ImageFileInput", () => {
    test("renders the component", () => {
        render(ImageFileInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
