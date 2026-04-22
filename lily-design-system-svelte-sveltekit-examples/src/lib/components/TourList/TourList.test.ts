import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TourList from "./TourList.svelte";

describe("TourList", () => {
    test("renders the component", () => {
        render(TourList, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
