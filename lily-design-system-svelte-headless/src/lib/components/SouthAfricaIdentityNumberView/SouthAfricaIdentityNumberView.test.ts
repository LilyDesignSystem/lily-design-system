import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SouthAfricaIdentityNumberView from "./SouthAfricaIdentityNumberView.svelte";

describe("SouthAfricaIdentityNumberView", () => {
    test("renders with content", () => {
        render(SouthAfricaIdentityNumberView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("south-africa-identity-number-view");
    });
});
