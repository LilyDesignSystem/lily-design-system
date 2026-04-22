import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import FileUpload from "./FileUpload.svelte";

describe("FileUpload", () => {
    test("renders the component", () => {
        render(FileUpload, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
