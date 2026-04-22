import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import BackToTop from "./BackToTop.svelte";

describe("BackToTop", () => {
    test("renders the component", () => {
        render(BackToTop, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
