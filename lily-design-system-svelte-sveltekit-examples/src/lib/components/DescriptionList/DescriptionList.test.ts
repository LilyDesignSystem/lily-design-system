import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DescriptionList from "./DescriptionList.svelte";

describe("DescriptionList", () => {
    test("renders the component", () => {
        render(DescriptionList, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
