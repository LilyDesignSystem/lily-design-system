import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TaskListItem from "./TaskListItem.svelte";

describe("TaskListItem", () => {
    test("renders the component", () => {
        render(TaskListItem, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
