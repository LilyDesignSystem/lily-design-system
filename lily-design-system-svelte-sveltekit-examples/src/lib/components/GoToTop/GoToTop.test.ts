import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GoToTop from "./GoToTop.svelte";

describe("GoToTop", () => {
    test("renders the component", () => {
        render(GoToTop, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
