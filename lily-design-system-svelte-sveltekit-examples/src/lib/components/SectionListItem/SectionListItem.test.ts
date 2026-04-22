import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SectionListItem from "./SectionListItem.svelte";

describe("SectionListItem", () => {
    test("renders the component", () => {
        render(SectionListItem, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
