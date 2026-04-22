import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DontList from "./DontList.svelte";

describe("DontList", () => {
    test("renders the component", () => {
        render(DontList, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
