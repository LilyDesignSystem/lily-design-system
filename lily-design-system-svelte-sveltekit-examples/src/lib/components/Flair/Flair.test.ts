import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Flair from "./Flair.svelte";

describe("Flair", () => {
    test("renders the component", () => {
        render(Flair, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
