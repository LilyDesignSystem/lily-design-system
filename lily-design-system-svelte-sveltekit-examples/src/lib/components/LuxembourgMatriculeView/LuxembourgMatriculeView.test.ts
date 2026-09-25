import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import LuxembourgMatriculeView from "./LuxembourgMatriculeView.svelte";

describe("LuxembourgMatriculeView", () => {
    test("renders with content", () => {
        render(LuxembourgMatriculeView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("luxembourg-matricule-view");
    });
});
