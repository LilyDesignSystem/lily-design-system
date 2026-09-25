import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import BharatAadhaarInput from "./BharatAadhaarInput.svelte";

describe("BharatAadhaarInput", () => {
    test("renders with content", () => {
        render(BharatAadhaarInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("bharat-aadhaar-input");
    });
});
