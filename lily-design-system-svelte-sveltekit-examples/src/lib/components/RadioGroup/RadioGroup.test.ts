import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import RadioGroup from "./RadioGroup.svelte";

describe("RadioGroup", () => {
    test("renders the component", () => {
        render(RadioGroup, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
