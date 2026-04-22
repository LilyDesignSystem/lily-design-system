import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import BreadcrumbListItem from "./BreadcrumbListItem.svelte";

describe("BreadcrumbListItem", () => {
    test("renders the component", () => {
        render(BreadcrumbListItem, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
