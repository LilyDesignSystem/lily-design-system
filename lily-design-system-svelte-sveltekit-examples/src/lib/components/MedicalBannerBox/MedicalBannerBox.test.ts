import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MedicalBannerBox from "./MedicalBannerBox.svelte";

describe("MedicalBannerBox", () => {
    test("renders the component", () => {
        render(MedicalBannerBox, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
