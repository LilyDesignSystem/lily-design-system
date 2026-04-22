import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Timer from "./Timer.svelte";

describe("Timer", () => {
    test("renders the component", () => {
        render(Timer, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
