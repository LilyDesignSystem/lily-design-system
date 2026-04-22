import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import RedAmberGreenView from "./RedAmberGreenView.svelte";

describe("RedAmberGreenView", () => {
    test("renders the component", () => {
        render(RedAmberGreenView, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
