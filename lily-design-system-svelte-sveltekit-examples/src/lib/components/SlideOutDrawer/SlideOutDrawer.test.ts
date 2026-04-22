import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SlideOutDrawer from "./SlideOutDrawer.svelte";

describe("SlideOutDrawer", () => {
    test("renders the component", () => {
        render(SlideOutDrawer, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
