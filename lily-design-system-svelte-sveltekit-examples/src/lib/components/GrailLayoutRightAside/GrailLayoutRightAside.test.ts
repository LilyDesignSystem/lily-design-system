import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GrailLayoutRightAside from "./GrailLayoutRightAside.svelte";

describe("GrailLayoutRightAside", () => {
    test("renders with content", () => {
        render(GrailLayoutRightAside, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("grail-layout-right-aside");
    });
});
