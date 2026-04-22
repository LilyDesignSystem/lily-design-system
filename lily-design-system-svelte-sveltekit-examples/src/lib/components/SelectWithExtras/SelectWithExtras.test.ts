import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SelectWithExtras from "./SelectWithExtras.svelte";

describe("SelectWithExtras", () => {
    test("renders the component", () => {
        render(SelectWithExtras, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
