import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import PinInputDiv from "./PinInputDiv.svelte";

describe("PinInputDiv", () => {
    test("renders the component", () => {
        render(PinInputDiv, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
