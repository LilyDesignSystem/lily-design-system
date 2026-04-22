import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Form from "./Form.svelte";

describe("Form", () => {
    test("renders the component", () => {
        render(Form, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
