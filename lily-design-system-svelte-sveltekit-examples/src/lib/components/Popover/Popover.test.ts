import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Popover from "./Popover.svelte";

describe("Popover", () => {
    test("renders the component", () => {
        render(Popover, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
