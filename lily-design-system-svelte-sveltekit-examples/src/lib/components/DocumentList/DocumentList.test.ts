import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DocumentList from "./DocumentList.svelte";

describe("DocumentList", () => {
    test("renders the component", () => {
        render(DocumentList, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
