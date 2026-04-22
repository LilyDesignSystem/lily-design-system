import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Badge from "./Badge.svelte";

describe("Badge", () => {
    test("renders the component", () => {
        render(Badge, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
