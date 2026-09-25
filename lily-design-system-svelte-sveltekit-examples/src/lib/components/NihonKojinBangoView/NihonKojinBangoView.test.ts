import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import NihonKojinBangoView from "./NihonKojinBangoView.svelte";

describe("NihonKojinBangoView", () => {
    test("renders with content", () => {
        render(NihonKojinBangoView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("nihon-kojin-bango-view");
    });
});
