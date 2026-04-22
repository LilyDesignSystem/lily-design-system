import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Button from "./Button.svelte";

describe("Button", () => {
    test("renders the component", () => {
        render(Button, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
