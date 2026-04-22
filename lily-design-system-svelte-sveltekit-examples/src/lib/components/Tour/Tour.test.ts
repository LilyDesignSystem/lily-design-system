import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Tour from "./Tour.svelte";

describe("Tour", () => {
    test("renders the component", () => {
        render(Tour, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
