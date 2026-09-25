import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import LuxembourgMatriculeInput from "./LuxembourgMatriculeInput.svelte";

describe("LuxembourgMatriculeInput", () => {
    test("renders with content", () => {
        render(LuxembourgMatriculeInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("luxembourg-matricule-input");
    });
});
