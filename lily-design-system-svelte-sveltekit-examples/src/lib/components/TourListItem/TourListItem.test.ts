import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TourListItem from "./TourListItem.svelte";

describe("TourListItem", () => {
    test("renders the component", () => {
        render(TourListItem, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
