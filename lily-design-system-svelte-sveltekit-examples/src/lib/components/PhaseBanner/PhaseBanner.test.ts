import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import PhaseBanner from "./PhaseBanner.svelte";

describe("PhaseBanner", () => {
    test("renders the component", () => {
        render(PhaseBanner, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
