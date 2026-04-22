import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SegmentGroupItem from "./SegmentGroupItem.svelte";

describe("SegmentGroupItem", () => {
    test("renders the component", () => {
        render(SegmentGroupItem, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
