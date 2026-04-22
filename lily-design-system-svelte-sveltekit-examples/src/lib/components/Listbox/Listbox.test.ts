import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Listbox from "./Listbox.svelte";

describe("Listbox", () => {
    test("renders the component", () => {
        render(Listbox, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
