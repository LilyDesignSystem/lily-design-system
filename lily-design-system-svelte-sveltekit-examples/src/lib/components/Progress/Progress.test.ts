import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Progress from "./Progress.svelte";

describe("Progress", () => {
    test("renders the component", () => {
        render(Progress, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
