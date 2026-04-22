import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import HoverCard from "./HoverCard.svelte";

describe("HoverCard", () => {
    test("renders the component", () => {
        render(HoverCard, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
