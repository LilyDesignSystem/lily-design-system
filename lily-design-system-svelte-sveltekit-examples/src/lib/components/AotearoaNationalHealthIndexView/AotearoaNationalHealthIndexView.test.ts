import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import AotearoaNationalHealthIndexView from "./AotearoaNationalHealthIndexView.svelte";

describe("AotearoaNationalHealthIndexView", () => {
    test("renders with content", () => {
        render(AotearoaNationalHealthIndexView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("aotearoa-national-health-index-view");
    });
});
