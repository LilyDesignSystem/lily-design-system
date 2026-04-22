import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import AccordionListItem from "./AccordionListItem.svelte";

describe("AccordionListItem", () => {
    test("renders the component", () => {
        render(AccordionListItem, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
