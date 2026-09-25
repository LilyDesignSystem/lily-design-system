import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import BharatAadhaarView from "./BharatAadhaarView.svelte";

describe("BharatAadhaarView", () => {
    test("renders with content", () => {
        render(BharatAadhaarView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("bharat-aadhaar-view");
    });
});
