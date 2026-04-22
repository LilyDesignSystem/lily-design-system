import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import WarningCallout from "./WarningCallout.svelte";

describe("WarningCallout", () => {
    test("renders the component", () => {
        render(WarningCallout, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
