import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import RedAmberGreenPicker from "./RedAmberGreenPicker.svelte";

describe("RedAmberGreenPicker", () => {
    test("renders the component", () => {
        render(RedAmberGreenPicker, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
