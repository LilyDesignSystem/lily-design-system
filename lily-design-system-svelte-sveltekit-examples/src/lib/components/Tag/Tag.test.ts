import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Tag from "./Tag.svelte";

describe("Tag", () => {
    test("renders the component", () => {
        render(Tag, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
