import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TaskBar from "./TaskBar.svelte";

describe("TaskBar", () => {
    test("renders the component", () => {
        render(TaskBar, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
