import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Sonner from "./Sonner.svelte";

describe("Sonner", () => {
    test("renders the component", () => {
        render(Sonner, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
