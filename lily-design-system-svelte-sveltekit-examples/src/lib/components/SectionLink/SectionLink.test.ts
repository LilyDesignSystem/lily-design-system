import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SectionLink from "./SectionLink.svelte";

describe("SectionLink", () => {
    test("renders the component", () => {
        render(SectionLink, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
