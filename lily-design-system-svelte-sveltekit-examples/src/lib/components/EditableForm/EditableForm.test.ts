import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import EditableForm from "./EditableForm.svelte";

describe("EditableForm", () => {
    test("renders the component", () => {
        render(EditableForm, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
