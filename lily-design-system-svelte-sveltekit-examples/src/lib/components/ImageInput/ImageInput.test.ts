import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ImageInput from "./ImageInput.svelte";

describe("ImageInput", () => {
    test("renders with content", () => {
        render(ImageInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("image-input");
    });
});
