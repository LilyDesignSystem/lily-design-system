import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TagGroup from "./TagGroup.svelte";

describe("TagGroup", () => {
    test("renders the component", () => {
        render(TagGroup, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
