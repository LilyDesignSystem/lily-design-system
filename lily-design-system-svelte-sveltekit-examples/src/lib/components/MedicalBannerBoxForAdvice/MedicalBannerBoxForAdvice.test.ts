import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MedicalBannerBoxForAdvice from "./MedicalBannerBoxForAdvice.svelte";

describe("MedicalBannerBoxForAdvice", () => {
    test("renders the component", () => {
        render(MedicalBannerBoxForAdvice, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
