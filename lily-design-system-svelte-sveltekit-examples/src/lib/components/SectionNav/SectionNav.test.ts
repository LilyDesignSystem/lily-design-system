import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SectionNav from "./SectionNav.svelte";

describe("SectionNav", () => {
    test("renders the component", () => {
        render(SectionNav, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
