import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MutuallyExclusive from "./MutuallyExclusive.svelte";

describe("MutuallyExclusive", () => {
    test("renders the component", () => {
        render(MutuallyExclusive, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
