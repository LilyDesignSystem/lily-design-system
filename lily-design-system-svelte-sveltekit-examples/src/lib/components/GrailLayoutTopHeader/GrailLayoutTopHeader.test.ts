import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GrailLayoutTopHeader from "./GrailLayoutTopHeader.svelte";

describe("GrailLayoutTopHeader", () => {
    test("renders with content", () => {
        render(GrailLayoutTopHeader, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("grail-layout-top-header");
    });
});
