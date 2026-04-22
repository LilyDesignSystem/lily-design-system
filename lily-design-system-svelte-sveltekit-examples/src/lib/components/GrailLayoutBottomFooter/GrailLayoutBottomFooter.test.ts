import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GrailLayoutBottomFooter from "./GrailLayoutBottomFooter.svelte";

describe("GrailLayoutBottomFooter", () => {
    test("renders with content", () => {
        render(GrailLayoutBottomFooter, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("grail-layout-bottom-footer");
    });
});
