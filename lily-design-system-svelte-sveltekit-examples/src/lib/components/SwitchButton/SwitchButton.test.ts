import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SwitchButton from "./SwitchButton.svelte";

describe("SwitchButton", () => {
    test("renders the component", () => {
        render(SwitchButton, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
