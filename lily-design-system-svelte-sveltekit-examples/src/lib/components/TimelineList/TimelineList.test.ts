import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TimelineList from "./TimelineList.svelte";

describe("TimelineList", () => {
    test("renders the component", () => {
        render(TimelineList, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
