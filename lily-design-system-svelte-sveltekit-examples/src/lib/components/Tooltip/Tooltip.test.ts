import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Tooltip from "./Tooltip.svelte";

describe("Tooltip", () => {
    test("renders the component", () => {
        render(Tooltip, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
