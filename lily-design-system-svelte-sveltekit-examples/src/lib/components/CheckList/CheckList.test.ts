import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CheckList from "./CheckList.svelte";

describe("CheckList", () => {
    test("renders the component", () => {
        render(CheckList, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
