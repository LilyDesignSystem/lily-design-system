import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CallToAction from "./CallToAction.svelte";

describe("CallToAction", () => {
    test("renders the component", () => {
        render(CallToAction, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
