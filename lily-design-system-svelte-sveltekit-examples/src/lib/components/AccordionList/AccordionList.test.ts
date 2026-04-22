import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import AccordionList from "./AccordionList.svelte";

describe("AccordionList", () => {
    test("renders the component", () => {
        render(AccordionList, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
