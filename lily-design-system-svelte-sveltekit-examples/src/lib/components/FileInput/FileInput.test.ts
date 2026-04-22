import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import FileInput from "./FileInput.svelte";

describe("FileInput", () => {
    test("renders the component", () => {
        render(FileInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
