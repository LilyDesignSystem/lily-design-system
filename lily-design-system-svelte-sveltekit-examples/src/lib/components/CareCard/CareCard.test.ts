import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CareCard from "./CareCard.svelte";

describe("CareCard", () => {
    test("renders the component", () => {
        render(CareCard, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
