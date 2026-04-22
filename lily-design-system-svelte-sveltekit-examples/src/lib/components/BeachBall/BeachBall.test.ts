import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import BeachBall from "./BeachBall.svelte";

describe("BeachBall", () => {
    test("renders the component", () => {
        render(BeachBall, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
