import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DoList from "./DoList.svelte";

describe("DoList", () => {
    test("renders the component", () => {
        render(DoList, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
