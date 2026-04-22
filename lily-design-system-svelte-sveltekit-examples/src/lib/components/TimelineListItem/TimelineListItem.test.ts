import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TimelineListItem from "./TimelineListItem.svelte";

describe("TimelineListItem", () => {
    test("renders the component", () => {
        render(TimelineListItem, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
