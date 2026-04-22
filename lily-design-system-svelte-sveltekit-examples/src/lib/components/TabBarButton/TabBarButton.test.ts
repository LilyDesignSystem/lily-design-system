import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TabBarButton from "./TabBarButton.svelte";

describe("TabBarButton", () => {
    test("renders the component", () => {
        render(TabBarButton, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
