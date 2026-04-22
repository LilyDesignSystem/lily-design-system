import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CharacterCounter from "./CharacterCounter.svelte";

describe("CharacterCounter", () => {
    test("renders the component", () => {
        render(CharacterCounter, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
