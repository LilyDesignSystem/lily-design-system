import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ContentsNav from "./ContentsNav.svelte";

describe("ContentsNav", () => {
    test("renders the component", () => {
        render(ContentsNav, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
