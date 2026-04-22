import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Caption from "./Caption.svelte";

describe("Caption", () => {
    test("renders the component", () => {
        render(Caption, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
