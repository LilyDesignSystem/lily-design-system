import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Meter from "./Meter.svelte";

describe("Meter", () => {
    test("renders the component", () => {
        render(Meter, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
