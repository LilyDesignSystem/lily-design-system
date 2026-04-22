import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SuccessPanel from "./SuccessPanel.svelte";

describe("SuccessPanel", () => {
    test("renders the component", () => {
        render(SuccessPanel, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
