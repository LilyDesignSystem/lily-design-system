import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Resizable from "./Resizable.svelte";

describe("Resizable", () => {
    test("renders the component", () => {
        render(Resizable, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
