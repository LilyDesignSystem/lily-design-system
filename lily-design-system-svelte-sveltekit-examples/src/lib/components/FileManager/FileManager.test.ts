import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import FileManager from "./FileManager.svelte";

describe("FileManager", () => {
    test("renders the component", () => {
        render(FileManager, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
