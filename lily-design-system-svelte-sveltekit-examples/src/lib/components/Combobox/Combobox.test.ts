import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Combobox from "./Combobox.svelte";

describe("Combobox", () => {
    test("renders the component", () => {
        render(Combobox, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
