import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GrailLayoutLeftAside from "./GrailLayoutLeftAside.svelte";

describe("GrailLayoutLeftAside", () => {
    test("renders with content", () => {
        render(GrailLayoutLeftAside, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("grail-layout-left-aside");
    });
});
