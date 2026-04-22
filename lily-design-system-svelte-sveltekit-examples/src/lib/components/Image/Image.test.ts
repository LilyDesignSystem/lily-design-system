import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Image from "./Image.svelte";

describe("Image", () => {
    test("renders the component", () => {
        render(Image, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
