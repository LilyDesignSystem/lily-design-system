import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SegmentGroup from "./SegmentGroup.svelte";

describe("SegmentGroup", () => {
    test("renders the component", () => {
        render(SegmentGroup, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
