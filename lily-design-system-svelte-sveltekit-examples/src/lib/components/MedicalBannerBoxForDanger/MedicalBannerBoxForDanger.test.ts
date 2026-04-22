import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MedicalBannerBoxForDanger from "./MedicalBannerBoxForDanger.svelte";

describe("MedicalBannerBoxForDanger", () => {
    test("renders the component", () => {
        render(MedicalBannerBoxForDanger, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
