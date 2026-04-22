import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Character from "./Character.svelte";

describe("Character", () => {
    test("renders the component", () => {
        render(Character, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
