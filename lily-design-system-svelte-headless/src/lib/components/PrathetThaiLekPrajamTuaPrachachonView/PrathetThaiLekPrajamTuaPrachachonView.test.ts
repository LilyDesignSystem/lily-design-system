import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import PrathetThaiLekPrajamTuaPrachachonView from "./PrathetThaiLekPrajamTuaPrachachonView.svelte";

describe("PrathetThaiLekPrajamTuaPrachachonView", () => {
    test("renders with content", () => {
        render(PrathetThaiLekPrajamTuaPrachachonView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("prathet-thai-lek-prajam-tua-prachachon-view");
    });
});
