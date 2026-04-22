import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Textarea from "./Textarea.svelte";

describe("Textarea", () => {
    test("renders the component", () => {
        render(Textarea, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
