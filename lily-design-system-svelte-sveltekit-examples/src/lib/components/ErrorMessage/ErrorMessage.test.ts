import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ErrorMessage from "./ErrorMessage.svelte";

describe("ErrorMessage", () => {
    test("renders the component", () => {
        render(ErrorMessage, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
