import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TaskBarButton from "./TaskBarButton.svelte";

describe("TaskBarButton", () => {
    test("renders the component", () => {
        render(TaskBarButton, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
