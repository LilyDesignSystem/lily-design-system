import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GrailLayoutCenterMain from "./GrailLayoutCenterMain.svelte";

describe("GrailLayoutCenterMain", () => {
    test("renders with content", () => {
        render(GrailLayoutCenterMain, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("grail-layout-center-main");
    });
});
