import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ProgressCircle from "./ProgressCircle.svelte";

describe("ProgressCircle", () => {
    test("renders the component", () => {
        render(ProgressCircle, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
