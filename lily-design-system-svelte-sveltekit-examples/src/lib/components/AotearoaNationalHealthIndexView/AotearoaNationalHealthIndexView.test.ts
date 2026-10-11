import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./AotearoaNationalHealthIndexView.svelte";

describe("AotearoaNationalHealthIndexView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "National Health Index (NHI) Number", value: "test-value" } });

        const el = screen.getByLabelText("National Health Index (NHI) Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("aotearoa-national-health-index-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "National Health Index (NHI) Number", value: "test-value" } });

        const el = screen.getByLabelText("National Health Index (NHI) Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "National Health Index (NHI) Number" } });

        const el = screen.getByLabelText("National Health Index (NHI) Number");
        expect(el.getAttribute("aria-label")).toBe("National Health Index (NHI) Number");
    });
});
