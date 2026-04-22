import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SummaryList from "./SummaryList.svelte";

describe("SummaryList", () => {
    test("renders the component", () => {
        render(SummaryList, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
