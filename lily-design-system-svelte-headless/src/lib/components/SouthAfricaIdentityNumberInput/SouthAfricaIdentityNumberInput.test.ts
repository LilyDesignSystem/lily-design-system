import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SouthAfricaIdentityNumberInput from "./SouthAfricaIdentityNumberInput.svelte";

describe("SouthAfricaIdentityNumberInput", () => {
    test("renders with content", () => {
        render(SouthAfricaIdentityNumberInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("south-africa-identity-number-input");
    });
});
