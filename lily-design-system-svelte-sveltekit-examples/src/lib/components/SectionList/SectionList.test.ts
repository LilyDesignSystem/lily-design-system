import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SectionList from "./SectionList.svelte";

describe("SectionList", () => {
    test("renders the component", () => {
        render(SectionList, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
