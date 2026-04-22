import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import FileDialog from "./FileDialog.svelte";

describe("FileDialog", () => {
    test("renders the component", () => {
        render(FileDialog, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
