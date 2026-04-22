import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DescriptionListItem from "./DescriptionListItem.svelte";

describe("DescriptionListItem", () => {
    test("renders the component", () => {
        render(DescriptionListItem, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
