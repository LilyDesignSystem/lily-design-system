import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import AccordionNav from "./AccordionNav.svelte";

describe("AccordionNav", () => {
    test("renders the component", () => {
        render(AccordionNav, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
