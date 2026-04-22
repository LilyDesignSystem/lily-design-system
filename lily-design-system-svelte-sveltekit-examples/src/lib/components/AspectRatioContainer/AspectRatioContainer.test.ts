import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import AspectRatioContainer from "./AspectRatioContainer.svelte";

describe("AspectRatioContainer", () => {
    test("renders the component", () => {
        render(AspectRatioContainer, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
