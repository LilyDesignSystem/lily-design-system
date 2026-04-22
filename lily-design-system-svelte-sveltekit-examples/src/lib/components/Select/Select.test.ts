import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Select from "./Select.svelte";

describe("Select", () => {
    test("renders the component", () => {
        render(Select, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
