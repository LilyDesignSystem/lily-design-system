import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Sidebar from "./Sidebar.svelte";

describe("Sidebar", () => {
    test("renders the component", () => {
        render(Sidebar, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
