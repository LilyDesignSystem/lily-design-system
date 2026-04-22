import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TaskList from "./TaskList.svelte";

describe("TaskList", () => {
    test("renders the component", () => {
        render(TaskList, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
