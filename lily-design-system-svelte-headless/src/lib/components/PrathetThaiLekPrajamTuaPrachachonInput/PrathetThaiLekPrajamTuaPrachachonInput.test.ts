import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import PrathetThaiLekPrajamTuaPrachachonInput from "./PrathetThaiLekPrajamTuaPrachachonInput.svelte";

describe("PrathetThaiLekPrajamTuaPrachachonInput", () => {
    test("renders with content", () => {
        render(PrathetThaiLekPrajamTuaPrachachonInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("prathet-thai-lek-prajam-tua-prachachon-input");
    });
});
