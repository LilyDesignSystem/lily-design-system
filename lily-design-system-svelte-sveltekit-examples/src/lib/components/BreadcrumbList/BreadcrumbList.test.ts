import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import BreadcrumbList from "./BreadcrumbList.svelte";

describe("BreadcrumbList", () => {
    test("renders the component", () => {
        render(BreadcrumbList, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
