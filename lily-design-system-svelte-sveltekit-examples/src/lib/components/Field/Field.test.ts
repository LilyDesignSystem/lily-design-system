import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Field from "./Field.svelte";

describe("Field", () => {
    test("renders the component", () => {
        render(Field, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
